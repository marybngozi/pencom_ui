<template>
  <div>
    <Company v-if="userType == 100" />
    <Employee v-if="userType == 200" />
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import Company from "@/components/pages/CompanyDashboard.vue";
import Employee from "@/components/pages/EmployeeDashboard.vue";
export default {
  name: "Dashboard",

  components: {
    Company,
    Employee,
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
