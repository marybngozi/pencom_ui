<template>
  <div class="about">
    <section id="moreInfo" class="mt-4">
      <div v-if="loading" class="px-4 py-4 mt-5 text-center">
        <span
          class="spinner-border spinner-border-xl text-secondary ml-3"
        ></span>
        <p class="mb-3 mt-3">Verifying...</p>
      </div>

      <div v-if="!loading">
        <div
          v-if="resetError"
          class="px-4 py-4 mt-5 box d-flex justify-content-center"
        >
          <div class="col-md-3">
            <i class="fas fa-unlink text-secondary fa-3x mt-2"></i>
          </div>
          <div class="col-md-8">
            <h4 class="">Error Resetting Password</h4>
            <p class="mb-3 mt-3 text-danger fs-6 fw-bold">
              Link is broken or invalid!
            </p>
            <p class="mt-5">
              Click
              <router-link to="/auth/forgot-password"> Here</router-link>
              to reset password again
            </p>
          </div>
        </div>

        <div v-if="!resetSuccess && !resetError" class="px-4 py-4 mt-5 box">
          <h4 class="mb-5 mt-3">Reset your password</h4>

          <div class="mt-4">
            <label for="password">
              <span class="text-danger">*</span>
              New Password
            </label>
            <input
              autocomplete="off"
              id="password"
              v-model="form.password"
              class="form-control"
              type="password"
              placeholder="8 Characters"
            />
            <small v-if="form.password && !passwordValid" class="text-danger">
              At least 8 characters, one digit, one uppercase, one lowercase and
              one special character
            </small>
          </div>

          <div class="mt-4">
            <label for="cpassword">
              <span class="text-danger">*</span>
              Re-enter New Password
            </label>
            <input
              autocomplete="off"
              id="cpassword"
              v-model="form.cpassword"
              class="form-control"
              type="password"
              placeholder="repeat new password"
            />
            <small v-if="passwordNotMatch" class="text-danger">
              Passwords does not match
            </small>
          </div>

          <button
            :disabled="!resetReady || resetting"
            @click="resetPassword"
            class="btn mt-4 w-100"
          >
            <span>Reset my password</span>
            <span
              v-if="resetting"
              class="spinner-border spinner-border-sm text-light ml-3"
              role="status"
            ></span>
          </button>
        </div>

        <div v-if="resetSuccess" class="px-4 py-4 mt-5 box">
          <h4>Password Reset Successful!</h4>
          <p class="mb-3 mt-3">
            You can now use your new password to log in to your account!
          </p>

          <router-link to="/auth/login" class="btn a-btn mt-4 w-100">
            Login
          </router-link>
        </div>
      </div>
    </section>

    <section id="footer">
      <Footer />
    </section>
  </div>
</template>

<script>
import { guestAxios } from "../services/AxiosInstance";
// @ is an alias to /src
import Footer from "@/components/Footer.vue";

export default {
  name: "ForgotPassword",

  components: {
    Footer,
  },

  props: ["token", "email"],

  data() {
    return {
      form: {
        password: null,
        cpassword: null,
      },
      loading: true,
      resetSuccess: false,
      resetting: false,
      resetError: false,
    };
  },

  created() {
    const endPoint = "auth/verify-reset";
    guestAxios
      .post(endPoint, {
        email: this.email,
        token: this.token,
      })
      .then((res) => {
        this.loading = false;

        if (!res) {
          this.resetError = true;
        }
      })
      .catch((err) => {
        console.log({ err });
        this.loading = false;
      });
  },

  computed: {
    resetReady() {
      return this.form.password && this.form.cpassword && this.passwordReady;
    },

    passwordValid() {
      return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
        this.form.password
      );
    },

    passwordReady() {
      return this.form.password && this.passwordValid && !this.passwordNotMatch;
    },

    passwordNotMatch() {
      return this.form.password && this.form.password != this.form.cpassword;
    },
  },

  methods: {
    async resetPassword() {
      if (!this.resetReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.resetting = true;
        const body = {
          ...this.form,
          email: this.email,
          token: this.token,
        };

        const api = "auth/reset-password";
        const res = await guestAxios.post(api, body);

        this.resetting = false;
        if (!res) {
          return;
        }

        const { data } = res;

        // clear the form
        this.form = {
          password: null,
          cpassword: null,
        };

        this.$swal({
          icon: "success",
          text: data.message,
        });

        this.resetSuccess = true;
      } catch (err) {
        console.log(err);
        this.resetting = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../assets/css/guest.css";
</style>
