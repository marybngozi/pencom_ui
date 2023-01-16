<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left-tab col-lg-9 border-right pt-5 px-5">
      <h4>Pension Contribution Transactions</h4>

      <!-- pagination and filter details -->
      <div class="my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="show-count w-70">
            Showing {{ showingCount }} of {{ rows }} Uploaded schedules
          </div>

          <div class="d-flex justify-content-between gap-3">
            <!-- <SearchInput v-model="searchTerm" /> -->

            <CustomSelect
              :options="$yearOptions"
              default="All years"
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="100px"
              height="2rem"
              lineHeight="1.875rem"
              v-model="yearOption"
            />

            <CustomSelectMonth
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="126px"
              height="2rem"
              lineHeight="1.875rem"
              v-model="monthOption"
            />
          </div>
        </div>

        <!-- table section -->
        <div class="table-div">
          <div class="only-table-div">
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
                {{ indexer + data.index + 1 }}
              </template>

              <template #cell(transmitted)="data">
                <span v-if="data.value" class="text-sucess">Yes</span>
                <span v-else class="text-danger">No</span>
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
                  @click="getPfas(data, data.item._id)"
                  class="btn-xsm bg-blue-dark m-1"
                >
                  {{ data.detailsShowing ? "Hide" : "Show" }} PFAs
                </button>

                <button
                  class="btn-xsm bg-outline-blue m-1"
                  @click="downloadItems(data.item._id)"
                >
                  Download
                </button>
              </template>

              <template #row-details>
                <b-card bg-variant="light">
                  <!-- START PFA INNER TABLE -->
                  <ListPfaTable
                    :batchId="batchId"
                    :companyCode="companyCode"
                    @showItems="getItems"
                    @getDownloads="downloadItems"
                    @transmit="transmit"
                  />

                  <!-- END PFA INNER TABLE -->
                </b-card>
              </template>
            </b-table>
          </div>

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

    <!-- right side -->
    <div class="right-tab col-lg-3 p-0">
      <!-- Search Form -->
      <div class="bg-blue">
        <div class="inner-boxe">
          <h5>Search</h5>

          <!-- form -->
          <form @submit.prevent="getStatus" class="">
            <!-- Companies inout -->
            <div class="mt-3">
              <label class="d-flex justify-content-between" for="company">
                <span>Company</span>
              </label>

              <!-- Companies Options -->
              <CustomSelect
                :options="companies"
                class="select"
                borderColor="#0090FF"
                color="#252A2F"
                v-model="form.company"
              />
            </div>

            <!-- Date range from input group -->
            <div class="mt-3">
              <label class="d-flex justify-content-between" for="dateStart">
                <span> Date range </span>
                <span>From</span>
              </label>

              <!-- Date range from input -->
              <input
                class="custom-input border-blue"
                type="date"
                id="dateStart"
                placeholder="- select a start date -"
                v-model="form.dateStart"
              />
            </div>

            <!-- Date range to input group -->
            <div class="mt-3">
              <label class="d-flex justify-content-between" for="dateEnd">
                <span> Date range </span>
                <span>To</span>
              </label>

              <!-- Date range to input -->
              <input
                id="dateEnd"
                class="custom-input border-blue"
                type="date"
                placeholder="- select a end date -"
                v-model="form.dateEnd"
              />
              <small v-if="dateNotReady" class="text-danger">
                Both dates should be provided or none
              </small>
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
        <b-button class="btn-xsm bg-blue-dark" @click="ok()"> Okay </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { secureAxios } from "../../services/AxiosInstance";
// import SearchInput from "@/components/form/SearchInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomSelectMonth from "@/components/form/CustomSelectMonth";
import ListPfaTable from "@/components/pfa/ListPfaTable.vue";

export default {
  name: "PfcListTransaction",

  components: {
    // SearchInput,
    CustomSelect,
    CustomSelectMonth,
    ListPfaTable,
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
      searchTerm: null,
      yearOption: null,
      monthOption: null,
      form: {
        company: null,
        dateStart: null,
        dateEnd: null,
      },
      items: [],
      companies: [],
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
          key: "transmitted",
          label: "Remit Status",
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

  async created() {
    await this.getProcessedSchedule();
    await this.fetchCompanies();
  },

  computed: {
    dateNotReady() {
      return (
        (this.form.dateStart && !this.form.dateEnd) ||
        (!this.form.dateStart && this.form.dateEnd)
      );
    },

    rows() {
      return this.items.length;
    },

    indexer() {
      return (this.currentPage - 1) * this.perPage;
    },

    showingCount() {
      return this.items.length > this.perPage
        ? this.perPage
        : this.items.length;
    },
  },

  watch: {
    async yearOption() {
      await this.getProcessedSchedule();
    },
    async monthOption() {
      await this.getProcessedSchedule();
    },
    async perPage() {
      await this.getProcessedSchedule();
    },
  },

  methods: {
    async fetchCompanies() {
      try {
        const api = "stat/user-companies";

        const res = await secureAxios.get(api);

        if (!res) {
          return [];
        }

        const { data } = res;

        this.companies = [{ label: "All Companies", value: "all" }];
        this.companies.push(...data.data);
      } catch (err) {
        console.log(err);
        return [];
      }
    },

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

        const api = `payment/get-batch-contribution?page=${this.currentPage}&size=${this.perPage}`;
        const res = await secureAxios.post(api, {
          ...this.form,
          searchTerm: this.searchTerm,
          month: this.monthOption,
          year: this.yearOption,
        });

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
