<template>
  <div class="about">
    <section id="moreInfo" class="">
      <div
        class="px-4 mt-5 d-block d-lg-flex justify-content-between px-lg-3 my-5"
      >
        <div
          class="col-12 col-lg-10 col-md-9 mx-auto d-flex justify-content-center"
        >
          <div class="col-12 col-lg-10 card shadow border-0 mt-4 pb-4">
            <div class="card-body pt-4 px-5">
              <div class="d-flex justify-content-between">
                <div>
                  <h1 class="mt-4">Create a staff account</h1>
                  <p class="mb-5 text-faint">
                    Or click to
                    <router-link to="/auth/company-signup"
                      >Create a Company account</router-link
                    >
                  </p>
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
                <div class="d-flex justify-content-between">
                  <div class="group-input">
                    <label for="firstName">
                      <span class="text-danger">*</span>
                      First Name
                    </label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      class="form-control"
                      type="text"
                      placeholder="first name"
                    />
                  </div>

                  <div class="group-input">
                    <label for="lastName">
                      <span class="text-danger">*</span>
                      Last Name
                    </label>
                    <input
                      autocomplete="off"
                      id="lastName"
                      v-model="form.lastName"
                      class="form-control"
                      type="text"
                      placeholder="last name"
                    />
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <div class="group-input">
                    <label for="otherName"> Other Names </label>
                    <input
                      id="otherName"
                      v-model="form.otherName"
                      class="form-control"
                      type="text"
                      placeholder="other names"
                    />
                  </div>

                  <div class="group-input">
                    <label for="rsaPin">
                      <span class="text-danger">*</span>
                      RSA PIN
                    </label>
                    <input
                      autocomplete="off"
                      id="rsaPin"
                      v-model="form.rsaPin"
                      class="form-control"
                      type="text"
                      placeholder="rsaPin"
                    />
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <div class="group-input">
                    <label for="email">
                      <span class="text-danger">*</span>
                      Email Address
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      class="form-control"
                      type="email"
                      placeholder="email address"
                    />
                    <small v-if="!isEmailValid" class="text-danger fw-bold">
                      Invalid Email, please enter a valid email address!
                    </small>
                  </div>

                  <div class="group-input">
                    <label for="phone">
                      <span class="text-danger">*</span>
                      Phone
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      class="form-control"
                      type="tel"
                      maxlength="14"
                      placeholder="phone"
                    />
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <div class="group-input">
                    <label for="password">
                      <span class="text-danger">*</span>
                      Password
                    </label>
                    <input
                      autocomplete="off"
                      id="password"
                      v-model="form.password"
                      class="form-control"
                      type="password"
                      placeholder="8 Characters"
                    />
                    <small
                      v-if="form.password && !passwordValid"
                      class="text-danger"
                    >
                      At least 8 characters, one digit, one uppercase, one
                      lowercase and one special character
                    </small>
                  </div>

                  <div class="group-input">
                    <label for="confirmPassword">
                      <span class="text-danger">*</span>
                      Confirm Password
                    </label>
                    <input
                      autocomplete="off"
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      class="form-control"
                      type="password"
                      placeholder="repeat password"
                    />
                    <small v-if="passwordNotMatch" class="text-danger">
                      Passwords does not match
                    </small>
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <div class="group-input">
                    <label for="city">
                      <span class="text-danger">*</span>
                      City
                    </label>
                    <input
                      autocomplete="off"
                      id="city"
                      v-model="form.city"
                      class="form-control"
                      type="text"
                      placeholder="city"
                    />
                  </div>

                  <div class="group-input">
                    <label for="state">
                      <span class="text-danger">*</span>
                      State
                    </label>
                    <select
                      name="state"
                      v-model="form.state"
                      id="state"
                      class="form-control"
                    >
                      <option :value="null">- select a State -</option>
                      <option
                        v-for="state in allStates"
                        :value="state.stateName"
                        :key="state.stateCode"
                      >
                        {{ state.stateName }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="d-flex justify-content-between my-4">
                  <div class="group-input">
                    <label for="address">
                      <span class="text-danger">*</span>
                      Address
                    </label>
                    <input
                      id="address"
                      v-model="form.address"
                      class="form-control"
                      type="text"
                      placeholder="address"
                    />
                  </div>
                </div>

                <button
                  :disabled="!createReady || creating"
                  @click="createAccount"
                  class="btn mt-4 w-100"
                >
                  <span>Create account</span>
                  <span
                    v-if="creating"
                    class="spinner-border spinner-border-sm text-light ml-3"
                    role="status"
                  ></span>
                </button>

                <p class="mt-4 text-center">
                  <span class="text-faint">Already have an account? </span>
                  <router-link to="/auth/login">Sign in</router-link>
                </p>
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
import { mapGetters } from "vuex";
import { guestAxios } from "../services/AxiosInstance";
// @ is an alias to /src
import Footer from "@/components/Footer.vue";

export default {
  name: "StaffSignUp",

  components: {
    Footer,
  },

  data() {
    return {
      form: {
        email: null,
        firstName: null,
        lastName: null,
        otherName: null,
        password: null,
        confirmPassword: null,
        phone: null,
        address: null,
        city: null,
        state: null,
        rsaPin: null,
      },
      creating: false,
      isEmailValid: true,
    };
  },

  beforeCreate() {
    this.$store.dispatch("getStates");
  },

  computed: {
    ...mapGetters(["allStates"]),
    createReady() {
      return (
        this.form.email &&
        /^\S+@\S+\.\S+$/.test(this.form.email) &&
        this.form.firstName &&
        this.form.lastName &&
        this.form.phone &&
        this.form.address &&
        this.form.city &&
        this.form.state &&
        this.form.rsaPin &&
        this.form.confirmPassword &&
        this.passwordReady
      );
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
      return (
        this.form.password && this.form.password != this.form.confirmPassword
      );
    },
  },

  methods: {
    async createAccount() {
      try {
        this.creating = true;
        const body = {
          ...this.form,
          verifyUrl: window.location.origin + "/auth/verify",
        };

        const api = "auth/staff-register";
        const res = await guestAxios.post(api, body);

        this.creating = false;
        if (!res) {
          return;
        }

        const { data } = res;

        // clear the form
        Object.keys(this.form).forEach((key) => {
          this.form[key] = null;
        });

        this.$router.push({ path: "/auth/login" });

        this.$swal({
          icon: "success",
          text: data.message,
        });
      } catch (err) {
        console.log(err);
        this.creating = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../assets/css/guest.css";
</style>
