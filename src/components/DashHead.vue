<template>
  <header class="py-3 pr-3 d-flex justify-content-between">
    <div class="col-7 col-lg-3">
      <router-link to="/app">
        <img src="@/assets/images/logo_black.svg" id="logo" alt="logo" />
      </router-link>
    </div>

    <div class="col-5 col-lg-8 d-flex justify-content-end mr-0 mr-mlg-5">
      <button class="btn bell">
        <i class="far fa-bell"></i>
      </button>

      <button id="menuBtn" @click="showNavList" class="btn d-block d-mlg-none">
        <Hamburger :width="32" :height="30" :hamBlue="scrolled" />
      </button>
    </div>
  </header>
</template>

<script>
import { mapMutations } from "vuex";
import Hamburger from "./Hamburger.vue";
export default {
  name: "DashHead",

  data() {
    return {
      hamClicked: false,
    };
  },

  props: {
    scrolled: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    Hamburger,
  },

  methods: {
    ...mapMutations(["toggleIsMenuOpen"]),

    showNavList() {
      this.toggleIsMenuOpen();
      // this.hamClicked = !this.hamClicked;
    },
  },
};
</script>

<style scoped>
header {
  background: #ffffff;
  /* box-shadow: 0px -2px 0.25rem 2px grey; */
  /* box-shadow: 0px 0.25rem 10px rgba(0, 0, 0, 0.05); */
  border-bottom: 2px solid #03435f22;
  padding-left: 1.1rem;
  height: 4.375rem;
  z-index: 300;
}
button:hover {
  box-shadow: none;
  outline: none;
}
.bell {
  margin-top: -0.34rem;
  font-size: 1.45rem;
  outline: none;
}
a.btn:focus {
  outline: none;
  box-shadow: none;
}
ul {
  padding-inline-start: 0;
  width: 100%;
}
li {
  list-style: none;
}
li a {
  display: block;
  font-weight: 400;
  padding: 0.7rem 1.6rem;
  margin: 0.2rem 0;
  width: 100%;
  text-decoration: none;
  color: #0b2238 !important;
}
.text-bdark {
  color: #0b2238 !important;
}
li a:hover,
li a:focus {
  background: #f7f8fa;
}
#navDiv {
  width: 100%;
  position: absolute;
  left: 0;
  top: 4.375rem;
  background: #ffffff;
}
.dropdown-menu {
  border: 0 !important;
  border-radius: 0 !important;
  margin-left: 1rem !important;
}
.btn-dance {
  background: #ed342b;
  color: #ffffff !important;
  border-radius: 0.313rem;
  width: 240px !important;
  height: 2.8125rem;
}
.btn-dance:hover {
  color: #ffffff !important;
  background: #ed342b !important;
}
/* Large devices (desktops, 1025px and up) */
@media (min-width: 1025px) {
  .mr-mlg-5 {
    margin-right: 3rem !important;
  }
  .d-mlg-none {
    display: none !important;
  }
  .btn-dance {
    width: auto;
  }
  header {
    padding-left: 0.1rem;
    height: 4.4rem;
  }
  #navDiv {
    position: static;
    background: transparent;
  }
  li a {
    padding: 0.7rem 1.6rem;
    margin: 0.2rem 0;
    color: #ffffff !important;
  }
  li > ul > li a {
    color: #0b2238 !important;
  }
  li a:hover,
  li a:focus {
    background: transparent;
  }
  .ml-7 {
    margin-left: 20%;
  }
  .dropdown-menu {
    border-radius: 0.25rem !important;
  }
}
</style>
