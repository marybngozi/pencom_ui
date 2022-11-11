<template>
  <div class="home">
    <section>
      <DashHead id="header" :scrolled="true" />

      <SideNav />
    </section>

    <main>
      <div id="main">
        <router-view />
      </div>
    </main>
  </div>
</template>
<script>
import DashHead from "@/components/dashboard/DashHead.vue";
import SideNav from "@/components/dashboard/SideNav.vue";
export default {
  name: "AppFrame",

  components: {
    DashHead,
    SideNav,
  },

  mounted() {
    const menuBtn = document.querySelector("#menuBtn");
    const sideNav = document.querySelector("#sideNav");
    // const mainSide = document.querySelector("#main");
    let sideNavStatus = false;

    menuBtn.addEventListener("click", () => {
      if (!sideNavStatus) {
        sideNav.style.width = "384px";
        // let w = screen.width - 384;
        // mainSide.style.width = `${w}px`;
        sideNavStatus = !sideNavStatus;
      } else {
        sideNav.style.width = "0";
        // mainSide.style.width = screen.width;
        sideNavStatus = !sideNavStatus;
      }
    });
  },
};
</script>
<style scoped>
section {
  overflow: hidden;
  max-height: 100vh;
}
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
  background: #f5f6f8;
}
main > div {
  width: 100%;
  min-height: calc(100vh - 71px);
  padding: 16px 0.9rem;
}
/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  main {
    display: flex;
    justify-content: flex-end;
  }
  main > div {
    width: calc(100% - 300px);
  }
}
</style>
