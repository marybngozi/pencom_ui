<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left-tab col-12 col-lg-10 pt-5 px-5">
      <h4>Pension Contribution Transactions</h4>

      <!-- pagination and filter details -->
      <div class="my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="show-count w-70">
            Showing {{ items.length }} of {{ rows }} Uploaded schedules
          </div>

          <div class="d-flex justify-content-between gap-3">
            <CustomSelect
              :options="companies"
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="200px"
              height="2rem"
              lineHeight="1.875rem"
              v-model="form.companyOption"
            />

            <CustomSelectInput
              :options="years"
              default="All years"
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="100px"
              height="2rem"
              lineHeight="1.875rem"
              v-model="form.yearOption"
            />

            <CustomSelect
              :options="$monthOptions"
              default="All months"
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="126px"
              height="2rem"
              lineHeight="1.875rem"
              v-model="form.monthOption"
            />
            <!-- <HorizontalSelect
              :items="$monthOptions"
              width="126px"
              height="2rem"
              borderColor="#DDDDDD"
              color="#252A2F"
              v-model="form.monthOption"
            /> -->
          </div>
        </div>

        <!-- table section -->
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
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(createdAt)="data">
              {{ data.value | moment("DD-MM-YYYY") }}
            </template>

            <template #cell(period)="data">
              {{ $months[data.item.month] }}, {{ data.item.year }}
            </template>

            <template #cell(company)="data">
              {{ data.value[0].companyName }}
            </template>

            <template #cell(amount)="data">
              {{ data.value | toCurrency }}
            </template>
          </b-table>

          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            size="sm"
            limit="10"
            pills
            align="center"
          >
          </b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { secureAxios } from "../../services/AxiosInstance";
import CustomSelectInput from "@/components/dashboard/CustomSelectInput";
import CustomSelect from "@/components/dashboard/CustomSelect";
// import HorizontalSelect from "@/components/dashboard/HorizontalSelect";

export default {
  name: "StaffListTransaction",
  components: {
    CustomSelectInput,
    CustomSelect,
    // HorizontalSelect,
  },
  data() {
    return {
      getting: true,
      fetching: false,
      perPage: 10,
      currentPage: 1,
      form: {
        yearOption: null,
        monthOption: null,
        companyOption: null,
      },
      companies: [],
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
          key: "company",
          label: "Company",
        },
        {
          key: "createdAt",
          label: "Upload Date",
        },
        {
          key: "amount",
          label: "Total Amount",
        },
      ],
    };
  },
  async created() {
    await this.fetchCompanies();
    await this.getContributions();
  },

  watch: {
    async "form.yearOption"() {
      await this.getContributions();
    },
    async "form.monthOption"() {
      await this.getContributions();
    },
    async "form.companyOption"() {
      await this.getContributions();
    },
  },

  computed: {
    years() {
      const yearArr = [];
      for (let i = new Date().getFullYear(); i >= 2020; i--) {
        yearArr.push(i);
      }
      return yearArr;
    },
    rows() {
      return this.items.length;
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

    async getContributions() {
      try {
        this.getting = true;

        const api = "schedule/get-contribution";
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
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
