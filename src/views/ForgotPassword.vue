<template>
  <div class="about">
    <section id="moreInfo" class="mt-4">
      <div class="px-4 py-4 mt-5 box">
        <h4>Did you forget your password?</h4>
        <p class="mb-5 mt-3">
          Enter the email address you are using for this account below, and we
          will send you a password reset link.
        </p>

        <div class="mb-3">
          <label for="email">
            <span class="text-danger">*</span>
            Email Address
          </label>
          <input
            autofocus
            id="email"
            v-model="form.email"
            class="form-control"
            type="email"
            placeholder="emailaddy@gmail.com"
          />
        </div>

        <button
          :disabled="!resetReady || resetting"
          @click="resetPassword"
          class="btn mt-4 w-100"
        >
          <span>Request Reset Link</span>
          <span
            v-if="resetting"
            class="spinner-border spinner-border-sm text-light ml-3"
            role="status"
          ></span>
        </button>

        <p class="mt-4 text-center">
          <span class="text-faint">Back to </span>
          <router-link to="/"> Sign in</router-link>
        </p>
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

  data() {
    return {
      form: {
        email: null,
      },
      resetting: false,
    };
  },

  computed: {
    resetReady() {
      return this.form.email && /^\S+@\S+\.\S+$/.test(this.form.email);
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
          verifyUrl: window.location.origin + "/reset-password",
        };

        const api = "auth/forgot-password";
        const res = await guestAxios.post(api, body);

        this.resetting = false;
        if (!res) {
          return;
        }

        const { data } = res;

        // clear the form
        Object.keys(this.form).forEach((key) => {
          this.form[key] = null;
        });

        this.$swal({
          icon: "success",
          text: data.message,
        });

        this.$router.push("/");
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
