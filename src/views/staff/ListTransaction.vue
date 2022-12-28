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
              height="32px"
              lineHeight="30px"
              v-model="companyOption"
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

            <HorizontalSelect
              :items="Object.values($months)"
              :default="new Date().getMonth() - 1"
              width="126px"
              height="32px"
              borderColor="#DDDDDD"
              color="#252A2F"
              v-model="monthOption"
            />
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
            <template #cell(itemCode)="data">
              {{ data.item.item[0].itemName }}
            </template>

            <template #cell(createdAt)="data">
              {{ data.value | moment("DD-MM-YYYY") }}
            </template>

            <template #cell(period)="data">
              {{ $months[data.item.month] }}, {{ data.item.year }}
            </template>

            <template #cell(paid)="data">
              <span v-if="data.value == 0">Not Paid</span>
              <span v-if="data.value == 1">Paid</span>
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
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
import CustomSelectInput from "@/components/dashboard/CustomSelectInput";
import CustomSelect from "@/components/dashboard/CustomSelect";
import HorizontalSelect from "@/components/dashboard/HorizontalSelect";

export default {
  name: "ListTransaction",
  components: {
    CustomSelectInput,
    CustomSelect,
    HorizontalSelect,
  },
  data() {
    return {
      getting: false,
      fetching: false,
      perPage: 10,
      currentPage: 1,
      yearOption: null,
      monthOption: null,
      companyOption: null,
      companies: [
        { label: "All Companies", value: "all" },
        { label: "Appmart Limited", value: "EC0D43224" },
        { label: "Basmic Limited", value: "EC993D4322" },
        { label: "Swizel Tech", value: "EC0D431110" },
      ],
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
          key: "paid",
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
      ],
    };
  },
  async beforeCreate() {
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
  },

  methods: {
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
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
