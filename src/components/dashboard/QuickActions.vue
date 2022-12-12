<template>
  <div class="boxx">
    <h6>Quick Actions</h6>

    <QuickAction
      iconName="transactions"
      main-text="Upload new pension schedule"
      subText="Upload new schedule"
      :filled="true"
      color="#ffffff"
      path="/upload-schedule"
    />

    <QuickAction
      iconName="process"
      main-text="Process pending pension schedule"
      subText="You have no pending schedule"
      :filled="false"
      color="#263238"
      path="/upload-status"
      class="mt-3"
    />
  </div>
</template>

<script>
import QuickAction from "./QuickAction.vue";
export default {
  name: "QuickActions",

  components: {
    QuickAction,
  },
};
</script>

<style scoped>
.boxx {
  padding: 48px 28px 28px;
}
h6 {
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  color: #808080;
  margin-bottom: 28px;
}
</style>
