<template>
  <footer
    class="d-flex flex-column justify-content-center align-items-center my-5"
  >
    <!-- socials -->
    <div class="d-flex">
      <a
        href="https://www.instagram.com/appmartng/"
        target="_blank"
        class="btn button mx-2"
      >
        <i class="fab fa-instagram"></i>
      </a>
      <a
        href="https://ng.linkedin.com/company/appmart-integrated"
        target="_blank"
        class="btn button mx-2"
      >
        <i class="fab fa-linkedin-in"></i>
      </a>
      <a
        href="https://twitter.com/appmartgroup"
        target="_blank"
        class="btn button mx-2"
      >
        <i class="fab fa-twitter"></i>
      </a>
      <a
        href="https://www.facebook.com/appmartgroup"
        target="_blank"
        class="btn button mx-2"
      >
        <i class="fab fa-facebook-square"></i>
      </a>
    </div>

    <!-- links -->
    <div class="mt-4 foot-nav">
      <a href="#" class="mx-3">Support</a>
      <a href="#" class="mx-3">API</a>
      <a href="#" class="mx-3">Privacy Policy</a>
      <a href="#" class="mx-3">Cookie Policy</a>
    </div>

    <!-- copy right -->
    <div class="mt-4">
      <p>
        <span>&copy; {{ year }}</span>
        <router-link to="/"> Pencom</router-link>
      </p>
    </div>
  </footer>
</template>
<script>
export default {
  name: "Footer",

  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: #6c7a87;
  font-weight: 400;
}
p a {
  color: #0b2238;
}
p span {
  color: #6c7a87;
}
.foot-nav a {
  font-size: 0.875rem;
}
.button {
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 1.25rem;
  background-color: rgba(11, 34, 56, 0.05);
  padding-top: 0.7rem;
}
.button:hover {
  background-color: #165df5;
  color: #ffffff;
}
/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .foot-nav a {
    font-size: 1rem;
  }
}
</style>
