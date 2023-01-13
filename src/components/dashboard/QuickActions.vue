<template>
  <div class="boxx">
    <h6>Quick Actions</h6>

    <TransitionGroup name="slideaction" appear>
      <QuickAction
        v-for="(a, i) in actions"
        :key="i"
        :iconName="a.iconName"
        :main-text="a.mainText"
        :subText="a.subText"
        :filled="a.filled"
        :color="a.color"
        :path="a.path"
        class="mb-2"
        :style="{ '--i': i }"
      />

      />
    </TransitionGroup>
  </div>
</template>

<script>
import QuickAction from "./QuickAction.vue";
export default {
  name: "QuickActions",

  components: {
    QuickAction,
  },

  data() {
    return {
      actions: [
        {
          iconName: "transactions",
          mainText: "Upload new pension schedule",
          subText: "Upload new schedule",
          filled: true,
          color: "#ffffff",
          path: "/schedule/upload",
        },
        {
          iconName: "process",
          mainText: "Process pension schedule",
          subText: "Process uploaded schedule",
          filled: false,
          color: "#263238",
          path: "/schedule/upload-status",
        },
      ],
    };
  },
};
</script>

<style scoped>
@import "../../assets/css/transition.css";
.boxx {
  padding: 3rem 1.75rem 1.75rem;
}
h6 {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: #808080;
  margin-bottom: 1.75rem;
}
</style>
