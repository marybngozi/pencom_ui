<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <h4 class="mb-4">Assign Staff Menu</h4>

      <!-- loader for fetching datas -->
      <section
        v-if="settingUp"
        style="height: 60vh"
        class="d-flex justify-content-center align-items-center"
      >
        <b-spinner
          style="width: 3rem; height: 3rem"
          variant="secondary"
          label="Large Spinner"
        ></b-spinner>
      </section>

      <section v-else class="row justify-content-between px-4 mt-4">
        <div class="col-md-4 pl-4">
          <p class="border-bottom py-2">
            <span class="font-weight-lighter">Staff RSA:</span>
            {{ staffData.rsaPin }}
          </p>
          <p class="border-bottom py-2">
            <span class="font-weight-lighter">Staff name:</span>
            {{ staffData.firstName }} {{ staffData.lastName }}
          </p>
        </div>

        <form action="#" @submit.prevent class="col-md-7 border-left">
          <h6 class="mb-4">Choose Menus</h6>
          <!-- for main menus -->
          <div
            v-for="(menu, i) in filteredMenus"
            :key="i"
            class="form-group form-check border-bottom"
          >
            <input
              type="checkbox"
              :checked="menu.checked"
              :value="menu.id"
              @change="selectAllSub"
              class="form-check-input"
              :id="'menu' + menu.id"
            />
            <label class="form-check-label" :for="'menu' + menu.id">
              {{ menu.name }}
            </label>

            <!-- for sub Menus -->
            <div
              v-for="(submenu, i) in menu.subMenus"
              :key="i"
              class="form-group form-check ml-3"
            >
              <input
                type="checkbox"
                :checked="submenu.checked"
                :value="`${menu.id}_${submenu.id}`"
                @change="selectOneSub"
                :class="'form-check-input menu' + menu.id"
                :id="submenu.id"
              />
              <label class="form-check-label" :for="submenu.id">{{
                submenu.name
              }}</label>
            </div>
          </div>

          <div class="form-group mt-5 text-center px-3">
            <button
              class="btn button w-100"
              :disabled="assigning"
              type="submit"
              @click.prevent="assignMenu()"
            >
              <span class="mr-3">Assign Menu</span>
              <span
                v-if="assigning"
                class="spinner-border spinner-border-sm"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </span>
            </button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
export default {
  name: "AssignMenu",

  data() {
    return {
      settingUp: true,
      assigning: false,
      staffMenus: [],
      userMenus: [],
      selectedMenus: [],
      staffData: null,
      filteredMenus: [],
    };
  },

  async created() {
    // get the staff's menu
    try {
      const rsaPin = this.$route.params.rsaPin;
      const companyCode = this.$store.getters.companyCode;

      if (!rsaPin) {
        this.$router.push({ name: "company-staff" });
      }

      this.settingUp = true;

      /* get staff menus */
      const apiS = "stat/staff-menus";
      const resS = await secureAxios.post(apiS, {
        companyCode: companyCode,
        rsaPin: rsaPin,
      });

      /* get company menus */
      const apiC = "stat/company-menus";
      const resC = await secureAxios.get(apiC);

      /* get staff data */
      const apiD = `auth/staffs/${rsaPin}`;
      const resD = await secureAxios.get(apiD);

      if (!resS || !resC || !resD) {
        this.settingUp = false;
        this.$router.push({ name: "company-staff" });
        return;
      }

      const { data: dataS } = resS;
      const { data: dataC } = resC;
      const { data: dataD } = resD;

      this.staffMenus = dataS.data;
      this.userMenus = dataC.data;
      this.staffData = dataD.data;
      this.filterMenu();

      this.settingUp = false;
    } catch (err) {
      console.log(err);
      this.settingUp = false;
    }
  },

  computed: {
    ...mapGetters(["companyCode"]),

    assignReady() {
      return this.selectedMenus.length > 0;
    },
  },

  methods: {
    filterMenu() {
      this.filteredMenus = this.userMenus.map((menu) => {
        const subMenus = menu.subMenus;
        let menuStatus = true;

        const newSubMenus = subMenus.map((subMenu) => {
          const menuIdx = this.staffMenus.findIndex(
            (aMenu) => aMenu == subMenu.id
          );
          const isChecked = menuIdx >= 0 ? true : false;

          if (!isChecked) {
            menuStatus = false;
          } else {
            this.staffMenus.splice(menuIdx, 1);
            console.log(menuIdx);
            this.selectedMenus.push({
              menuId: menu.id,
              subMenuId: subMenu.id,
            });
          }

          return {
            ...subMenu,
            checked: isChecked,
          };
        });

        menu.subMenus = newSubMenus;

        return {
          ...menu,
          checked: menuStatus,
        };
      });
    },

    async assignMenu() {
      // warn
      const result = await this.$swal({
        icon: "question",
        title: "Are you sure you want to assign these menus to this staff?",
        text: "This staff will be able to perform actions under the assigned menu for this company",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        this.assigning = true;
        const selectedStaffMenus = this.selectedMenus.map((m) => m.subMenuId);

        const api = "stat/update-staff-menus";
        const res = await secureAxios.post(api, {
          subMenuIds: [...new Set([...this.staffMenus, ...selectedStaffMenus])],
          userId: this.staffData.id,
        });

        // 6376f58da11c3d47691f0a54
        this.assigning = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.$swal({
          icon: "success",
          text: data.message,
        });
      } catch (err) {
        console.log(err);
        this.assigning = false;
      }
    },

    selectOneSub(e) {
      const val = e.target.defaultValue;
      const [menuId, subMenuId] = val.split("_");

      // if box is checked
      if (e.target.checked) {
        // add to the selected

        this.selectedMenus.push({
          menuId,
          subMenuId,
        });
        return;
      }

      // if box is un-checked, remove value from selected
      const dIndex = this.selectedMenus.findIndex(
        (menu) => menu.subMenuId == subMenuId
      );
      this.selectedMenus.splice(dIndex, 1);

      // check if no other submenu in a menu is selected
      const cIndex = this.selectedMenus.findIndex(
        (menu) => menu.menuId == menuId
      );
      if (cIndex < 0) {
        document.querySelector(`#menu${menuId}`).checked = false;
      }
    },

    selectAllSub(e) {
      const menuId = e.target.defaultValue;

      // indicate that these submenus with the classname has been selected
      console.log(e.target.id);
      const classname = e.target.id;
      const subCheckBoxes = document.querySelectorAll(`.${classname}`);

      // filter out the menus for that menuId
      this.selectedMenus = this.selectedMenus.filter(
        (sm) => sm.menuId != menuId
      );

      // if box is un-checked
      if (!e.target.checked) {
        subCheckBoxes.forEach((box) => {
          box.checked = false;
        });
        return;
      }

      // if box is checked
      const menu = this.filteredMenus.find((menu) => menu.id == menuId);
      // get the submenus from the menu
      const subMenus = menu.subMenus;

      // then add all submenu to the selected list
      for (let f = 0; f < subMenus.length; f++) {
        const subMenu = subMenus[f];

        this.selectedMenus.push({
          menuId,
          subMenuId: subMenu.id,
        });
      }

      // indicate that submenu boxes are checked
      subCheckBoxes.forEach((box) => {
        box.checked = true;
      });
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/dashboard.css";
</style>
