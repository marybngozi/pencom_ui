<template>
  <div class="d-flex flex-column justify-content-center align-items-center">
    <p v-if="verifying && !success" class="text-center fw-bold text-secondary">
      <span class="spinner-border" style="width: 4rem; height: 4rem"></span>
      <br />
      <span>Verifying ...</span>
    </p>

    <p
      v-else-if="!verifying && !success"
      class="text-center fw-bold text-secondary"
    >
      <i class="fas fa-unlink fa-3x mb-3"></i>
      <br />
      <span>Link is invalid</span>
    </p>

    <p v-else class="text-center fw-bold text-success">
      <i class="fas fa-check fa-4x mb-3"></i>
      <br />
      <span>Successful</span>
    </p>
  </div>
</template>

<script>
import { guestAxios } from "../../services/AxiosInstance";
export default {
  name: "InviteVerify",

  data() {
    return {
      verifying: false,
      success: false,
    };
  },

  async created() {
    console.log("first");
    try {
      const token = this.$route.params.token;
      this.verifying = true;

      const api = "auth/admin-staff-accept";
      const res = await guestAxios.post(api, {
        token,
      });

      this.verifying = false;
      if (!res) {
        return;
      }
      this.success = true;

      const { data } = res;

      this.$swal({
        icon: "success",
        text: data.message,
      });

      /*  Go to login */
      this.$router.push({ path: "/auth/login" });
    } catch (err) {
      console.log(err);
      this.verifying = false;
    }
  },
};
</script>

<style scoped></style>
