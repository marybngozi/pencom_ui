<template>
  <header :style="headStyle" class="py-3 pe-4 d-flex justify-content-between">
    <div class="col-8 col-lg-3 pt-0 pt-lg-2">
      <router-link @click="goPage('top')" to="/">
        <img
          :src="require(`@/assets/images/${logo_pic}.svg`)"
          id="logo"
          alt="logo"
        />
      </router-link>
    </div>

    <nav class="col-3 col-lg-8 d-flex justify-content-end">
      <button @click="showNavList" class="btn button d-block d-lg-none">
        <Hamburger :clicked="hamClicked" :hamBlue="scrolled" />
      </button>

      <div id="navDiv" class="d-none d-lg-block">
        <ul class="d-inline-block d-lg-inline-flex">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/about">About</router-link>
          </li>
          <li>
            <router-link to="/contactus">Contact</router-link>
          </li>
          <li class="dropdown">
            <a
              class="dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Products
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link @click="goPage('oProducts')" to="/?sec=biopay">
                  BIOPAY
                </router-link>
              </li>
              <li>
                <router-link @click="goPage('oProducts')" to="/?sec=payhandle">
                  PAYHANDLE
                </router-link>
              </li>
            </ul>
          </li>
          <li>
            <router-link @click="goPage('developer')" to="/?sec=developer">
              Developer
            </router-link>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li class="mt-4 mt-lg-0 ps-4 ml-7">
            <router-link v-if="showSignUp" to="/signup" class="btn btn-dance">
              <span>Sign Up</span>
            </router-link>

            <router-link v-else to="/signin" class="btn btn-dance">
              <span>Sign In</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import Hamburger from "./Hamburger.vue";
export default {
  name: "Header",

  data() {
    return {
      hamClicked: false,
      navOpen: false,
      showSignUp: false,
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

  mounted() {
    if (this.scrolled) {
      document.querySelectorAll("#navDiv ul li a").forEach((el) => {
        el.classList.add("text-bdark");
      });
    }

    if (this.$route.path == "/signin") {
      this.showSignUp = true;
    }
  },

  computed: {
    headStyle() {
      if (this.navOpen || this.scrolled) {
        document.querySelectorAll("#navDiv ul li a").forEach((el) => {
          el.classList.add("text-bdark");
        });

        return "background: #ffffff; box-shadow: 0px -2px 4px 2px grey;";
      } else {
        document.querySelectorAll("#navDiv ul li a").forEach((el) => {
          el.classList.remove("text-bdark");
        });
        return "background: transparent; box-shadow:none";
      }
    },
    logo_pic() {
      return this.navOpen || this.scrolled ? "logo_black" : "logo_white";
    },
  },

  methods: {
    goPage(sec) {
      const pageRoute = this.$route.path;

      if (pageRoute == "/") {
        this.$emit("inClick", sec);
        this.closeNavList();
      }
    },

    showNavList() {
      document.querySelector("#navDiv").classList.toggle("d-none");
      this.hamClicked = !this.hamClicked;
      this.navOpen = !this.navOpen;
    },

    closeNavList() {
      document.querySelector("#navDiv").classList.add("d-none");
      this.hamClicked = false;
      this.navOpen = false;
    },
  },
};
</script>

<style scoped>
header {
  padding-left: 1.8rem;
  background: transparent;
  height: 4.375rem;
  z-index: 3400;
}
button:hover {
  box-shadow: none;
  outline: none;
}
.button {
  margin-top: -0.34rem;
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
  width: 120px !important;
  height: 45px;
}
.btn-dance:hover {
  color: #ffffff !important;
  background: #ed342b !important;
}
/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .btn-dance {
    width: auto;
  }
  header {
    padding-left: 7rem;
    height: 5.063rem;
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
