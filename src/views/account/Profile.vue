<template>
  <div>
    <!-- Gray plane -->
    <div class="gray-plane">
      <h5>{{ username }} Profile</h5>
      <button>Edit</button>
    </div>

    <!-- Profile body  -->
    <div class="col-12 d-flex justify-content-center profile">
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
            <p><span v-company>Company</span> Name</p>
            <p>{{ username }}</p>
          </div>
          <div class="profile-info">
            <p><span v-company>Company</span> Email</p>
            <p>{{ userEmail }}</p>
          </div>
          <div v-company class="profile-info">
            <p>Employer Code</p>
            <p>{{ companyCode }}</p>
          </div>
          <div v-staff class="profile-info">
            <p>PFA</p>
            <p>Sigma Pensions</p>
          </div>
          <div v-staff class="profile-info">
            <p>RSA PIN</p>
            <p>{{ rsaPin }}</p>
          </div>
          <div v-staff class="profile-info">
            <p>Phone Number</p>
            <p>08101194108</p>
          </div>
          <div class="profile-info">
            <p>Date of Registration</p>
            <p>{{ userDateOfCreation | moment("MMMM DD, YYYY") }}</p>
          </div>
        </div>

        <!-- small boxes -->
        <div class="small-boxes mt-5 pb-5">
          <div class="small-box box-1">
            <p v-company class="m-0 px-4">Number of uploaded schedules</p>
            <p v-spfca class="m-0 px-3">
              Number of Companies contributing pension
            </p>
            <div>20</div>
          </div>
          <div class="small-box box-1">
            <p v-company class="m-0 px-4">Number of processed schedules</p>
            <p v-spfca class="m-0 px-4">Last <br />processed pension month</p>
            <div>18</div>
          </div>
          <div class="small-box box-2">
            <p v-company class="m-0 px-4">Total pension processed</p>
            <p v-spfca class="m-0 px-4">Total pension Received</p>
            <div>{{ "200095400" | toCurrency }}</div>
          </div>
        </div>
      </div>
      <!-- Profile body  /-->
    </div>
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
    ...mapGetters([
      "companyCode",
      "username",
      "userEmail",
      "userDateOfCreation",
      "rsaPin",
    ]),
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
.profile {
  overflow-y: scroll;
  height: calc(100vh - 160px);
}
.profile::-webkit-scrollbar {
  display: none;
}
.profile {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
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
  margin-bottom: 15px;
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
.small-boxes {
  display: flex;
  justify-content: space-between;
}
.small-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 12px;
  width: 230px;
  height: 156px;
  border-radius: 20px;
}
.small-box p {
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  /* padding: 0 30px; */
}
.small-box div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 12px;
  margin-top: 12px;
  width: 99%;
  height: 41px;
  border-radius: 20px;
}
.small-box.box-1 {
  background: #f9f9f9;
}
.small-box.box-1 p {
  color: #5e6974;
}
.small-box.box-1 div {
  color: #5e6974;
  border: 1px solid #808080;
}
.small-box.box-2 {
  background: #252a2f;
}
.small-box.box-2 p {
  color: #ffffff;
}
.small-box.box-2 div {
  color: #ffffff;
  border: 1px solid #ffffff;
}
</style>
