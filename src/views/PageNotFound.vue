<template>
  <div class="about">
    <section
      id="moreInfo"
      class="d-flex flex-column justify-content-center align-iteml-center"
    >
      <img
        class="mx-auto"
        src="@/assets/images/notfound.svg"
        alt="loading icon"
        width="168"
        height="170"
      />
      <p class="text-center fw-bold">Page Not Found!</p>
    </section>

    <section id="footer">
      <Footer />
    </section>
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";

export default {
  name: "PageNotFound",

  components: {
    Footer,
  },
};
</script>
<style scoped>
@import "../assets/css/guest.css";
</style>
