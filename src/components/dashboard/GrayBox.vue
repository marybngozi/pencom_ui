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

      <div v-spfca>
        <HorizontalSelect
          :items="Object.values($months)"
          :default="new Date().getMonth() - 1"
          width="126px"
          height="32px"
          borderColor="#252a2f"
          v-model="monthOption"
        />
      </div>
    </div>

    <!-- mid data -->
    <div class="mt-3">
      <div class="d-flex justify-content-between">
        <p class="p-left">Previous month</p>
        <p class="p-right">N 220,000.0</p>
      </div>

      <div class="d-flex justify-content-between">
        <p class="p-left">YTD</p>
        <p class="p-right">N 3,320,000.0</p>
      </div>
    </div>

    <!-- Last section -->
    <div class="mt-3">
      <HorizontalSelect
        v-company
        :items="Object.values($months)"
        :default="new Date().getMonth() - 1"
        width="100%"
        height="44px"
        borderColor="#252a2f"
        v-model="monthOption"
      />

      <CustomSelect
        v-spfca
        :options="options"
        class="select"
        borderColor="#DDDDDD"
        color="#252A2F"
        width="100%"
        height="44px"
        lineHeight="40px"
        v-model="pfaOption"
      />
    </div>
  </div>
</template>

<script>
import HorizontalSelect from "./HorizontalSelect.vue";
import CustomSelect from "./CustomSelect.vue";
export default {
  name: "GrayBox",

  components: {
    HorizontalSelect,
    CustomSelect,
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
  },

  data() {
    return {
      monthOption: 1,
      companyOption: null,
      pfaOption: null,
    };
  },
};
</script>

<style scoped>
.boxx {
  /* width: 100%; */
  /* min-width: 300px; */
  height: 250px;
  background: #f9f9f9 !important;
  border-radius: 20px;
  padding: 20px;
}
h5 {
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  margin-bottom: 0px;
  color: #252a2f;
}
h6 {
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  margin-bottom: 16px;
  color: #acacac;
}
.p-left {
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  color: #808080;
}
.p-right {
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
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
</style>
