<template>
  <div class="boxx">
    <div>
      <img src="@/assets/images/people_group.svg" alt="peoples icon" />
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
      <HorizontalSelect
        v-company
        :items="$monthOptions"
        width="100%"
        height="44px"
        :default="new Date().getMonth() - 1"
        borderColor="#252a2f"
        v-model="monthOption"
      />

      <button v-spfca class="see-all" @click="seeAll">See all</button>
    </div>
  </div>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
import HorizontalSelect from "./HorizontalSelect.vue";
export default {
  name: "PinkBox",

  components: {
    HorizontalSelect,
  },

  inject: {
    showModal: { default: () => console.log("Modal not needed") },
  },

  data() {
    return {
      fetching: false,
      count: 0,
      monthOption: new Date().getMonth(),
    };
  },

  async created() {
    await this.fetchCount();
  },

  watch: {
    async monthOption() {
      await this.fetchCount();
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
  border-radius: 20px;
  padding: 20px;
  color: #252a2f;
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
  background: #252a2f;
  padding: 1px 7px;
  border-radius: 17px;
  font-size: 0.715em;
  color: #ffffff;
}
.see-all {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #252a2f;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: transparent;
  /* padding: 10px 20px; */
  width: 100%;
  height: 44px;
  border: 1px solid #252a2f;
  border-radius: 30px;
}
</style>
