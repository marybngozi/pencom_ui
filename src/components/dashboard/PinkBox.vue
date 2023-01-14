<template>
  <div class="boxx">
    <div class="d-flex justify-content-between">
      <img src="@/assets/images/people_group.svg" alt="peoples icon" />

      <CustomSelect
        v-company
        :options="$yearOptions"
        class="select"
        borderColor="#252a2f"
        color="#252A2F"
        width="100px"
        height="2rem"
        lineHeight="1.875rem"
        v-model="yearOption"
      />
    </div>

    <div v-company class="mt-3">
      <h5>Staff Count</h5>
      <h6>for the month</h6>
    </div>

    <div v-staff class="mt-3">
      <h5>Contributing</h5>
      <h6>Employers</h6>
    </div>

    <div v-pfca class="mt-3">
      <h5>Contributing</h5>
      <h6>Companies</h6>
    </div>

    <div>
      <h3>
        <loader class="text-dark" v-if="fetching" />
        <span v-else>{{ count }}</span>
      </h3>
    </div>

    <div>
      <CustomSelectMonth
        v-company
        :default="prevMonth"
        class="select"
        borderColor="#252a2f"
        width="100%"
        height="2.75rem"
        v-model="monthOption"
      />

      <button v-spfca class="see-all" @click="seeAll">See all</button>
    </div>
  </div>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
import CustomSelectMonth from "../form/CustomSelectMonth.vue";
import CustomSelect from "../form/CustomSelect.vue";
export default {
  name: "PinkBox",

  components: {
    CustomSelect,
    CustomSelectMonth,
  },

  inject: {
    showModal: { default: () => console.log("Modal not needed") },
  },

  data() {
    let prevMonth = new Date().getMonth();
    prevMonth = prevMonth == 0 ? 12 : prevMonth;
    return {
      fetching: false,
      count: 0,
      monthOption: prevMonth,
      yearOption: new Date().getFullYear(),
    };
  },

  async created() {
    await this.fetchCount();
  },

  watch: {
    async yearOption() {
      await this.fetchCount();
    },
    async monthOption() {
      await this.fetchCount();
    },
  },

  computed: {
    prevMonth() {
      const month = new Date().getMonth();
      return month == 0 ? 12 : month;
    },
  },

  methods: {
    seeAll() {
      this.showModal();
    },

    async fetchCount() {
      if (this.fetching) return;

      try {
        this.fetching = true;

        const api = "stat/pink-box";
        const res = await secureAxios.post(api, {
          month: this.monthOption,
          year: this.yearOption,
        });

        this.fetching = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.count = data.count;
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
  /* min-width: 245px; */
  /* width: 42%; */
  height: 250px;
  background: #ffecec;
  border-radius: 1.25rem;
  padding: 1.25rem;
  color: #252a2f;
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
  background: #252a2f;
  padding: 1px 7px;
  border-radius: 17px;
  font-size: 0.715em;
  color: #ffffff;
}
.see-all {
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
  color: #252a2f;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: transparent;
  /* padding: 10px 1.25rem; */
  width: 100%;
  height: 2.75rem;
  border: 1px solid #252a2f;
  border-radius: 1.875rem;
}
</style>
