<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <h4 class="mb-4">Create Admin Staff</h4>

      <div class="form">
        <div class="mt-3">
          <label class="d-flex justify-content-between" for="rsaPin">
            <span>
              <span class="text-danger">*</span>
              Staff RSA PIN
            </span>
            <span class="fs-8 text-info">
              The staff must have registered on this platform
            </span>
          </label>

          <input
            id="rsaPin"
            v-model="form.rsaPin"
            class="form-control input"
            type="text"
            placeholder="enter staff RSA PIN"
          />
        </div>

        <button
          :disabled="!rsaReady || checking"
          @click="checkrsaPin"
          class="btn mt-4 w-100 button"
        >
          <span>Make an Admin Staff</span>
          <span
            v-if="checking"
            class="spinner-border spinner-border-sm text-light ml-3"
            role="status"
          ></span>
        </button>
      </div>
    </div>
  </section>
</template>
<script>
import { secureAxios } from "../../services/AxiosInstance";

export default {
  name: "CreateSubadmin",
  data() {
    return {
      checking: false,
      verifying: false,
      stage: 1,
      form: {
        rsaPin: null,
      },
      staff: null,
    };
  },
  computed: {
    rsaReady() {
      return !!this.form.rsaPin;
    },
  },

  methods: {
    async checkrsaPin() {
      if (!this.rsaReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.checking = true;

        const api = `auth/staffs/${this.form.rsaPin}`;
        const res = await secureAxios.get(api);

        this.checking = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.staff = data.data;

        // warn
        const result = await this.$swal({
          icon: "question",
          title: `Are you sure you want to make ${this.staff.firstName} ${this.staff.lastName} an Admin staff?`,
          text: "This staff will be able to perform authorized actions for this company",
          showDenyButton: true,
          confirmButtonText: "Yes",
          denyButtonText: "No",
        });

        if (!result.isConfirmed) {
          return;
        }

        await this.makeStaff();
      } catch (err) {
        console.log(err);
        this.checking = false;
      }
    },

    async makeStaff() {
      if (!this.staff) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.checking = true;

        const api = "auth/admin-staff";
        const res = await secureAxios.post(api, this.form);

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
          rsaPin: this.form.rsaPin,
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
