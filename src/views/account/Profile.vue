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
            <img :src="logoLink" alt="user image" />

            <div class="select-icon">
              <img src="@/assets/images/selectFile.svg" alt="icon" />
              <input
                name="profilePics"
                id="profilePics"
                accept="image/png, image/jpeg"
                type="file"
                @change="handleFileChange"
              />
            </div>
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
          <div class="col-12 col-lg-3 small-box box-1">
            <p v-company class="m-0 px-4">Number of uploaded schedules</p>
            <p v-spfca class="m-0 px-3">
              Number of Companies contributing pension
            </p>
            <div>20</div>
          </div>
          <div class="col-12 col-lg-3 small-box box-1">
            <p v-company class="m-0 px-4">Number of processed schedules</p>
            <p v-spfca class="m-0 px-4">Last <br />processed pension month</p>
            <div>18</div>
          </div>
          <div class="col-12 col-lg-4 small-box box-2">
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
import { mapGetters } from "vuex";
// import { secureAxios } from "../../services/AxiosInstance";

export default {
  name: "Profile",
  data() {
    return {
      checking: false,
      verifying: false,
      logoUpload: null,
      logoLink:
        "https://res.cloudinary.com/dnbbhvcbt/image/upload/v1673867354/pencom/null_female_r83gc5.png",
    };
  },
  computed: {
    ...mapGetters([
      "companyCode",
      "pfaCode",
      "username",
      "userEmail",
      "userDateOfCreation",
      "rsaPin",
    ]),
  },

  methods: {
    handleFileChange(e) {
      this.logoUpload = e.target.files[0];
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
  padding: 12px 1.25rem;
  width: 100px;
  height: 2.5rem;
  background: #0090ff;
  border-radius: 3.125rem;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #ffffff;
}
.profile-body {
  margin: 2.4375rem auto 0 auto;
  width: 97%;
  max-width: 750px;
}
.logo-round-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  width: 100%;
  height: 160px;
  border: 1px solid #dddddd;
  border-radius: 100px;
}
.logo-round-box p {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.3125rem;
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
.logo-div {
  position: relative;
}
.logo-div > .select-icon {
  position: absolute;
  width: 2rem;
  height: 2rem;
  top: 40%;
  left: 40%;
}
.logo-div > .select-icon > img {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}
.logo-div > .select-icon > input {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  opacity: 0;
  z-index: 2;
  cursor: pointer;
}
.profile-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  margin-bottom: 15px;
  height: 3rem;
  border: 1px solid #dddddd;
  border-radius: 3.125rem;
  background: #f9f9f9;
}
.profile-info p {
  margin: 0;
  padding: 0;
}
.profile-info p:first-child {
  font-style: italic;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: #5e6974;
}
.profile-info p:last-child {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: #252a2f;
}
.small-boxes {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.7rem;
}
.small-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
  gap: 12px;
  /* width: 30%; */
  height: 156px;
  border-radius: 1.25rem;
}
.small-box p {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  text-align: center;
  /* padding: 0 1.875rem; */
}
.small-box div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 12px;
  margin-top: 12px;
  width: 99%;
  height: 2.5625rem;
  border-radius: 1.25rem;
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
