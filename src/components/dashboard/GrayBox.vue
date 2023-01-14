<template>
  <div class="boxx">
    <!-- top section -->
    <div class="d-flex justify-content-between">
      <div>
        <h5>{{ boldTitle }}</h5>
        <h6>
          Pension contribution
          <small v-company class="paid ml-3">paid</small>
        </h6>
      </div>

      <div>
        <CustomSelect
          v-companystaff
          :options="$yearOptions"
          class="select"
          borderColor="#252a2f"
          color="#252A2F"
          width="100px"
          height="2rem"
          lineHeight="1.875rem"
          v-model="yearOption"
        />

        <CustomSelectMonth
          v-pfca
          :default="prevMonth"
          class="select"
          borderColor="#252a2f"
          width="126px"
          height="2rem"
          lineHeight="2rem"
          v-model="monthOption"
        />
      </div>
    </div>

    <!-- mid data -->
    <div :class="secMargin">
      <div class="d-flex justify-content-between">
        <p :class="pMargin" class="p-left">{{ pText1 }}</p>
        <p :class="pMargin" class="p-right">
          <loader class="text-secondary" v-if="fetching" />
          <span v-else>{{ data1 | toCurrency }}</span>
        </p>
      </div>

      <div class="d-flex justify-content-between">
        <p class="p-left">{{ pText2 }}</p>
        <p class="p-right">
          <loader class="text-secondary" v-if="fetching" />
          <span v-else>{{ data2 | toCurrency }}</span>
        </p>
      </div>
    </div>

    <!-- Last section -->
    <div :class="secMargin">
      <CustomSelectMonth
        v-companystaff
        :default="prevMonth"
        class="select"
        borderColor="#252a2f"
        width="100%"
        height="2.75rem"
        v-model="monthOption"
      />

      <div v-pfca>
        <CustomSelect
          :options="$yearOptions"
          class="select mb-2"
          borderColor="#DDDDDD"
          color="#252A2F"
          width="100%"
          height="2rem"
          lineHeight="2rem"
          v-model="yearOption"
        />

        <CustomSelect
          :options="options"
          class="select"
          borderColor="#DDDDDD"
          color="#252A2F"
          width="100%"
          height="2rem"
          lineHeight="2rem"
          v-model="viewOption"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
import CustomSelectMonth from "../form/CustomSelectMonth.vue";
import CustomSelect from "../form/CustomSelect.vue";
export default {
  name: "GrayBox",

  components: {
    CustomSelect,
    CustomSelectMonth,
  },

  props: {
    boldTitle: {
      type: String,
      default: "Employer",
    },
    options: {
      type: Array,
      required: false,
      default: () => [],
    },
    contributionType: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      fetching: false,
      monthOption: this.prevMonth,
      yearOption: new Date().getFullYear(),
      viewOption: null,
      data1: 0,
      data2: 0,
    };
  },

  async created() {
    await this.fetchData();
  },

  computed: {
    prevMonth() {
      const month = new Date().getMonth();
      return month == 0 ? 12 : month;
    },

    pText1() {
      return this.$store.getters.userType == 500 &&
        this.contributionType == "group"
        ? "Employer"
        : "For the month";
    },

    pText2() {
      return this.$store.getters.userType == 500 &&
        this.contributionType == "group"
        ? "Employee"
        : "YTD";
    },

    secMargin() {
      return this.$store.getters.userType > 300 ? "mt-1" : "mt-3";
    },

    pMargin() {
      return this.$store.getters.userType > 300 ? "mb-8" : "mb-13";
    },
  },

  watch: {
    async yearOption() {
      await this.fetchData();
    },
    async monthOption() {
      await this.fetchData();
    },
    async viewOption() {
      await this.fetchData();
    },
  },

  methods: {
    async fetchData() {
      if (this.fetching) return;

      try {
        this.fetching = true;

        const api = "stat/gray-box";
        const res = await secureAxios.post(api, {
          year: this.yearOption,
          month: this.monthOption,
          contributionType: this.contributionType,
          viewOption: this.viewOption,
        });

        this.fetching = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.data1 = data.totals.data1;
        this.data2 = data.totals.data2;
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
  /* width: 100%; */
  /* min-width: 300px; */
  height: 250px;
  background: #f9f9f9 !important;
  border-radius: 1.25rem;
  padding: 1.25rem;
}
h5 {
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.625rem;
  margin-bottom: 0px;
  color: #252a2f;
}
h6 {
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.3125rem;
  margin-bottom: 1rem;
  color: #acacac;
}
.p-left {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: #17517e;
}
.p-right {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  text-align: right;
  color: #252a2f;
}
.paid {
  background: #252a2f;
  padding: 1px 7px;
  border-radius: 17px;
  font-size: 0.715em;
  color: #ffffff;
}
.mb-8 {
  margin-bottom: 8px;
}
.mb-13 {
  margin-bottom: 13px;
}
</style>
