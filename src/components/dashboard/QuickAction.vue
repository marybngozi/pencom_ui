<template>
  <router-link
    :to="path"
    :style="filled ? `background: ${background}` : `border: 1px solid #C7C7C7`"
    class="d-flex justify-content-between align-items-center aktion"
  >
    <img :src="require(`@/assets/images/${iconName}.svg`)" :alt="iconName" />

    <div :style="`color:${color}`" class="px-2">
      <h6>{{ mainText }}</h6>
      <small>{{ subText }}</small>
    </div>

    <div>
      <i
        :style="`color:${color}`"
        class="fa fa-caret-right"
        aria-hidden="true"
      ></i>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "QuickAction",

  props: {
    path: {
      type: String,
      default: "/app",
      required: true,
    },
    iconName: {
      type: String,
      required: true,
    },
    filled: {
      type: Boolean,
      required: true,
      default: true,
    },
    background: {
      type: String,
      required: false,
      default: "#0090FF",
    },
    color: {
      type: String,
      required: true,
      default: "#0090FF",
    },
    mainText: {
      type: String,
      required: true,
    },
    subText: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
.aktion {
  width: 100%;
  /* min-width: 281px; */
  min-height: 56px;
  border-radius: 30px;
  padding: 12px 18px;
}
h6 {
  margin-bottom: 0;
  font-weight: 700;
  font-size: 14px;
  line-height: 15px;
}
small {
  font-weight: 400;
  font-size: 10px;
  line-height: 13px;
}
img {
  width: 24px;
  height: 24px;
}
</style>
