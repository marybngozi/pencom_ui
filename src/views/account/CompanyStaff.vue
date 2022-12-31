<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left-tab col-lg-9 border-right pt-5 px-5">
      <h4 class="mb-4">All Sub-Admin Staff</h4>

      <div class="my-4">
        <!-- pagination info -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="show-count w-70">
            Showing {{ items.length }} of {{ rows }} Sub-Admin staff
          </div>

          <div>
            <SearchInput v-model="searchVal" />
          </div>
        </div>

        <!-- List of staff -->
        <div class="table-div">
          <b-table
            class="my-table"
            id="my-table"
            :fields="fields"
            small
            striped
            :busy="getting"
            hover
            :items="items"
            :per-page="perPage"
            :current-page="currentPage"
            show-empty
          >
            <template #cell(rsaPin)="data">
              {{ data.item.agentId.rsaPin }}
            </template>

            <template #cell(email)="data">
              {{ data.item.agentId.email }}
            </template>

            <template #cell(staffName)="data">
              {{ data.item.agentId.firstName }} {{ data.item.agentId.lastName }}
            </template>

            <template #cell(id)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(action)="data">
              <div class="d-flex gap-4">
                <router-link
                  class="btn-xsm bg-blue-light"
                  :to="`assign-menu/${data.item.agentId.rsaPin}`"
                >
                  Assign Menu
                </router-link>

                <button
                  class="btn-xsm bg-red"
                  @click="deleteStaff(data.item.agentId.rsaPin)"
                >
                  Delete
                </button>
              </div>
            </template>
          </b-table>

          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            size="sm"
            limit="8"
            pills
            align="center"
          >
          </b-pagination>
        </div>
      </div>
    </div>

    <!-- right side -->
    <div class="right-tab col-lg-3 p-0">
      <!-- Create staff Form -->
      <div class="bg-blue">
        <div class="inner-boxe">
          <h5>Create Sub-Admin Staff</h5>

          <!-- search form -->
          <form @submit.prevent="checkrsaPin" class="">
            <!-- RSA Pin inout -->
            <div class="mt-3">
              <label class="d-flex justify-content-between" for="rsaPin">
                <span>
                  <span class="text-danger">*</span>
                  Staff RSA PIN
                </span>
              </label>

              <!-- RSA input -->
              <input
                class="custom-input border-blue"
                type="text"
                placeholder="- enter staff RSA pin -"
                v-model="form.rsaPin"
              />
            </div>

            <!-- Submit button -->
            <button
              :disabled="getting"
              @click="checkrsaPin"
              class="button mt-4"
            >
              <span>Make Sub-admin Staff</span>
              <span
                v-if="getting"
                class="spinner-border spinner-border-sm text-light ml-3"
                role="status"
              ></span>
            </button>
          </form>
        </div>
      </div>

      <!-- User guide -->
      <div class="border-bottom">
        <div class="inner-boxe">
          <h6>Notice</h6>

          <div class="blue-box">
            <ul>
              <li>
                Please note that any staff to be added as a sub-admin staff must
                create account on the platform using his RSA pin first.
              </li>
              <li>
                The staff has to accept via an email link sent to his registered
                email on the system before any function can be assigned to the
                staff by the institution.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { secureAxios } from "../../services/AxiosInstance";
import SearchInput from "@/components/form/SearchInput";

export default {
  name: "CompanyStaff",

  components: {
    SearchInput,
  },

  data() {
    return {
      checking: false,
      verifying: false,
      form: {
        rsaPin: null,
      },
      searchVal: null,
      staff: null,
      getting: false,
      deleting: false,
      perPage: 10,
      currentPage: 1,
      items: [],
      fields: [
        {
          key: "id",
          label: "Staff ID",
        },
        {
          key: "staffName",
          label: "Staff Name",
        },
        {
          key: "email",
          label: "Staff Email",
        },
        {
          key: "rsaPin",
          label: "RSA PIN",
        },
        {
          key: "action",
          label: "Action",
        },
      ],
    };
  },

  async created() {
    await this.getStaffs();
  },

  computed: {
    rows() {
      return this.items.length;
    },

    rsaReady() {
      return !!this.form.rsaPin;
    },
  },

  methods: {
    async getStaffs() {
      try {
        this.getting = true;

        const api = "auth/get-staffs";
        const res = await secureAxios.get(api);

        this.getting = false;
        if (!res) {
          return;
        }

        const { data } = res;
        this.items = data.data;
      } catch (err) {
        console.log(err);
        this.getting = false;
      }
    },

    async checkrsaPin() {
      if (!this.rsaReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.checking = true;

        const api = `auth/staffs/${this.form.rsaPin}`;
        const res = await secureAxios.get(api);

        this.checking = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.staff = data.data;

        // warn
        const result = await this.$swal({
          icon: "question",
          title: `Are you sure you want to make ${this.staff.firstName} ${this.staff.lastName} an Admin staff?`,
          text: "This staff will be able to perform authorized actions for this company",
          showDenyButton: true,
          confirmButtonText: "Yes",
          denyButtonText: "No",
        });

        if (!result.isConfirmed) {
          return;
        }

        await this.makeStaff();
      } catch (err) {
        console.log(err);
        this.checking = false;
      }
    },

    async makeStaff() {
      if (!this.staff) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.checking = true;

        const api = "auth/admin-staff";
        const res = await secureAxios.post(api, this.form);

        this.checking = false;
        if (!res) {
          return;
        }

        const { data } = res;

        // clear the form
        Object.keys(this.form).forEach((key) => {
          this.form[key] = null;
        });

        this.$swal({
          icon: "success",
          text: data.message,
        });
      } catch (err) {
        console.log(err);
        this.checking = false;
      }
    },

    async deleteStaff(rsaPin) {
      try {
        // warn
        const result = await this.$swal({
          icon: "question",
          title: `Are you sure you want to remove this staff from an Admin staff of this company?`,
          showDenyButton: true,
          confirmButtonText: "Yes",
          denyButtonText: "No",
        });

        if (!result.isConfirmed) {
          return;
        }

        this.deleting = true;

        const api = "auth/delete-staff";

        const res = await secureAxios.post(api, { rsaPin });

        this.deleting = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.$swal({
          icon: "success",
          text: data.message,
        });

        // refresh data
        this.getStaffs();
      } catch (err) {
        console.log(err);
        this.deleting = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
.bg-blue {
  background: #ecf7ff;
  border-bottom: 1px solid #f2f2f2;
}
.gap-4 {
  gap: 4px;
}
</style>
