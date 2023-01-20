<template>
  <div class="boxx">
    <div class="inner-boxx">
      <div class="gray-boxx">
        <!-- left picture -->
        <img class="dp" :src="userLogo" alt="profile picture" />

        <div class="profile-right">
          <h5>{{ username }}</h5>

          <div v-company class="blue-box">
            <img src="@/assets/images/dart.svg" alt="dart icon" />

            <h6>Company code verified</h6>
          </div>

          <div class="info">
            <small>Email address</small>

            <h6>{{ userEmail }}</h6>

            <router-link to="/account/profile">View Profile</router-link>
          </div>

          <div v-staff class="ddate">
            <small>RSA Code</small>
            <p>{{ rsaPin }}</p>
          </div>

          <div v-pfa class="ddate">
            <small>PFA Code</small>
            <p>{{ pfaCode }}</p>
          </div>

          <div v-staff class="ddate">
            <small>PFA</small>
            <p>AXE Pensions</p>
          </div>

          <div class="ddate">
            <small>Account created on</small>
            <p>{{ userDateOfCreation | moment("DD.MM.YYYY") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ProfileBox",
  computed: {
    ...mapGetters([
      "userLogo",
      "username",
      "pfaCode",
      "userEmail",
      "userDateOfCreation",
      "rsaPin",
    ]),
  },
};
</script>

<style scoped>
.boxx {
  padding: 1.75rem;
  /* border-bottom: 1px solid #f2f2f2; */
}
.inner-boxx {
  box-shadow: 0.25rem 0.25rem 1.25rem rgba(0, 0, 0, 0.1);
  border-radius: 1.25rem;
  padding: 16px;
}
.gray-boxx {
  padding: 16px 0;
  background: #f9f9f9;
  border-radius: 1.25rem;
  display: flex;
  justify-content: space-around;
  gap: 8px;
}
.dp {
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  border: 2px solid #d7e0ff;
  border-radius: 60px;
}
h5 {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: #252a2f;
}
.blue-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  gap: 10px;
  width: 100%;
  min-width: 150px;
  height: 3rem;
  background: #eff7ff;
  border-radius: 1.5rem;
  margin-top: 0.25rem;
}
h6 {
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 140.3%;
  color: #252a2f;
}
.profile-right h5 {
  color: #808080;
}
.profile-right .info {
  margin-top: 1.5rem;
}
.profile-right h6 {
  font-weight: 400;
  line-height: 1.1875rem;
}
.profile-right a {
  text-decoration: none;
  padding: 0.25rem 1.25rem;
  height: 1.75rem;
  background: #eff7ff;
  border: 1px solid #0090ff;
  border-radius: 1.5rem;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: #0090ff;
}
.profile-right .ddate {
  margin-top: 1.5rem;
}
.profile-right .info small,
.profile-right .ddate small {
  font-weight: 500;
  font-size: 10px;
  line-height: 0.8125rem;
  color: #808080;
}
.profile-right .ddate p {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3125rem;
  color: #252a2f;
}
</style>
