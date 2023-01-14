<template>
  <div class="boxx">
    <!-- Top section -->
    <div class="d-flex justify-content-between">
      <img src="@/assets/images/wallet.svg" alt="wallet icon" />

      <CustomSelect
        v-companystaff
        :options="years"
        class="select"
        borderColor="#ffffff"
        width="6.875rem"
        height="2rem"
        lineHeight="1.875rem"
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
    <CustomSelect v-pfca :options="years" class="select" v-model="yearOption" />
  </div>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
import CustomSelect from "../form/CustomSelect.vue";
export default {
  name: "BlueBox",

  components: {
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
  padding: 1.25rem;
  /* min-width: 300px; */
  /* width: 56%; */
  height: 250px;
  background: #17517e;
  border-radius: 1.25rem;
  color: #ffffff;
}
img {
  width: 1.75rem;
  height: 1.75rem;
}
h5 {
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.625rem;
  margin-bottom: 0px;
}
h6 {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.3125rem;
  margin-bottom: 16px;
}
h3 {
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 2.3125rem;
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
