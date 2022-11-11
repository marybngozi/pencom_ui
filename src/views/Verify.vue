<template>
  <div class="about">
    <section
      id="moreInfo"
      class="d-flex flex-column justify-content-center align-iteml-center"
    >
      <p
        v-if="!verifyError && !verified"
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
      verifyError: false,
      verified: false,
    };
  },

  mounted() {
    if (!this.$route.params.token) {
      this.$router.push({ path: "/" });
    }
    const token = this.$route.params.token;

    const api = "auth/verify";

    // verify token
    guestAxios
      .post(api, {
        token: token,
      })
      .then((res) => {
        if (res.response && res.response.status == 404) {
          // show the error message
          this.verifyError = true;
        } else {
          this.verified = true;
          this.$swal({
            icon: "success",
            text: "Your account have been successfully verified!",
            allowOutsideClick: false,
            confirmButtonText: "Proceed",
          }).then((res) => {
            if (res.isConfirmed) {
              this.$router.push({ path: "/" });
              return;
            }
          });
        }
      });
  },
};
</script>
<style scoped>
@import "../assets/css/guest.css";
</style>
