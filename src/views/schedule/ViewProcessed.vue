<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left-tab col-lg-9 border-right pt-5 px-5">
      <h4>Processed Pension Schedules</h4>

      <!-- paagination and filter details -->
      <div class="my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="show-count w-70">
            Showing {{ items.length }} of {{ rows }} Uploaded schedules
          </div>

          <div class="d-flex justify-content-between gap-3">
            <CustomSelect
              :options="statutes"
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="112px"
              height="32px"
              lineHeight="30px"
              v-model="statusOption"
            />

            <CustomSelectInput
              :options="years"
              :default="years[0]"
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="100px"
              height="32px"
              lineHeight="30px"
              v-model="yearOption"
            />
          </div>
        </div>
      </div>

      <!-- table section -->
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
        <template #cell(invoiceNo)="data">
          <span class="invoice-no">{{ data.value }}</span>
        </template>

        <template #cell(createdAt)="data">
          {{ data.value | moment("DD-MM-YYYY") }}
        </template>

        <template #cell(period)="data">
          {{ $months[data.item.month].slice(0, 3).toUpperCase() }},
          {{ data.item.year }}
        </template>

        <template #cell(paymentStatus)="data">
          <div class="text-center not-paid" v-if="data.value == 0">
            Not Paid
          </div>
          <div class="text-center paid" v-if="data.value == 1">Paid</div>
        </template>

        <template #cell(amount)="data">
          {{ data.value | toCurrency }}
        </template>

        <template #cell(action)="data">
          <router-link
            v-if="data.item.paymentStatus == 0"
            class="btn-xsm bg-blue-light m-1"
            :to="{
              name: 'schedule-make-payment',
              params: { invoiceNo: data.item.invoiceNo },
            }"
          >
            Make Payment
          </router-link>

          <router-link
            class="btn-xsm bg-blue-dark m-1"
            :to="{
              name: 'schedule-mandate',
              params: { invoiceNo: data.item.invoiceNo },
            }"
          >
            Mandate
          </router-link>

          <button
            class="btn-xsm bg-blue-dark m-1"
            @click="getItems(data.item.invoiceNo)"
          >
            Show Items
          </button>

          <button
            class="btn-xsm bg-outline-blue m-1"
            @click="downloadItems(data.item.invoiceNo)"
          >
            Download
          </button>
        </template>
      </b-table>

      <!-- table pagination -->
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        size="sm"
        limit="10"
        align="center"
        pills
      >
      </b-pagination>
    </div>

    <!-- right side -->
    <div class="right-tab col-lg-3 p-0">
      <!-- Search Form -->
      <div class="bg-blue">
        <div class="inner-boxe">
          <h5>Search Schedule</h5>

          <!-- search form -->
          <form @submit.prevent="getProcessedSchedule" class="">
            <!-- year inout -->
            <div class="mt-3">
              <label class="d-flex justify-content-between" for="year">
                <span>
                  <span class="text-danger">*</span>
                  Year
                </span>
                <span class="">Year of contribution</span>
              </label>

              <!-- Years Options -->
              <CustomSelectInput
                :options="years"
                placeHolder="- select a year -"
                class="select"
                borderColor="#D2D2D2"
                v-model="form.year"
              />
            </div>

            <!-- month input -->
            <div class="mt-4">
              <label class="d-flex justify-content-between" for="month">
                <span>
                  <span class="text-danger">*</span>
                  Month
                </span>
                <span class="">Month of contribution</span>
              </label>

              <!-- Months Options -->
              <CustomSelectInput
                :options="months"
                placeHolder="- select a month -"
                class="select"
                borderColor="#D2D2D2"
                v-model="form.month"
              />
            </div>

            <!-- Submit button -->
            <button
              :disabled="getting"
              @click="getProcessedSchedule"
              class="button mt-4"
            >
              <span>Search for schedule</span>
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
                Contains all processed file which is ready to proceed for
                payment by using the button 'Make Payment' to complete your
                payment.
              </li>
              <li>
                Payment can be made online via bank transfer, Card payments,
                USSD or visit the bank with the downloaded mandate via the link
                'Mandate' and make payment using pay direct.
              </li>
              <li>
                Use 'Download' button to download payment schedule for the
                details of the transactions.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Show Items modal -->
    <b-modal
      id="show-items"
      responsive
      size="xl"
      :cancel-disabled="true"
      title="Schedule Items"
    >
      <b-table
        class="my-table"
        id="item-table"
        :fields="fieldsItem"
        outlined
        small
        striped
        :busy="fetching"
        sticky-header="500px"
        hover
        :items="fetchItems"
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
        limit="8"
        align="center"
        pills
      >
      </b-pagination>

      <template #modal-footer="{ ok }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button class="btn-modal" @click="ok()"> OK </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
import CustomSelectInput from "@/components/dashboard/CustomSelectInput";
import CustomSelect from "@/components/dashboard/CustomSelect";

export default {
  name: "ViewProcessed",

  components: { CustomSelectInput, CustomSelect },

  data() {
    return {
      getting: false,
      fetching: false,
      perPage: 10,
      currentPage: 1,
      rowsItem: 0,
      currentPageItem: 1,
      invoiceNo: null,
      fetchedItems: [],
      yearOption: null,
      statusOption: null,
      statutes: [
        { label: "All Statutes", value: "all" },
        { label: "Pending", value: "processing" },
        { label: "Failed", value: "failure" },
        { label: "Successful", value: "success" },
      ],
      form: {
        itemCode: "7000",
        year: null,
        month: null,
      },
      items: [],
      fields: [
        {
          key: "invoiceNo",
          label: "Invoice No",
        },
        {
          key: "period",
          label: "Period",
        },
        {
          key: "amount",
          label: "Amount",
        },
        {
          key: "createdAt",
          label: "Upload Date",
        },
        {
          key: "paymentStatus",
          label: "Payment Status",
        },
        {
          key: "action",
          label: "Action",
        },
      ],
      fieldsItem: [
        {
          key: "pfc",
          label: "PFC",
          thStyle: {
            width: "300px",
          },
        },
        {
          key: "pfa",
          label: "PFA",
          thStyle: {
            width: "300px",
          },
        },
        {
          key: "staffName",
          label: "Staff Name",
          thStyle: {
            width: "200px",
          },
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
          thStyle: {
            width: "90px",
          },
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
    months() {
      const monthsArr = [];
      for (const value in this.$months) {
        if (Object.hasOwnProperty.call(this.$months, value)) {
          const label = this.$months[value];
          monthsArr.push({ label, value });
        }
      }
      return monthsArr;
    },
    rows() {
      return this.items.length;
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

    async getItems(invoiceNo) {
      this.invoiceNo = invoiceNo;

      // show the modal and get the items
      this.$bvModal.show("show-items");
    },

    async fetchItems({ currentPage }) {
      try {
        const api = `schedule/list-processed-items?page=${currentPage}`;

        const res = await secureAxios.post(api, { invoiceNo: this.invoiceNo });

        if (!res) {
          return [];
        }

        const { data } = res;

        this.rowsItem = data.meta.total;

        return data.data;
      } catch (err) {
        console.log(err);
        return [];
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
.bg-blue {
  background: #ecf7ff;
  border-bottom: 1px solid #f2f2f2;
}
.invoice-no {
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #17517e;
}
.not-paid {
  color: #ff7a00;
}
.paid {
  color: #187a33;
}
.btn-modal {
  padding: 6px 20px;
  font-size: 16px;
  background: #17517e;
  border: none;
  border-radius: 30px;
  font-weight: 700;
}
</style>
