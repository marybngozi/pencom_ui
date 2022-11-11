<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <div class="form">
        <h4 class="mb-4">List Processed Schedule</h4>

        <div class="mt-4">
          <label for="itemCode"> Item </label>
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

        <div class="mt-4">
          <label class="d-flex justify-content-between" for="year">
            <span> Year </span>
            <span class="fs-8 text-info">As contained in the upload</span>
          </label>
          <select
            name="year"
            v-model="form.year"
            id="year"
            class="form-control"
          >
            <option :value="null">- select a year -</option>
            <option v-for="year in years" :value="year" :key="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div class="mt-4">
          <label class="d-flex justify-content-between" for="month">
            <span> Month </span>
            <span class="fs-8 text-info">As contained in the upload</span>
          </label>
          <select
            name="month"
            v-model="form.month"
            id="month"
            class="form-control"
          >
            <option :value="null">- select a month -</option>
            <option v-for="month in $months" :value="month" :key="month">
              {{ month }}
            </option>
          </select>
        </div>

        <button
          :disabled="getting"
          @click="getProcessedSchedule"
          class="btn mt-4 w-100 button"
        >
          <span>Get Processed Schedule</span>
          <span
            v-if="getting"
            class="spinner-border spinner-border-sm text-light ml-3"
            role="status"
          ></span>
        </button>
      </div>

      <!-- Processed schedules -->
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
          <template #cell(itemCode)="data">
            {{ getItem(data.value) }}
          </template>

          <template #cell(createdAt)="data">
            {{ data.value | moment("DD-MM-YYYY") }}
          </template>

          <template #cell(amount)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(action)="data">
            <router-link
              v-if="data.item.paymentStatus == 0"
              class="btn btn-sm btn-primary mr-3"
              :to="`make-payment/${data.item.invoiceNo}`"
            >
              Make Payment
            </router-link>

            <button
              class="btn btn-sm btn-info mr-3"
              @click="fetchItems([data.item.invoiceNo])"
            >
              Show Items
            </button>
            <router-link
              class="btn btn-sm btn-info"
              :to="`schedule-mandate/${data.item.invoiceNo}`"
            >
              View Mandate
            </router-link>
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

          <template #cell(month)="data">
            {{ data.item.id.month }}
          </template>

          <template #cell(rsaPin)="data">
            {{ data.item.id.rsaPin }}
          </template>

          <template #cell(year)="data">
            {{ data.item.id.year }}
          </template>

          <template #cell(staffName)="data">
            {{ data.item.id.firstName }} {{ data.item.id.lastName }}
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
  name: "ListProcessed",
  data() {
    return {
      getting: false,
      fetching: false,
      perPage: 10,
      currentPage: 1,
      currentPageItem: 1,
      fetchedItems: [],
      form: {
        itemCode: null,
        year: null,
        month: null,
      },
      items: [],
      fields: [
        {
          key: "itemCode",
          label: "Item",
        },
        {
          key: "month",
          label: "Month",
        },
        {
          key: "year",
          label: "Year",
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
      fieldsItem: [
        {
          key: "month",
          label: "Month",
        },
        {
          key: "year",
          label: "Year",
        },
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
      ],
    };
  },
  async beforeCreate() {
    try {
      this.getting = true;

      const api = "schedule/list-processed";
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
  computed: {
    ...mapGetters(["allItems"]),

    years() {
      const yearArr = [];
      for (let i = new Date().getFullYear(); i >= 1990; i--) {
        yearArr.push(i);
      }
      return yearArr;
    },
    rows() {
      return this.items.length;
    },
    rowsItem() {
      return this.fetchedItems.length;
    },
  },

  methods: {
    getItem(itemCode) {
      const item = this.allItems.find((item) => item.itemCode == itemCode);
      return item ? item.itemName : null;
    },

    async getProcessedSchedule() {
      try {
        this.getting = true;

        const api = "schedule/list-processed";
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

    async fetchItems(invoiceNo) {
      try {
        this.fetching = true;

        const api = "schedule/list-processed-items";

        const res = await secureAxios.post(api, { invoiceNo });

        this.fetching = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.fetchedItems = data.data;
        this.$bvModal.show("show-items");
      } catch (err) {
        console.log(err);
        this.fetching = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
