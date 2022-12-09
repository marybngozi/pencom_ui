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
  padding: 28px 0;
  border-bottom: 1px solid #f2f2f2;
}
h6 {
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  color: #808080;
  margin-bottom: 24px;
}
.red-box {
  padding: 16px;
  background: #ff0000;
  border-radius: 20px;
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
  width: 48px;
  height: 48px;
  background: #700404;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 11px 21px;
  color: #ffffff;
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
}
.text {
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: #ffffff;
  padding-left: 8px;
}
</style>
