<template>
  <div class="boxx">
    <div class="inner-boxx">
      <div class="gray-boxx">
        <!-- left picture -->
        <img
          class="dp"
          src="@/assets/images/null_female.png"
          alt="profile picture"
        />

        <div class="right">
          <h5>Appmart Integrated LTD</h5>

          <div class="blue-box">
            <img src="@/assets/images/dart.svg" alt="dart icon" />

            <h6>Employer code verified</h6>
          </div>

          <div class="info">
            <h5>Email address</h5>

            <h6>info@appmartgroup.com</h6>

            <router-link to="/profile">Edit</router-link>
          </div>

          <div class="ddate">
            <small>Account created on</small>
            <p>23.04.2022</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileBox",
};
</script>

<style scoped>
.boxx {
  padding: 28px;
  border-bottom: 1px solid #f2f2f2;
}
.inner-boxx {
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 16px;
}
.gray-boxx {
  padding: 16px 0;
  background: #f9f9f9;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
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
  font-size: 16px;
  line-height: 21px;
  color: #252a2f;
}
.blue-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  gap: 10px;
  width: 218px;
  height: 48px;
  background: #eff7ff;
  border-radius: 24px;
  margin-top: 4px;
}
h6 {
  font-weight: 500;
  font-size: 14px;
  line-height: 140.3%;
  color: #252a2f;
}
.right h5 {
  color: #808080;
}
.right .info {
  margin-top: 24px;
}
.right h6 {
  font-weight: 400;
  line-height: 19px;
}
.right a {
  text-decoration: none;
  padding: 4px 20px;
  height: 28px;
  background: #eff7ff;
  border: 1px solid #0090ff;
  border-radius: 24px;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #0090ff;
}
.right .ddate {
  margin-top: 24px;
}
.right .ddate small {
  font-weight: 500;
  font-size: 10px;
  line-height: 13px;
  color: #808080;
}
.right .ddate p {
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  color: #252a2f;
}
</style>
