<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <h4 class="mb-4">Validate Company Code</h4>

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
              class="form-control input"
              type="text"
              placeholder="company code"
            />
          </div>

          <button
            :disabled="!checkReady || checking"
            @click="checkCompanyCode"
            class="btn mt-4 w-100 button"
          >
            <span>Check code</span>
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
              class="form-control input"
              type="text"
              placeholder="enter token"
            />
          </div>

          <div class="d-flex justify-content-end">
            <button class="btn fs-9 btn-link" @click="resendToken">
              Resend Token
            </button>
          </div>

          <button
            :disabled="!tokenReady || verifying"
            @click="checkToken"
            class="btn mt-4 w-100 button"
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
  name: "ValidateCompany",
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
        this.$router.push("/app");
      } catch (err) {
        console.log(err);
        this.verifying = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
