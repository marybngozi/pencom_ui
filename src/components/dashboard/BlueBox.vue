<template>
  <div class="boxx">
    <!-- Top section -->
    <div class="d-flex justify-content-between">
      <img src="@/assets/images/wallet.svg" alt="wallet icon" />

      <!-- :default="0" -->
      <HorizontalSelect
        :items="years"
        width="126px"
        height="32px"
        borderColor="#ffffff"
        v-model="yearOption"
      />
    </div>

    <!-- Name section -->
    <div class="mt-3">
      <h5>Total Contributions</h5>
      <h6>
        Balance
        <small class="ml-4 paid">paid</small>
      </h6>
    </div>

    <!-- Money Section -->
    <div>
      <h3>
        <loader class="text-light" v-if="fetching" />
        <span v-else>{{ totalAmount | toCurrency }}</span>
      </h3>
    </div>

    <!-- Options section -->
    <CustomSelect
      v-companystaff
      :options="options"
      class="select"
      v-model="viewOption"
    />
  </div>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
import HorizontalSelect from "./HorizontalSelect.vue";
import CustomSelect from "./CustomSelect.vue";
export default {
  name: "BlueBox",

  components: {
    HorizontalSelect,
    CustomSelect,
  },

  props: {
    options: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      fetching: false,
      viewOption: "amount",
      yearOption: new Date().getFullYear(),
      totals: {
        employerNormalContribution: 0,
        employeeNormalContribution: 0,
        amount: 0,
      },
      optionsD: [
        { label: "All Contributions", value: "amount" },
        {
          label: "Employer contributions",
          value: "employerNormalContribution",
        },
        {
          label: "Employee contributions",
          value: "employeeNormalContribution",
        },
      ],
    };
  },

  async created() {
    await this.fetchData();
  },

  watch: {
    async yearOption() {
      await this.fetchData();
    },
  },

  computed: {
    years() {
      const years = [];
      for (let i = new Date().getFullYear(); i >= 2020; i--) {
        years.push(i);
      }
      return years;
    },

    totalAmount() {
      if (
        typeof this.totals === "object" &&
        !Array.isArray(this.totals) &&
        this.totals !== null
      ) {
        return this.totals[this.viewOption];
      }

      return this.totals;
    },
  },

  methods: {
    async fetchData() {
      if (this.fetching) return;

      try {
        this.fetching = true;

        const api = "stat/blue-box";
        const res = await secureAxios.post(api, {
          year: this.yearOption,
        });

        this.fetching = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.totals = data.totals;
      } catch (err) {
        console.log(err);
        this.fetching = false;
      }
    },
  },
};
</script>

<style scoped>
.boxx {
  padding: 20px;
  /* min-width: 300px; */
  /* width: 56%; */
  height: 250px;
  background: #17517e;
  border-radius: 20px;
  color: #ffffff;
}
img {
  width: 28px;
  height: 28px;
}
h5 {
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  margin-bottom: 0px;
}
h6 {
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  margin-bottom: 16px;
}
h3 {
  font-weight: 700;
  font-size: 28px;
  line-height: 37px;
  margin-bottom: 14px;
}
.paid {
  background: #be9e1b;
  color: #ffffff;
  padding: 1px 7px;
  border-radius: 17px;
  font-size: 0.715em;
}
</style>
