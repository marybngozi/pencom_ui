<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <h4 class="mb-4">List Company Admin Staff</h4>

      <!-- List of staff -->
      <div class="mt-5 pb-4">
        <b-table
          id="my-table"
          :fields="fields"
          outlined
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
            <router-link
              class="btn btn-sm btn-primary"
              :to="`assign-menu/${data.item.agentId.rsaPin}`"
            >
              Assign Menu
            </router-link>

            <button
              class="btn btn-sm btn-danger mx-3"
              @click="deleteStaff(data.item.agentId.rsaPin)"
            >
              Delete
            </button>
          </template>
        </b-table>

        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
          size="sm"
          limit="10"
          page-class="text-blue"
          next-class="text-blue"
        >
        </b-pagination>
      </div>
    </div>
  </section>
</template>
<script>
import { secureAxios } from "../../services/AxiosInstance";

export default {
  name: "ListAdminStaff",
  data() {
    return {
      getting: false,
      deleting: false,
      perPage: 10,
      currentPage: 1,
      items: [],
      fields: [
        {
          key: "id",
          label: "ID",
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
          label: "Actions",
        },
      ],
    };
  },
  async beforeCreate() {
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
  computed: {
    rows() {
      return this.items.length;
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
</style>
