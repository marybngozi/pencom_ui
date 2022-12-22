<template>
  <div
    :style="`width:${width}; height:${height}; border: 1px solid ${borderColor};`"
    class="pill"
  >
    <button @click="setIndex(prevIndex)">
      <i
        :style="`color:${borderColor}`"
        class="fa fa-caret-left"
        aria-hidden="true"
      ></i>
    </button>

    <div :style="`color:${borderColor}`" class="text">{{ item }}</div>

    <button @click="setIndex(nextIndex)">
      <i
        :style="`color:${borderColor}`"
        class="fa fa-caret-right"
        aria-hidden="true"
      ></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "HorizontalSelect",

  data() {
    return {
      index: this.default ? this.default : this.items.length > 0 ? 0 : null,
    };
  },

  computed: {
    item() {
      return this.items[this.index];
    },
    prevIndex() {
      return this.index - 1 < 0 ? this.items.length - 1 : this.index - 1;
    },
    nextIndex() {
      return this.items.length == this.index + 1 ? 0 : this.index + 1;
    },
  },

  props: {
    value: [String, Number],
    items: {
      type: Array,
      required: true,
    },
    default: {
      type: Number,
      required: false,
      default: null,
    },
    width: {
      type: String,
      default: "126px",
    },
    height: {
      type: String,
      default: "32px",
    },
    borderColor: {
      type: String,
      default: "#252A2F",
    },
  },

  methods: {
    setIndex(idx) {
      this.index = idx;
      this.$emit("input", this.items[this.index]);
    },
  },
};
</script>

<style scoped>
.pill {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  border-radius: 30px;
}
button {
  border: none;
  background: transparent;
}
.text {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
}
</style>
