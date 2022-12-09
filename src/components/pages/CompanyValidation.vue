<template>
  <section>
    <div class="d-flex justify-content-between pt-3">
      <h6 class="fw-7 head">Account authentication</h6>
    </div>

    <div class="cover">
      <div v-if="!companyCode">
        <div v-if="stage == 1" class="form">
          <div class="mt-3">
            <label for="companyCode">
              <span class="text-danger">*</span>
              Company Code
            </label>
            <input
              id="companyCode"
              v-model="form1.companyCode"
              class="form-control input rounded-pill"
              type="text"
              placeholder="Enter company code"
            />
          </div>

          <button
            :disabled="!checkReady || checking"
            @click="checkCompanyCode"
            class="mt-4 w-100"
          >
            <span>Check validity</span>
            <span
              v-if="checking"
              class="spinner-border spinner-border-sm text-light ml-3"
              role="status"
            ></span>
          </button>
        </div>

        <div v-if="stage == 2" class="form">
          <div class="mt-3">
            <label for="token">
              <span class="text-danger">*</span>
              Enter Token
            </label>
            <input
              id="token"
              v-model="form2.token"
              class="form-control input rounded-pill"
              type="text"
              placeholder="enter token"
            />
          </div>

          <div class="d-flex justify-content-end">
            <a class="btn fs-9 btn-link" @click="resendToken"> Resend Token </a>
          </div>

          <button
            :disabled="!tokenReady || verifying"
            @click="checkToken"
            class="mt-4 w-100"
          >
            <span>Verify Token</span>
            <span
              v-if="verifying"
              class="spinner-border spinner-border-sm text-light ml-3"
              role="status"
            ></span>
          </button>
        </div>
      </div>

      <div v-else class="form">
        <div class="alert alert-success d-flex justify-content-between">
          <span>Company Validated</span>
          <i class="fa fa-check"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
export default {
  name: "PendingAction",

  data() {
    return {
      checking: false,
      verifying: false,
      stage: 1,
      form1: {
        companyCode: null,
      },
      form2: {
        token: null,
      },
    };
  },
  computed: {
    ...mapGetters(["companyCode"]),

    checkReady() {
      return !!this.form1.companyCode;
    },
    tokenReady() {
      return !!this.form2.token;
    },
  },

  methods: {
    ...mapMutations(["setCompanyCode"]),

    async checkCompanyCode() {
      if (!this.checkReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.checking = true;

        const api = "auth/company-validate";
        const res = await secureAxios.post(api, this.form1);

        this.checking = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.stage = 2;
        this.$swal({
          icon: "success",
          text: data.message,
        });
      } catch (err) {
        console.log(err);
        this.checking = false;
      }
    },

    async resendToken() {
      if (!this.checkReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.checking = true;

        const api = "auth/resend-verify";
        const res = await secureAxios.post(api, this.form1);

        this.checking = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.stage = 2;
        this.$swal({
          icon: "success",
          text: data.message,
        });
      } catch (err) {
        console.log(err);
        this.checking = false;
      }
    },

    async checkToken() {
      if (!this.tokenReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.verifying = true;

        const api = "auth/company-verify";

        const res = await secureAxios.post(api, {
          token: this.form2.token,
          companyCode: this.form1.companyCode,
        });

        this.verifying = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.$swal({
          icon: "success",
          text: data.message,
        });

        // go to dashboard
        this.setCompanyCode();
        this.$emit("hideAll", "done");
      } catch (err) {
        console.log(err);
        this.verifying = false;
      }
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
  height: 100%;
  right: 1px;
  bottom: 0px;
  border-bottom: 1px solid #f2f2f2;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
h6.head {
  color: #808080;
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
.action {
  display: flex;
  /* flex-direction: row;
  align-items: flex-start; */
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
