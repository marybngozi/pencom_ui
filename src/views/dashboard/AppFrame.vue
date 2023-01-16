<template>
  <div class="home">
    <DashHead id="header" :scrolled="true" />

    <b-overlay
      :z-index="1000"
      :show="showMainOverlay"
      rounded="sm"
      variant="dark"
      :opacity="0.6"
    >
      <template #overlay>
        <span></span>
      </template>

      <SideNav />

      <main>
        <div id="main">
          <router-view />
        </div>
      </main>

      <Transition name="slide" appear>
        <PendingAction v-if="!action && showMainOverlay" @show="perform" />
        <CompanyValidation
          v-if="action == 'companyValidate'"
          @hideAll="perform"
        />
      </Transition>
    </b-overlay>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import DashHead from "@/components/DashHead.vue";
import SideNav from "@/components/SideNav.vue";
import PendingAction from "@/components/pages/PendingAction.vue";
import CompanyValidation from "@/components/pages/CompanyValidation.vue";
export default {
  name: "AppFrame",

  components: {
    DashHead,
    SideNav,
    PendingAction,
    CompanyValidation,
  },

  async beforeCreate() {
    this.$store.dispatch("getItems");
    this.$store.dispatch("getMenus");
  },

  watch: {
    isMenuOpen(newValue) {
      const sideNav = document.querySelector("#sideNav");
      if (newValue) {
        sideNav.style.width = "284px";
      } else {
        sideNav.style.width = "0";
      }
    },
  },

  // mounted() {
  //   const menuBtn = document.querySelector("#menuBtn");
  //   const sideNav = document.querySelector("#sideNav");
  //   // const mainSide = document.querySelector("#main");
  //   let sideNavStatus = false;

  //   menuBtn.addEventListener("click", () => {
  //     if (!sideNavStatus) {
  //       sideNav.style.width = "284px";
  //       // let w = screen.width - 284;
  //       // mainSide.style.width = `${w}px`;
  //       sideNavStatus = !sideNavStatus;
  //     } else {
  //       sideNav.style.width = "0";
  //       // mainSide.style.width = screen.width;
  //       sideNavStatus = !sideNavStatus;
  //     }
  //   });
  // },

  computed: {
    ...mapState(["showMainOverlay", "isMenuOpen"]),
  },

  data() {
    return {
      action: null,
    };
  },

  methods: {
    ...mapMutations(["toggleMainOverlay"]),

    perform(action) {
      this.action = action;
    },
  },
};
</script>
<style scoped>
.home::before {
  content: "";
  background-image: url("../../assets/images/bg-cubic.svg");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.03;
}
main {
  /* background: #f5f6f8; */
  background: #fff;
}
main > div {
  width: 100%;
  min-height: calc(100vh - 71px);
  /* padding: 16px 0.9rem; */
}

.slide-enter-active {
  transform: translateX(404px);
  transition: all 0.5s ease-in-out;
}

.slide-leave-active {
  transition: all 0.8s ease-in-out;
}

.slide-enter-to {
  transform: translateX(0px);
  /* opacity: 0.4; */
}
.slide-enter-from {
  transform: translateX(400px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(400px);
  opacity: 0;
}
/* Large devices (desktops, 1025px and up) */
@media (min-width: 1025px) {
  main {
    display: flex;
    justify-content: flex-end;
  }
  main > div {
    width: calc(100% - 243px);
  }
}
</style>
