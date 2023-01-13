<template>
  <div class="boxx">
    <h6>Use Guide</h6>

    <!-- red box -->
    <div class="red-box">
      <ul>
        <li v-for="(instr, i) in instructions" :key="i">
          <div class="dark-red-box">{{ i }}</div>

          <div class="text">{{ instr }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserGuide",

  props: {
    instructions: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.boxx {
  padding: 1.75rem;
}
h6 {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: #808080;
  margin-bottom: 1.5rem;
}
.red-box {
  padding: 16px;
  background: #ff0000;
  border-radius: 1.25rem;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  display: flex;
  justify-content: space-between;
}
li:not(:last-child) {
  margin-bottom: 16px;
}
.dark-red-box {
  width: 3rem;
  height: 3rem;
  background: #700404;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.6875rem 1.3125rem;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.625rem;
}
.text {
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.1875rem;
  color: #ffffff;
  padding-left: 8px;
}
</style>
