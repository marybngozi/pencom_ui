<template>
  <div
    :style="`width:${width}; height:${height}; border: 1px solid ${borderColor}; color:${
      color ? color : borderColor
    };`"
    class="pill"
  >
    <button @click="setIndex(prevIndex)">
      <i
        :style="`color:${color ? color : borderColor};`"
        class="fa fa-caret-left"
        aria-hidden="true"
      ></i>
    </button>

    <div :style="`color:${color ? color : borderColor};`" class="text">
      {{ item }}
    </div>

    <button @click="setIndex(nextIndex)">
      <i
        :style="`color:${color ? color : borderColor};`"
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
      index: this.default
        ? this.default < 0
          ? this.items.length - 1
          : this.default
        : this.items.length > 0
        ? 0
        : null,
    };
  },

  computed: {
    item() {
      return this.items[this.index].label
        ? this.items[this.index].label
        : this.items[this.index];
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
      default: "2rem",
    },
    borderColor: {
      type: String,
      default: "#252A2F",
    },
    color: {
      type: String,
      default: null,
    },
  },

  methods: {
    setIndex(idx) {
      this.index = idx;
      const item = this.items[this.index].value
        ? this.items[this.index].value
        : this.items[this.index];
      this.$emit("input", item);
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
  border-radius: 1.875rem;
}
button {
  border: none;
  background: transparent;
}
.text {
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
}
</style>
