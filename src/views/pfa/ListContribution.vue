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

        <div class="mt-3">
          <label class="d-flex justify-content-between" for="dateStart">
            <span> Date range (From) </span>
            <span class="fs-8 text-info">Based on the date of payment</span>
          </label>
          <input
            id="dateStart"
            v-model="form.dateStart"
            class="form-control input"
            type="date"
            placeholder="dd/mm/yyyy"
          />
        </div>

        <div class="mt-2">
          <label for="dateEnd"> Date range (To) </label>
          <input
            id="dateEnd"
            v-model="form.dateEnd"
            class="form-control input"
            type="date"
            placeholder="dd/mm/yyyy"
          />
          <small v-if="dateNotReady" class="text-danger">
            Both dates should be provided or none
          </small>
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

          <template #cell(period)="data">
            {{ $months[data.item.month] }}, {{ data.item.year }}
          </template>

          <template #cell(paymentStatus)="data">
            <span v-if="data.value == 0">Not Paid</span>
            <span v-if="data.value == 1">Paid</span>
          </template>

          <template #cell(amount)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(action)="data">
            <button
              class="btn btn-sm btn-info m-1"
              @click="fetchItems(data.item.invoiceNo)"
            >
              Show Items
            </button>

            <button
              class="btn btn-sm btn-secondary m-1"
              @click="downloadItems(data.item.invoiceNo)"
            >
              Download
            </button>

            <router-link
              class="btn btn-sm btn-info m-1"
              :to="`schedule-mandate/${data.item.invoiceNo}`"
            >
              Mandate
            </router-link>

            <router-link
              v-if="data.item.paymentStatus == 0"
              class="btn btn-sm btn-primary m-1"
              :to="`make-payment/${data.item.invoiceNo}`"
            >
              Make Payment
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
          responsive
          striped
          :busy="fetching"
          hover
          :items="fetchedItems"
          :per-page="perPage"
          :current-page="currentPageItem"
          show-empty
        >
          <template #cell(pfc)="data">
            {{ data.value.pfcName }}
          </template>

          <template #cell(pfa)="data">
            {{ data.value.pfaName }}
          </template>

          <template #cell(createdAt)="data">
            {{ data.value | moment("DD-MM-YYYY") }}
          </template>

          <template #cell(amount)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(rsaPin)="data">
            {{ data.item.item.rsaPin }}
          </template>

          <template #cell(employeeNormalContribution)="data">
            {{ data.item.item.employeeNormalContribution | toCurrency }}
          </template>

          <template #cell(employerNormalContribution)="data">
            {{ data.item.item.employerNormalContribution | toCurrency }}
          </template>

          <template #cell(employeeVoluntaryContribution)="data">
            {{ data.item.item.employeeVoluntaryContribution | toCurrency }}
          </template>

          <template #cell(employerVoluntaryContribution)="data">
            {{ data.item.item.employerVoluntaryContribution | toCurrency }}
          </template>

          <template #cell(staffName)="data">
            {{ data.item.item.firstName }} {{ data.item.item.lastName }}
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
  name: "ListContribution",
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
        dateStart: null,
        dateEnd: null,
      },
      items: [],
      fields: [
        {
          key: "itemCode",
          label: "Item",
        },
        {
          key: "period",
          label: "Period",
        },
        {
          key: "invoiceNo",
          label: "Invoice No",
        },
        {
          key: "paymentStatus",
          label: "Payment Status",
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
          key: "pfc",
          label: "PFC",
        },
        {
          key: "pfa",
          label: "PFA",
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
          key: "employeeNormalContribution",
          label: "Employee Normal Contribution",
        },
        {
          key: "employerNormalContribution",
          label: "Employer Normal Contribution",
        },
        {
          key: "employeeVoluntaryContribution",
          label: "Employee Voluntary Contribution",
        },
        {
          key: "employerVoluntaryContribution",
          label: "Employer Voluntary Contribution",
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

      const api = "payment/get-batch-contribution";
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

    dateNotReady() {
      return (
        (this.form.dateStart && !this.form.dateEnd) ||
        (!this.form.dateStart && this.form.dateEnd)
      );
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
        if (!this.dateNotReady) {
          this.$swal({
            icon: "error",
            text: "Both dates have to be provided",
          });
          return;
        }

        this.getting = true;

        const api = "payment/get-batch-contribution";
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

        const api = "payment/get-item-contribution";

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

    async downloadItems(invoiceNo) {
      try {
        this.fetching = true;

        const api = "schedule/download-processed-items";

        const res = await secureAxios.post(
          api,
          { invoiceNo },
          { responseType: "blob" }
        );

        this.fetching = false;
        if (!res) {
          return;
        }

        const fileURL = window.URL.createObjectURL(
          new Blob([res.data], { type: "application/vnd.ms-excel" })
        );
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Processed_schedule.xlsx");
        document.body.appendChild(fileLink);

        fileLink.click();
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
