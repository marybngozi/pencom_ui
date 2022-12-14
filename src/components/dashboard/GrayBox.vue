<template>
  <div class="boxx">
    <!-- top section -->
    <div class="mt-3">
      <h5>Employer</h5>
      <h6>Pension contribution</h6>
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
        :items="Object.values($months)"
        :default="new Date().getMonth() - 1"
        width="100%"
        height="44px"
        borderColor="#252a2f"
        @input="(d) => (monthOption = d)"
      />
    </div>
  </div>
</template>

<script>
import HorizontalSelect from "./HorizontalSelect.vue";
export default {
  name: "GrayBox",

  components: {
    HorizontalSelect,
  },

  data() {
    return {
      monthOption: 1,
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
</style>
