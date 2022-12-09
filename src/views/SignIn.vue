<template>
  <div class="about">
    <section id="moreInfo" class="">
      <div class="px-3 mt-5">
        <div
          class="d-block d-lg-flex flex-reverse justify-content-between px-1 px-lg-3 my-5"
        >
          <div
            class="col-12 col-lg-7 col-md-7 mx-auto d-flex justify-content-center"
          >
            <div class="col-12 col-lg-10 card shadow border-0 mt-4 pb-4">
              <div class="card-body pt-4 px-5">
                <div class="d-flex justify-content-between">
                  <div>
                    <h1 class="mt-4">Sign In</h1>
                    <p class="mb-5 text-faint">Log in to Pencom</p>
                  </div>
                  <div>
                    <div class="col-7 col-lg-3">
                      <img
                        src="@/assets/images/logo_black.svg"
                        id="logo"
                        alt="logo"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div>
                    <label for="email">Email Address</label>
                    <input
                      autocomplete="false"
                      v-model="form.email"
                      id="email"
                      class="form-control"
                      type="email"
                      placeholder="email address"
                    />
                  </div>

                  <div class="mt-4">
                    <label for="password">Password</label>
                    <input
                      autocomplete="false"
                      v-model="form.password"
                      id="password"
                      class="form-control"
                      type="password"
                      placeholder="password"
                    />
                  </div>

                  <div class="d-flex justify-content-end mb-4 mt-2">
                    <router-link class="fs-8 a-link" to="/forgot-password">
                      Forgot Password?
                    </router-link>
                  </div>

                  <button
                    @click="login"
                    :disabled="!loginReady || logging"
                    class="btn mt-4 w-100"
                  >
                    <span>Sign in</span>
                    <span
                      v-if="logging"
                      class="spinner-border spinner-border-sm text-light ml-3"
                      role="status"
                    ></span>
                  </button>

                  <p class="mt-4 text-center">
                    <span class="text-faint">Create a &nbsp;</span>
                    <router-link to="/company-signup">Company</router-link>
                    &nbsp;or&nbsp;
                    <router-link to="/staff-signup">Staff</router-link>
                    <span class="text-faint">&nbsp;account</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="footer">
      <Footer />
    </section>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { guestAxios } from "../services/AxiosInstance";
// @ is an alias to /src
import Footer from "@/components/Footer.vue";

export default {
  name: "SignIn",

  components: {
    Footer,
  },

  data() {
    return {
      scrollHeight: 0,
      logging: false,
      form: {
        email: null,
        password: null,
      },
    };
  },

  computed: {
    loginReady() {
      return this.form.email && this.form.password;
    },
  },
  mounted() {
    this.logout();
  },

  methods: {
    ...mapActions(["saveUserInfo", "getMenus", "logout"]),

    async login() {
      try {
        this.logging = true;

        const api = "auth/login";
        const res = await guestAxios.post(api, {
          ...this.form,
        });

        this.logging = false;
        if (!res) {
          return;
        }

        const { data } = res;

        const user = data.data.user;

        if (!user.accountVerified) {
          this.$swal({
            icon: "error",
            text: `This account has not been verified, check you email ${user.email} for verification link!`,
          });
          return;
        }

        const token = data.data.auth.token;

        this.saveUserInfo({ user, token });

        // got to dashboard or the requested page
        this.$router.push(this.$route.query.nextUrl || "/app");

        // clear the form
        Object.keys(this.form).forEach((key) => {
          this.form[key] = null;
        });

        this.$swal({
          toast: true,
          icon: "success",
          text: data.message,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (err) {
        console.log(err);
        this.logging = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../assets/css/guest.css";
</style>
