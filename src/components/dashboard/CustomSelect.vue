<template>
  <div
    :style="`width:${width}; height:${height}; line-height: ${lineHeight};`"
    class="customed-select"
    :tabindex="tabindex"
    @blur="open = false"
  >
    <div
      :style="`border: 1px solid ${borderColor}; color:${
        color ? color : borderColor
      }; --borderColor: ${color ? color : borderColor};`"
      class="selected"
      :class="{ open: open }"
      @click="open = !open"
    >
      <span>{{ selectedLabel }}</span>
    </div>

    <div class="items" :class="{ selectHide: !open }">
      <div
        v-for="(option, i) of options"
        :key="i"
        @click="
          selected = option.value ? option.value : option;
          selectedLabel = option.label ? option.label : option;
          open = false;
          $emit('input', option.value ? option.value : option);
        "
      >
        {{ option.label ? option.label : option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomSelect",

  props: {
    value: [String, Number],
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
    color: {
      type: String,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selectedLabel: this.default
        ? this.default
        : this.options.length > 0
        ? this.options[0].label
          ? this.options[0].label
          : this.options[0]
        : null,
      selected: this.default
        ? this.default
        : this.options.length > 0
        ? this.options[0].value
          ? this.options[0].value
          : this.options[0]
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
  text-align: left;
  outline: none;
  font-weight: 400;
  font-size: 12px;
}

.customed-select .selected {
  background-color: transparent;
  border-radius: 30px;
  padding-left: 1em;
  padding-right: 0.5em;
  cursor: pointer;
  user-select: none;
}
.customed-select .selected span {
  display: inline-block;
  vertical-align: top;
  margin-bottom: 0;
  width: 78%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.customed-select .selected.open {
  border: 1px solid #ffffff;
  border-radius: 30px 30px 0px 0px;
}

.customed-select .selected:after {
  position: absolute;
  content: "";
  top: 47%;
  right: 1.8em;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-color: var(--borderColor) transparent transparent transparent;
}

.customed-select .items {
  width: 100%;
  min-width: max-content;
  color: #fff;
  border-radius: 0px 0px 6px 6px;
  overflow: hidden;
  border-right: 1px solid #03435f;
  border-left: 1px solid #03435f;
  border-bottom: 1px solid #03435f;
  position: absolute;
  background-color: #ffffff;
  /* left: 0; */
  right: 0;
  z-index: 1;
  max-height: 350px;
  overflow-y: scroll;
}
.customed-select .items::-webkit-scrollbar {
  display: none;
}
.customed-select .items {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.customed-select .items div {
  color: #252a2f;
  padding-left: 1em;
  padding-right: 0.5em;
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
