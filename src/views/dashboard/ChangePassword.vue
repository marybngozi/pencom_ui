<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left-tab col-12 col-lg-8 pt-5 px-5">
      <h4>Change Password</h4>

      <form action=""></form>
      <div class="mt-4 custom-input-group">
        <label for="oldPassword">
          <span class="text-danger">*</span>
          Old Password
        </label>
        <input
          autocomplete="off"
          id="oldPassword"
          v-model="form.oldPassword"
          class="custom-input border-gray"
          type="password"
          placeholder="- write old password -"
        />
      </div>

      <div class="mt-4 custom-input-group">
        <label for="newPassword">
          <span class="text-danger">*</span>
          New Password
        </label>
        <input
          autocomplete="off"
          id="newPassword"
          v-model="form.newPassword"
          class="custom-input border-gray"
          type="password"
          placeholder="- write new password -"
        />
        <small v-if="form.newPassword && !passwordValid" class="text-danger">
          At least 8 characters, one digit, one uppercase, one lowercase and one
          special character
        </small>
      </div>

      <div class="mt-4 custom-input-group">
        <label for="cpassword">
          <span class="text-danger">*</span>
          Confirm new password
        </label>
        <input
          autocomplete="off"
          id="cpassword"
          v-model="form.cpassword"
          class="custom-input border-gray"
          type="password"
          placeholder="- confirm new password -"
        />
        <small v-if="passwordNotMatch" class="text-danger">
          New Passwords does not match
        </small>
      </div>

      <button
        :disabled="!changeReady || changing"
        @click="changePassword"
        class="mt-5 w-100 button"
      >
        <span>Change Password</span>
        <span
          v-if="changing"
          class="spinner-border spinner-border-sm text-light ml-3"
          role="status"
        ></span>
      </button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
export default {
  name: "ChangePassword",
  data() {
    return {
      changing: false,
      form: {
        oldPassword: null,
        newPassword: null,
        cpassword: null,
      },
    };
  },
  computed: {
    ...mapGetters(["userEmail"]),

    changeReady() {
      return (
        this.form.oldPassword &&
        this.form.newPassword &&
        this.form.cpassword &&
        this.passwordReady
      );
    },

    passwordValid() {
      return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
        this.form.newPassword
      );
    },

    passwordReady() {
      return (
        this.form.oldPassword &&
        this.form.oldPassword.length >= 8 &&
        this.passwordValid &&
        !this.passwordNotMatch
      );
    },

    passwordNotMatch() {
      return (
        this.form.newPassword && this.form.newPassword != this.form.cpassword
      );
    },
  },

  methods: {
    async changePassword() {
      if (!this.changeReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.changing = true;
        const body = {
          ...this.form,
          email: this.userEmail,
        };

        const api = "auth/change-password";
        const res = await secureAxios.post(api, body);

        this.changing = false;
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
        this.$router.push({ path: "/app" });
      } catch (err) {
        console.log(err);
        this.changing = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
