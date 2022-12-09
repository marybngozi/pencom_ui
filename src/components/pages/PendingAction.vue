<template>
  <section>
    <div class="d-flex justify-content-between pt-3">
      <h6 class="fw-7 head">Account authentication</h6>
      <small>0 of 1 complete</small>
    </div>

    <div class="cover">
      <div class="action">
        <div>
          <i class="fa fa-thumbs-up icon"></i>
        </div>
        <div>
          <h6 class="fw-7">Employer code verification</h6>
          <p>
            You need to input and validate your <b>Company Code</b> to gain
            acess to all necessary functionalities
          </p>
          <button @click="perform('companyValidate')">
            Click to get started
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PendingAction",

  methods: {
    perform(action) {
      this.$emit("show", action);
    },
  },
};
</script>

<style scoped>
section {
  z-index: 1100;
  background: #ffffff;
  position: absolute;
  width: 404px;
  top: 0;
  bottom: 0;
  right: 1px;
  border-bottom: 1px solid #f2f2f2;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.cover {
  overflow-y: scroll;
  height: calc(100vh - 140px);
}
.cover::-webkit-scrollbar {
  display: none;
}
.cover {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

h6.head {
  color: #808080;
}
.action {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  gap: 8px;
  isolation: isolate;
  margin: 12px auto;
  background: #ffffff;
  border: 1px solid #d2d2d2;
  border-radius: 16px;
}
.action h6 {
  color: #263238;
}
.action .icon {
  color: #808080;
  font-size: 19px;
}
.action p {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #808080;
}
button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  width: 100%;
  height: 44px;
  background: #0090ff;
  border-radius: 40px;
  border: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
}
</style>
