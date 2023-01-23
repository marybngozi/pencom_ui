<template>
  <div>
    <!-- Gray plane -->
    <div class="gray-plane">
      <h5>{{ username }} Profile</h5>
      <div>
        <span v-if="updateMode">
          <button @click="saveUpdate" class="btn-blue">Save</button>
          <button @click="cancelUpdate" class="btn-gray">Cancel</button>
        </span>
        <button v-else @click="setEdit" class="btn-blue">Edit</button>
      </div>
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
          <div class="profile-info" :class="`${updateMode ? 'active' : ''}`">
            <p><span v-company>Company</span> Name</p>
            <input v-if="updateMode" type="text" v-model="form.username" />
            <p v-else>{{ username }}</p>
          </div>

          <div class="profile-info">
            <p><span v-company>Company</span> Email</p>
            <p>{{ userEmail }}</p>
          </div>
          <div v-company class="profile-info">
            <p>Employer Code</p>
            <p>{{ companyCode }}</p>
          </div>
          <div v-company class="profile-info">
            <p>Company RC</p>
            <p>RC-{{ user ? user.companyRc : "" }}</p>
          </div>
          <div v-staff class="profile-info">
            <p>PFA</p>
            <p>Sigma Pensions</p>
          </div>
          <div v-staff class="profile-info">
            <p>RSA PIN</p>
            <p>{{ rsaPin }}</p>
          </div>
          <div class="profile-info" :class="`${updateMode ? 'active' : ''}`">
            <p>Phone Number</p>
            <input v-if="updateMode" type="tel" v-model="form.phone" />
            <p v-else>{{ user ? user.phone : "" }}</p>
          </div>
          <div class="profile-info" :class="`${updateMode ? 'active' : ''}`">
            <p>Address</p>
            <input v-if="updateMode" type="text" v-model="form.address" />
            <p v-else>{{ user ? user.address : "" }}</p>
          </div>
          <div class="profile-info" :class="`${updateMode ? 'active' : ''}`">
            <p>City</p>
            <input v-if="updateMode" type="text" v-model="form.city" />
            <p v-else>{{ user ? user.city : "" }}</p>
          </div>
          <div class="profile-info" :class="`${updateMode ? 'active' : ''}`">
            <p>State</p>
            <input v-if="updateMode" type="text" v-model="form.state" />
            <p v-else>{{ user ? user.state : "" }}</p>
          </div>
          <div class="profile-info">
            <p>Date of Registration</p>
            <p>{{ userDateOfCreation | moment("MMMM DD, YYYY") }}</p>
          </div>
        </div>

        <!-- small boxes -->
        <div class="small-boxes mt-5 pb-5">
          <div class="col-12 col-lg-3 small-box box-1">
            <p v-company class="m-0">Number of uploaded schedules</p>
            <p v-spfca class="m-0">Number of Companies contributing pension</p>
            <div>{{ countAll }}</div>
          </div>
          <div class="col-12 col-lg-3 small-box box-1">
            <p v-company class="m-0">Number of paid schedules</p>
            <p v-spfca class="m-0">Last <br />processed pension month</p>
            <div>{{ countPaid }}</div>
          </div>
          <div class="col-12 col-lg-4 small-box box-2">
            <p v-company class="m-0 px-4">Total pension processed</p>
            <p v-spfca class="m-0 px-4">Total pension Received</p>
            <div>{{ totalProcessed | toCurrency }}</div>
          </div>
        </div>
      </div>
      <!-- Profile body  /-->
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";

export default {
  name: "Profile",
  data() {
    const user = this.$store.state.user;
    const form = {
      username: this.$store.getters.username,
      firstName: null,
      lastName: null,
      otherName: null,
      companyName: null,
      city: null,
      address: null,
      state: null,
      phone: null,
    };

    for (const key in form) {
      if (Object.hasOwnProperty.call(form, key)) {
        form[key] = user[key] ? user[key] : form[key];
      }
    }
    return {
      updating: false,
      getting: false,
      updateMode: false,
      logoUpload: null,
      logoLink: this.$store.getters.userLogo,
      user: this.$store.state.user,
      userType: this.$store.getters.userType,
      countAll: 0,
      countPaid: 0,
      totalProcessed: 0,
      form: form,
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
      "userLogo",
    ]),

    updateReady() {
      return true;
    },
  },
  async created() {
    await this.getProfile();
  },
  watch: {
    "form.username"(newValue) {
      if (!newValue) return;
      if (this.userType != 200 && this.userType != 300) {
        this.form.companyName = newValue;
        return;
      }
      const names = newValue.split(" ");
      this.form.lastName = names[0];
      this.form.firstName = names[1] ? names[1] : null;
      this.form.otherName = names[2] ? names[2] : null;
    },
  },
  methods: {
    ...mapActions(["saveUserInfo"]),
    handleFileChange(e) {
      this.logoUpload = e.target.files[0];
      this.logoLink = URL.createObjectURL(this.logoUpload);
      this.form.logoUpload = this.logoUpload;
      this.updateMode = true;
    },
    setEdit() {
      this.updateMode = true;
    },
    cancelUpdate() {
      this.logoLink = this.userLogo;
      this.updateMode = false;
    },
    async getProfile() {
      try {
        this.getting = true;

        const api = "auth/profile";

        const res = await secureAxios.get(api);

        this.getting = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.data = data.data;
        this.countAll = data.data.countAll;
        this.countPaid = data.data.countPaid;
        this.totalProcessed = data.data.totalProcessed;
      } catch (err) {
        console.log(err);
        this.getting = false;
      }
    },
    async saveUpdate() {
      if (!this.updateReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.updating = true;

        const api = "auth/profile";

        // build the multipart form data
        const formData = new FormData();
        Object.keys(this.form).forEach((key) => {
          formData.append(key, this.form[key]);
        });

        const res = await secureAxios.post(api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.updating = false;
        if (!res) {
          return;
        }

        const { data } = res;

        // clear the form
        this.saveUserInfo({ user: data.data, token: null });
        this.updateMode = false;

        this.$swal({
          icon: "success",
          text: data.message,
        });
      } catch (err) {
        console.log(err);
        this.updating = false;
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
.gray-plane > div > span {
  display: flex;
  gap: 0.6rem;
}
.gray-plane button {
  border: none;
  padding: 0.7rem 1.25rem;
  width: 100px;
  /* height: 2.5rem; */
  border-radius: 3.125rem;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
}
.gray-plane button.btn-blue {
  color: #ffffff;
  background: #0090ff;
}
.gray-plane button.btn-gray {
  color: #000000;
  background: transparent;
  border: 1px solid #000000;
}
.profile-body {
  margin: 2.4375rem auto 0 auto;
  width: 97%;
  max-width: 800px;
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
.logo-div > img {
  width: 120px;
  height: 120px;
  border-radius: 100%;
  border: 2px solid #0090ff;
  object-fit: cover;
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
  padding: 1rem;
  margin-bottom: 0.9rem;
  height: 3rem;
  border: 1px solid #dddddd;
  border-radius: 3.125rem;
  background: #f9f9f9;
}
.profile-info.active {
  border: 1px solid #80b7ff;
  background: #ffffff;
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
.profile-info input {
  width: 80%;
  border: none;
  background: transparent;
  text-align: right;
}
.profile-info input:focus {
  outline: none;
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
