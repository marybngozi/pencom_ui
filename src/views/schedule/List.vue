<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <h4 class="mb-4">List Uploaded Schedule</h4>

      <!-- Top section -->
      <div class="d-flex justify-content-around">
        <div class="form w-60">
          <div class="mt-4">
            <label for="itemCode">
              <span class="text-danger">*</span>
              Item
            </label>
            <select
              name="itemCode"
              v-model="form.itemCode"
              id="itemCode"
              class="form-control"
            >
              <option :value="null">- select an Item -</option>
              <option
                v-for="item in allItems"
                :value="item.itemCode"
                :key="item.itemCode"
              >
                {{ item.itemName }}
              </option>
            </select>
          </div>

          <div class="mt-3">
            <label class="d-flex justify-content-between" for="dateStart">
              <span> Date range (From) </span>
              <span class="fs-8 text-info">Based on the date of upload</span>
            </label>
            <input
              id="dateStart"
              v-model="form.dateStart"
              class="form-control input"
              type="date"
              placeholder="new password"
            />
          </div>

          <div class="mt-2">
            <label for="dateEnd"> Date range (To) </label>
            <input
              id="dateEnd"
              v-model="form.dateEnd"
              class="form-control input"
              type="date"
              placeholder="repeat new password"
            />
            <small v-if="dateNotReady" class="text-danger">
              Both dates should be provided or none
            </small>
          </div>

          <button
            :disabled="!getReady || getting"
            @click="getBatches()"
            class="btn mt-4 w-100 button"
          >
            <span>Get Schedule</span>
            <span
              v-if="getting"
              class="spinner-border spinner-border-sm text-light ml-3"
              role="status"
            ></span>
          </button>
        </div>

        <div class="w-40 d-flex align-items-center">
          <div class="alert alert-info" role="alert">
            <h5 class="">View uploaded schedules</h5>
            <ul>
              <li class="my-2 mx-1">
                You can view your uploaded schedules that has <b>not</b> been
                processed or paid
              </li>
              <li class="m-1">
                You can delete a batch or a single schedule in a batch
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Batch list table -->
      <div v-if="items.length" class="mt-5 mb-4">
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
          <template #cell(createdAt)="data">
            {{ data.value | moment("DD-MM-YYYY") }}
          </template>

          <template #cell(period)="data">
            {{ $months[data.item.month] }}, {{ data.item.year }}
          </template>

          <template #cell(amount)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(action)="data">
            <button
              class="btn btn-sm btn-primary mr-2"
              @click="getItems([data.item._id])"
            >
              View Schedules
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteSchedule([data.item._id])"
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

      <!-- Items modal -->
      <b-modal
        id="show-items"
        size="xl"
        scrollable
        :cancel-disabled="true"
        title="Schedule Items"
      >
        <b-table
          id="item-table"
          :fields="fieldsItem"
          outlined
          small
          striped
          :busy="fetching"
          hover
          :items="fetchedItems"
          :per-page="perPage"
          :current-page="currentPageItem"
          show-empty
        >
          <template #cell(createdAt)="data">
            {{ data.value | moment("DD-MM-YYYY") }}
          </template>

          <template #cell(amount)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(staffName)="data">
            {{ data.item.firstName }} {{ data.item.lastName }}
          </template>

          <template #cell(action)="data">
            <button
              class="btn btn-sm btn-danger"
              @click="removeSchedule([data.item.id])"
            >
              Delete
            </button>
          </template>
        </b-table>

        <b-pagination
          v-model="currentPageItem"
          :total-rows="rowsItem"
          :per-page="perPage"
          aria-controls="item-table"
          size="sm"
          limit="10"
        >
        </b-pagination>
      </b-modal>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";

export default {
  name: "ListSchdeule",
  data() {
    return {
      getting: false,
      deleting: false,
      fetching: false,
      deleteBatch: false,
      perPage: 10,
      currentPage: 1,
      currentPageItem: 1,
      fetchedItems: [],
      selectedItems: [],
      form: {
        itemCode: null,
        dateStart: null,
        dateEnd: null,
      },
      items: [],
      fields: [
        {
          key: "_id",
          label: "Batch ID",
        },
        {
          key: "period",
          label: "Period",
        },
        {
          key: "amount",
          label: "Total Amount",
        },
        {
          key: "createdAt",
          label: "Uploaded on",
        },
        {
          key: "action",
          label: "Actions",
        },
      ],
      fieldsItem: [
        {
          key: "staffName",
          label: "Staff Name",
        },
        {
          key: "rsaPin",
          label: "RSA PIN",
        },
        {
          key: "amount",
          label: "Total Amount",
        },
        {
          key: "createdAt",
          label: "Uploaded",
        },
        {
          key: "action",
          label: "Actions",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["allItems"]),

    rows() {
      return this.items.length;
    },
    rowsItem() {
      return this.fetchItems.length;
    },
    getReady() {
      return this.form.itemCode && !this.dateNotReady;
    },
    dateNotReady() {
      return (
        (this.form.dateStart && !this.form.dateEnd) ||
        (!this.form.dateStart && this.form.dateEnd)
      );
    },
  },

  methods: {
    async getBatches() {
      if (!this.getReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.getting = true;

        const api = "schedule/list-batch";
        const res = await secureAxios.post(api, this.form);

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

    async fetchItems(uploadBatchId) {
      try {
        this.fetching = true;

        const api = "schedule/list-schedule";

        const res = await secureAxios.post(api, { uploadBatchId });

        this.fetching = false;
        if (!res) {
          return [];
        }

        const { data } = res;

        return data.data;
      } catch (err) {
        console.log(err);
        this.fetching = false;
      }
    },

    async getItems(uploadBatchId) {
      this.fetchedItems = await this.fetchItems(uploadBatchId);

      if (!this.fetchedItems.length) return;
      this.$bvModal.show("show-items");
    },

    async deleteSchedule(uploadBatchId) {
      this.selectedItems = await this.fetchItems(uploadBatchId);

      this.deleteBatch = true;
      await this.removeSchedule(this.selectedItems.map((item) => item.id));

      // refresh the table data
      this.getBatches();
    },

    async removeSchedule(arr) {
      // warn
      const adj = arr.length > 1 ? "this batch of" : "this";
      const result = await this.$swal({
        icon: "question",
        title: `Are you sure you want to remove ${adj} schedule?`,
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        this.deleting = true;

        const api = "schedule/remove";

        const res = await secureAxios.post(api, { deleteArr: arr });

        this.deleting = false;
        if (!res) {
          return;
        }

        const { data } = res;

        if (!this.deleteBatch) {
          this.fetchedItems = this.fetchedItems.filter(
            (item) => item.id != arr[0]
          );
        }

        this.deleteBatch = false;

        this.$swal({
          icon: "success",
          text: data.message,
        });
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
