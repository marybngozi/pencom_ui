<template>
  <div class="">
    <section
      id="moreInfo"
      class="d-flex flex-column justify-content-center align-items-center"
    >
      <p
        v-if="verifying && !verifyError && !verified"
        class="text-center fw-bold text-secondary"
      >
        <span class="spinner-border" style="width: 4rem; height: 4rem"></span>
        <br />
        <span>Verifying ...</span>
      </p>

      <p
        v-if="!verifyError && verified"
        class="text-center fw-bold text-success"
      >
        <i class="fas fa-check fa-4x mb-3"></i>
        <br />
        <span>Verified</span>
      </p>

      <p v-if="verifyError" class="text-center fw-bold text-secondary">
        <i class="fas fa-unlink fa-3x mb-3"></i>
        <br />
        <span>Verification link is invalid</span>
      </p>
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
  name: "Verify",

  components: {
    Footer,
  },

  data() {
    return {
      verifying: false,
      verifyError: false,
      verified: false,
    };
  },

  async beforeCreate() {
    if (!this.$route.params.token) {
      this.$router.push({ path: "/" });
    }
    const token = this.$route.params.token;

    try {
      this.verifying = true;
      const api = "auth/verify";

      // verify token
      const res = await guestAxios.post(api, {
        token: token,
      });

      if (!res) {
        this.verifyError = true;
        return;
      }
      this.verified = true;
      this.verifying = false;
      this.$router.push({ path: "/" });

      this.$swal({
        icon: "success",
        text: res.data.message,
      });
    } catch (err) {
      console.log(err);
      this.verifying = false;
      this.$router.push({ path: "/" });
    }
  },
};
</script>
<style scoped>
@import "../assets/css/guest.css";
#moreInfo {
  height: 60vh;
}
</style>
