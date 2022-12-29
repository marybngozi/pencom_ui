<template>
  <div
    :style="`width:${width}; height:${height}; line-height: ${lineHeight};`"
    class="customed-select"
    :tabindex="tabindex"
    @blur="open = false"
  >
    <div
      :style="`border: 1px solid ${borderColor}; color:${color}; --borderColor: ${color};`"
      class="selected"
      :class="{ open: open }"
      @click="open = !open"
    >
      <span v-if="selected">{{ selectedLabel }}</span>
      <span v-else>{{ placeHolder }}</span>
    </div>

    <div ref="items" class="items" :class="{ selectHide: !open }">
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
  name: "CustomSelectInput",

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
    placeHolder: {
      type: String,
      required: false,
      default: "- select -",
    },
    default: {
      type: [String, Number],
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
      default: "#808080",
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selectedLabel: this.default ? this.default : null,
      selected: this.default ? this.default : null,
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
  padding-left: 1.5em;
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
  color: #fff;
  background: #ffffff;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.1);
  /* border-radius: 16px; */
  border-radius: 0px 0px 6px 6px;
  overflow: hidden;
  /* border-right: 1px solid #03435f;
  border-left: 1px solid #03435f;
  border-bottom: 1px solid #03435f; */
  position: absolute;
  background-color: #ffffff;
  height: 350px;
  overflow-y: scroll;
  left: 0;
  right: 0;
  z-index: 1;
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
  /* padding-left: 1.4em; */
  padding: 10px 20px;
  cursor: pointer;
  user-select: none;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
}

.customed-select .items div:hover {
  background-color: #44758a67;
}

.selectHide {
  display: none;
}
</style>
