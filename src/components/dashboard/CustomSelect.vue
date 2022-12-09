<template>
  <div
    :style="`width:${width}; height:${height}; line-height: ${lineHeight};`"
    class="customed-select"
    :tabindex="tabindex"
    @blur="open = false"
  >
    <div
      :style="`border: 1px solid ${borderColor}; color:${borderColor}; --borderColor: ${borderColor};`"
      class="selected"
      :class="{ open: open }"
      @click="open = !open"
    >
      {{ selected }}
    </div>

    <div class="items" :class="{ selectHide: !open }">
      <div
        v-for="(option, i) of options"
        :key="i"
        @click="
          selected = option;
          open = false;
          $emit('input', option);
        "
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomSelect",

  props: {
    options: {
      type: Array,
      required: true,
    },
    width: {
      type: String,
      default: "100%",
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
    height: {
      type: String,
      default: "44px",
    },
    lineHeight: {
      type: String,
      default: "40px",
    },
    borderColor: {
      type: String,
      default: "#ffffff",
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selected: this.default
        ? this.default
        : this.options.length > 0
        ? this.options[0]
        : null,
      open: false,
    };
  },
  mounted() {
    this.$emit("input", this.selected);
  },
};
</script>

<style scoped>
.customed-select {
  position: relative;
  /* width: 100%; */
  text-align: left;
  outline: none;
  /* height: 44px; */
  font-weight: 400;
  font-size: 12px;
  /* line-height: 40px; */
}

.customed-select .selected {
  background-color: transparent;
  border-radius: 30px;
  /* border: 1px solid #ffffff; */
  /* color: #fff; */
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
}

.customed-select .selected.open {
  border: 1px solid #ffffff;
  border-radius: 30px 30px 0px 0px;
}

.customed-select .selected:after {
  position: absolute;
  content: "";
  top: 22px;
  right: 1.8em;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-color: var(--borderColor) transparent transparent transparent;
}

.customed-select .items {
  color: #fff;
  border-radius: 0px 0px 6px 6px;
  overflow: hidden;
  border-right: 1px solid #03435f;
  border-left: 1px solid #03435f;
  border-bottom: 1px solid #03435f;
  position: absolute;
  background-color: #ffffff;
  left: 0;
  right: 0;
  z-index: 1;
}

.customed-select .items div {
  color: #252a2f;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
}

.customed-select .items div:hover {
  background-color: #44758a67;
}

.selectHide {
  display: none;
}
</style>
