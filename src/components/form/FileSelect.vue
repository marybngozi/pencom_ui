<template>
  <div class="file-select">
    <div class="select-label">
      <span v-if="value">{{ value.name }}</span>
      <span v-else>- Choose excel file to upload -</span>
    </div>

    <div class="select-button">Browse</div>
    <input
      aria-describedby="inputGroupFileAddon01"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      type="file"
      @change="handleFileChange"
    />
  </div>
</template>

<script>
export default {
  name: "FileSelect",

  props: {
    value: File,
  },

  methods: {
    handleFileChange(e) {
      this.$emit("input", e.target.files[0]);
    },
  },
};
</script>

<style scoped>
.file-select {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2px 1px 2px 1.25rem;
  width: 100%;
  /* min-width: 698px; */
  height: 3rem;
  border: 1px solid #d2d2d2;
  border-radius: 1.875rem;
  position: relative;
}

.file-select > .select-label {
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
  color: #808080;
}
.file-select > .select-button {
  padding: 0.9rem 0;
  /* background-color: #2ea169;
  border-radius: 0.3rem; */
  text-align: center;
  /* padding: 10px 2px 10px 1.25rem; */
  width: 15%;
  /* height: 3rem; */
  background: #a0d6ff;
  border-radius: 0px 1.875rem 1.875rem 0px;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #17517e;
}

.file-select > input[type="file"] {
  /* display: none; */
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
