<template>
  <div class="boxx">
    <div>
      <img src="@/assets/images/people_group.svg" alt="peoples icon" />
    </div>

    <div class="mt-3">
      <h5>Staff Count</h5>
      <h6>for the month</h6>
    </div>

    <div>
      <h3>22</h3>
    </div>

    <div>
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
  name: "PinkBox",

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
  min-width: 305px;
  width: 45%;
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
</style>
