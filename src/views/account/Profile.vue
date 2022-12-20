<template>
  <div>
    <!-- Gray plane -->
    <div class="gray-plane">
      <h5>Appmart Integrated Profile</h5>
      <button>Edit</button>
    </div>

    <!-- Profile body  -->
    <div class="profile-body">
      <!-- Logo rounded box -->
      <div class="logo-round-box">
        <p>Company Logo</p>
        <div class="logo-div">
          <img src="@/assets/images/null_female.png" alt="user image" />
        </div>
      </div>

      <!-- profile details -->
      <div class="mt-5">
        <div class="profile-info">
          <p>Company Name</p>
          <p>{{ username }}</p>
        </div>
        <div class="profile-info">
          <p>Company Name</p>
          <p>{{ username }}</p>
        </div>
        <div class="profile-info">
          <p>Company Name</p>
          <p>{{ username }}</p>
        </div>
      </div>
    </div>
    <!-- Profile body  /-->
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";

export default {
  name: "Profile",
  data() {
    return {
      checking: false,
      verifying: false,
      logoUpload: null,
      form2: {
        token: null,
      },
    };
  },
  computed: {
    ...mapGetters(["companyCode", "username"]),
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
/* @import "../../assets/css/dashboard.css"; */
.gray-plane {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 1.4em;
  height: 64px;
  background: #f9f9f9;
  margin-top: 18px;
}
.gray-plane h5 {
  font-weight: 700;
  font-size: 1.4em;
  line-height: 140.3%;
  color: #252a2f;
  margin-bottom: 0;
}
.gray-plane button {
  border: none;
  padding: 12px 20px;
  width: 100px;
  height: 40px;
  background: #0090ff;
  border-radius: 50px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #ffffff;
}
.profile-body {
  margin: 39px auto 0 auto;
  /* margin-left: 5%;
  margin-top: 39px; */
  width: 97%;
  max-width: 750px;
}
.logo-round-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 160px;
  border: 1px solid #dddddd;
  border-radius: 100px;
}
.logo-round-box p {
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  margin: 0;
  padding: 0;
  color: #5e6974;
}
.logo-round-box img {
  width: 120px;
  height: 120px;
  border-radius: 100%;
  border: 2px solid #0090ff;
}
.profile-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 10px;
  height: 48px;
  border: 1px solid #dddddd;
  border-radius: 50px;
}
.profile-info p {
  margin: 0;
  padding: 0;
}
.profile-info p:first-child {
  font-style: italic;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #5e6974;
}
.profile-info p:last-child {
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  color: #252a2f;
}
</style>
