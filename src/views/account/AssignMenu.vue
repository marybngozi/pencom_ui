<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <h4 class="mb-4">Assign Staff Menu</h4>

      <section class="row justify-content-between px-4 mt-4">
        <div class="col-md-4 pl-4">
          <p class="border-bottom py-2">
            <span class="font-weight-lighter">Staff RSA:</span>
            {{ staffData.rsaPin }}
          </p>
          <p class="border-bottom py-2">
            <span class="font-weight-lighter">Staff name:</span>
            {{ staffData.firstName }} {{ staffData.firstName }}
          </p>
        </div>

        <form action="#" @submit.prevent class="col-md-7 border-left">
          <h6 class="mb-4">Choose Menus</h6>
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
            <label class="form-check-label" :for="'menu' + menu.id">{{
              menu.name
            }}</label>

            <!-- for subMenus -->
            <div
              v-for="(submenu, i) in menu.subMenus"
              :key="i"
              class="form-group form-check ml-3"
            >
              <input
                type="checkbox"
                :checked="submenu.checked"
                :value="menu.id + '_' + submenu.id"
                @change="selectOneSub"
                class="form-check-input"
                :id="'submenu' + submenu.id"
                :class="'menu' + menu.id"
              />
              <label class="form-check-label" :for="'submenu' + submenu.id">{{
                submenu.name
              }}</label>
            </div>
          </div>

          <div class="form-group mt-5 text-center px-3">
            <button
              class="btn btn-primary btn-sm w-100"
              :disabled="!this.selectedMenus.length || assigning"
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

          <!-- <pre>{{filteredMenuList}}</pre> -->
        </form>
      </section>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
// import { secureAxios } from "../../services/AxiosInstance";
export default {
  name: "AssignMenu",

  data() {
    return {
      staffMenus: null,
      selectedMenus: [],
      staffData: null,
    };
  },

  /* async beforeCreate() {
    // get the staff's menu
    try {
      const rsaPin = this.$route.params.rsaPin;
      const companyCode = this.$store.getters.companyCode;

      if (!rsaPin) {
        this.$router.push({ path: "/list-staff" });
      }

      this.getting = true;

      // get staff menus
      const api = "stat/staff-menus";
      const res = await secureAxios.post(api, {
        companyCode: companyCode,
        rsaPin: rsaPin,
      });

      // get staff data
      const apiD = `auth/staffs/${rsaPin}`;
      const resD = await secureAxios.get(apiD);

      this.getting = false;
      if (!res || !resD) {
        this.$router.push({ path: "/list-staff" });
        return;
      }

      const { data } = res;
      const { data: dataD } = resD;

      this.staffMenus = data.data;
      this.staffData = dataD.data;

      console.log(this.staffMenus);
    } catch (err) {
      console.log(err);
      this.getting = false;
    }
  }, */

  computed: {
    ...mapGetters(["userMenus", "companyCode"]),

    filteredMenus() {
      return this.userMenus.map((menu) => {
        const subMenus = menu.subMenus;
        let menuStatus = true;

        const newSubMenus = subMenus.map((subMenu) => {
          const isChecked =
            this.staffMenus.findIndex(
              (aMenu) => aMenu.menuId == subMenu.menuId
            ) != -1
              ? true
              : false;

          if (!isChecked) {
            menuStatus = false;
          } else {
            this.selectedMenus.push({
              userId: this.staffData.id,
              menuId: subMenu.id,
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
  },

  methods: {
    async assignMenu() {},

    selectAllSub(e) {
      const menuId = e.target.defaultValue;

      // indicate that these submenus with the classname has been selected
      const classname = e.target.id;
      const subCheckBoxes = document.querySelectorAll(`.${classname}`);

      // if box is checked
      if (e.target.checked) {
        const menu = this.menuList.find((menu) => menu.id == menuId);
        if (menu.hasSubMenu == 0) {
          this.selectedMenus.push({
            adminId: this.adminData.adminId,
            status: 1,
            menuId,
            subMenuId: null,
          });
        } else {
          // delete all submenus of from selected list first, if any
          for (let i = 0; i <= this.selectedMenus.length; i++) {
            const dIndex = this.selectedMenus.findIndex(
              (menu) => menu.menuId == menuId
            );
            if (dIndex >= 0) {
              this.selectedMenus.splice(dIndex, 1);
            }
          }

          // get the submenus from the menu list
          const subMenus = this.menuList.find(
            (menu) => menu.id == menuId
          ).subMenus;

          // then add all submenu to the selected list
          for (let f = 0; f < subMenus.length; f++) {
            const subMenu = subMenus[f];

            this.selectedMenus.push({
              adminId: this.adminData.adminId,
              status: 1,
              menuId,
              subMenuId: subMenu.id,
            });
          }

          // indicate that submenu boxes are checked
          subCheckBoxes.forEach((box) => {
            box.checked = true;
          });
        }
      } else {
        // if box is un-checked
        for (let i = 0; i <= this.selectedMenus.length; i++) {
          const dIndex = this.selectedMenus.findIndex(
            (menu) => menu.menuId == menuId
          );
          if (dIndex >= 0) {
            this.selectedMenus.splice(dIndex, 1);
          }
        }

        subCheckBoxes.forEach((box) => {
          box.checked = false;
        });
      }

      // console.log(this.selectedMenus);
    },
  },
};
</script>

<style scoped></style>
