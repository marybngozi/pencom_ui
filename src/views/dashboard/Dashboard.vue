<template>
  <div>
    <Company v-if="userType == 100" />
    <Employee v-if="userType == 200 || userType == 300" />
    <Pfc v-if="userType == 400" />
    <Pfa v-if="userType == 500" />
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import Company from "@/components/pages/CompanyDashboard.vue";
import Employee from "@/components/pages/EmployeeDashboard.vue";
import Pfc from "@/components/pages/PfcDashboard.vue";
import Pfa from "@/components/pages/PfaDashboard.vue";
export default {
  name: "Dashboard",

  components: {
    Company,
    Employee,
    Pfc,
    Pfa,
  },

  computed: {
    ...mapGetters(["userType"]),
  },

  data() {
    return {
      show: true,
    };
  },

  methods: {
    ...mapMutations(["toggleMainOverlay"]),
  },
};
</script>
<style scoped></style>
