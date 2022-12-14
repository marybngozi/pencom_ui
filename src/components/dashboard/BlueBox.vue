<template>
  <div class="boxx">
    <!-- Top section -->
    <div class="d-flex justify-content-between">
      <img src="@/assets/images/wallet.svg" alt="wallet icon" />

      <HorizontalSelect
        :items="years"
        :default="0"
        width="126px"
        height="32px"
        borderColor="#ffffff"
        @input="(d) => (yearOption = d)"
      />
    </div>

    <!-- Name section -->
    <div class="mt-3">
      <h5>Total Contributions</h5>
      <h6>Balance</h6>
    </div>

    <!-- Money Section -->
    <div>
      <h3>N 12,720,004.05</h3>
    </div>

    <!-- Options section -->
    <CustomSelect :options="options" class="select" v-model="viewOption" />
  </div>
</template>

<script>
import HorizontalSelect from "./HorizontalSelect.vue";
import CustomSelect from "./CustomSelect.vue";
export default {
  name: "BlueBox",

  data() {
    return {
      viewOption: null,
      yearOption: null,
      options: [
        { label: "All Contributions", value: "all" },
        { label: "Employer contributions", value: "employer" },
        { label: "Employee contributions", value: "employee" },
      ],
    };
  },

  components: {
    HorizontalSelect,
    CustomSelect,
  },

  computed: {
    years() {
      const years = [];
      for (let i = new Date().getFullYear(); i >= 2020; i--) {
        years.push(i);
      }
      return years;
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
</style>
