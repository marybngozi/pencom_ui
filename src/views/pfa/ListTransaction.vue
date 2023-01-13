<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left-tab col-lg-9 pt-5 px-5">
      <h4>Pension Contribution Transactions</h4>

      <!-- pagination and filter details -->
      <div class="my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="show-count w-70">
            Showing {{ items.length }} of {{ rows }} Uploaded schedules
          </div>

          <div class="d-flex justify-content-between gap-3">
            <SearchInput v-model="searchVal" />

            <CustomSelectInput
              :options="years"
              :default="years[0]"
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="100px"
              height="2rem"
              lineHeight="1.875rem"
              v-model="yearOption"
            />

            <HorizontalSelect
              :items="Object.values($months)"
              :default="new Date().getMonth() - 1"
              width="126px"
              height="2rem"
              borderColor="#DDDDDD"
              color="#252A2F"
              v-model="monthOption"
            />
          </div>
        </div>

        <!-- table section -->
        <div class="table-div">
          <b-table
            id="my-table"
            class="my-table"
            :fields="fields"
            small
            :busy="getting"
            hover
            :items="items"
            :per-page="perPage"
            :current-page="currentPage"
            show-empty
          >
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>

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
                @click="getItems(data.item._id)"
                class="btn btn-sm btn-info m-1"
              >
                Show Items
              </button>

              <button
                class="btn btn-sm btn-secondary m-1"
                @click="downloadItems(data.item._id)"
              >
                Download
              </button>
            </template>
          </b-table>

          <!-- table pagination -->
          <b-pagination
            class="mt-4"
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
      </div>
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
        class="my-table"
        id="item-table"
        :fields="fieldsItem"
        small
        responsive
        striped
        :busy="fetching"
        hover
        :items="fetchItems"
        :per-page="perPage"
        :current-page="currentPageItem"
        show-empty
      >
        <template #cell(amount)="data">
          {{ data.value | toCurrency }}
        </template>

        <template #cell(employeeNormalContribution)="data">
          {{ data.value | toCurrency }}
        </template>

        <template #cell(employerNormalContribution)="data">
          {{ data.value | toCurrency }}
        </template>

        <template #cell(employeeVoluntaryContribution)="data">
          {{ data.value | toCurrency }}
        </template>

        <template #cell(employerVoluntaryContribution)="data">
          {{ data.value | toCurrency }}
        </template>
      </b-table>

      <b-pagination
        v-model="currentPageItem"
        :total-rows="rowsItem"
        :per-page="perPage"
        aria-controls="item-table"
        size="sm"
        limit="10"
        pills
        align="center"
      >
      </b-pagination>

      <template #modal-footer="{ ok }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button variant="primary" class="rounded" @click="ok()">
          Okay
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { secureAxios } from "../../services/AxiosInstance";
import SearchInput from "@/components/form/SearchInput";
import CustomSelectInput from "@/components/dashboard/CustomSelectInput";
import HorizontalSelect from "@/components/dashboard/HorizontalSelect";

export default {
  name: "PfaListTransaction",

  components: {
    SearchInput,
    CustomSelectInput,
    HorizontalSelect,
  },

  data() {
    return {
      getting: false,
      fetching: false,
      currentPageItem: 1,
      perPage: 10,
      currentPage: 1,
      batchId: null,
      companyCode: null,
      pfaCode: null,
      rowsItem: 0,
      searchVal: null,
      yearOption: null,
      monthOption: null,
      items: [],
      fields: [
        {
          key: "index",
          label: "S/N",
        },
        {
          key: "period",
          label: "Period",
        },
        {
          key: "companyName",
          label: "Company",
        },
        {
          key: "itemCount",
          label: "Staff count",
        },
        {
          key: "amount",
          label: "Total Amount",
        },
        {
          key: "createdAt",
          label: "Payment Date",
        },
        {
          key: "action",
          label: "Action",
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
          key: "amount",
          label: "Total Amount",
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
    dateNotReady() {
      return (
        (this.form.dateFrom && !this.form.dateTo) ||
        (!this.form.dateFrom && this.form.dateTo)
      );
    },

    rows() {
      return this.items.length;
    },

    years() {
      const yearArr = [];
      for (let i = new Date().getFullYear(); i >= 2000; i--) {
        yearArr.push(i);
      }
      return yearArr;
    },
  },

  methods: {
    async getProcessedSchedule() {
      try {
        if (this.dateNotReady) {
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

    async getPfas(data, { batchId, companyCode }) {
      this.batchId = batchId;
      this.companyCode = companyCode;

      data.toggleDetails();
    },

    async getItems({ batchId, companyCode, pfaCode }) {
      this.batchId = batchId;
      this.companyCode = companyCode;
      this.pfaCode = pfaCode;

      this.$bvModal.show("show-items");
    },

    async fetchItems({ currentPage, perPage }) {
      try {
        const api = `payment/get-item-contribution?page=${currentPage}&size=${perPage}`;

        const res = await secureAxios.post(api, {
          pfaCode: this.pfaCode,
          batchId: this.batchId,
          companyCode: this.companyCode,
        });

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

    async downloadItems({ batchId, companyCode, pfaCode }) {
      try {
        const loader = this.$loading.show({
          // Optional parameters
          loader: "bars",
          color: "#0b2238",
          backgroundColor: "#343232",
          height: 100,
          width: 100,
        });

        const api = "payment/download-contributions";

        const res = await secureAxios.post(
          api,
          { batchId, companyCode, pfaCode },
          { responseType: "blob" }
        );

        loader.hide();
        if (!res) {
          return;
        }

        const fileURL = window.URL.createObjectURL(
          new Blob([res.data], { type: "application/vnd.ms-excel" })
        );
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Contributions.xlsx");
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
.gap-4 {
  gap: 0.25rem;
}
</style>
