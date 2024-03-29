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

              <template #cell(createdAt)="data">
                {{ data.value | moment("DD-MM-YYYY") }}
              </template>

              <template #cell(amount)="data">
                {{ data.value | toCurrency }}
              </template>

              <template #cell(action)="data">
                <button class="button btn-xsm" @click="transmit(data.item._id)">
                  Remit Schedule
                </button>
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
  </div>
</template>
<script>
import { secureAxios } from "../../services/AxiosInstance";
import CustomSelect from "@/components/form/CustomSelect";

export default {
  name: "PfcListTransaction",

  components: {
    CustomSelect,
  },

  data() {
    return {
      getting: false,
      fetching: false,
      perPage: 10,
      currentPage: 1,
      items: [],
      form: {
        company: null,
        dateStart: null,
        dateEnd: null,
      },
      companies: [],
      fields: [
        {
          key: "index",
          label: "S/N",
        },
        {
          key: "pfaName",
          label: "PFA",
        },
        {
          key: "itemCount",
          label: "Company count",
        },
        {
          key: "amount",
          label: "Total Contributed Amount",
        },
        {
          key: "action",
          label: "Action",
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

    indexer() {
      return (this.currentPage - 1) * this.perPage;
    },

    showingCount() {
      return this.items.length > this.perPage
        ? this.perPage
        : this.items.length;
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

        const api = "payment/get-unremit-contribution";
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

    async transmit(pfaCode) {
      try {
        const result = await this.$swal({
          icon: "info",
          text: "This batch of contribution will be sent to the PFA",
          showDenyButton: true,
          confirmButtonText: "Proceed",
          denyButtonText: "No",
        });

        if (!result.isConfirmed) {
          return;
        }

        const loader = this.$loading.show({
          // Optional parameters
          loader: "bars",
          color: "#0b2238",
          backgroundColor: "#343232",
          height: 100,
          width: 100,
        });

        const api = "payment/transmit-contributions";

        const res = await secureAxios.post(api, {
          pfaCode,
        });

        loader.hide();
        if (!res) {
          return;
        }

        const { data } = res;
        this.$swal({
          icon: "success",
          text: data.message,
        });

        await this.getProcessedSchedule();
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
