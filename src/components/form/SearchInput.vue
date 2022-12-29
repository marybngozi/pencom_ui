<template>
  <form
    :style="`width: ${width}; height: ${height}`"
    @submit.prevent="sendSearch"
  >
    <input type="text" placeholder="search" v-model="searchVal" />
    <button type="submit">
      <img src="@/assets/images/search.svg" alt="search icon" />
    </button>
  </form>
</template>

<script>
export default {
  name: "SearchInput",

  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    width: {
      type: String,
      default: "287px",
    },
    height: {
      type: String,
      default: "32px",
    },
  },

  data() {
    return {
      searchVal: null,
    };
  },

  methods: {
    sendSearch() {
      this.$emit("input", this.searchVal);
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dddddd;
  border-radius: 16px;
  padding: 1px;
}
input {
  width: calc(100% - 40px);
  border: none;
  outline: none;
  height: 100%;
  padding: 0 0 0 10px;
  border-radius: 16px 0 0 16px;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
}
button {
  width: 16%;
  max-width: 40px;
  border: none;
  outline: none;
  background: transparent;
  border-radius: 0 16px 16px 0;
}
input::placeholder {
  text-align: right;
  font-weight: 400;
  font-size: 12px;
  line-height: 13px;
  color: #939ea9;
}
img {
  width: 24px;
  height: 24px;
}
</style>
