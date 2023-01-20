<template>
  <nav id="sideNav" class="d-flex justify-content-between">
    <!-- leftNav -->
    <div id="leftNav">
      <!-- user picture -->
      <div class="d-flex justify-content-center">
        <img
          class="rounded"
          width="40"
          height="40"
          :src="userLogo"
          alt="user image"
        />
      </div>

      <!-- menu icons -->
      <ul class="">
        <!-- dashboard main menu icon -->
        <li class="" @click="getPos">
          <router-link
            class="nav-icon-li"
            :class="pagePath.includes('app') ? 'active' : ''"
            @click.native="setSlug('app')"
            to="/app"
            id="app"
          >
            <div class="icon-div">
              <img src="@/assets/images/dashboard.svg" alt="dashboard icon" />
            </div>
            <span class="icon-text">Dashboard</span>
          </router-link>
        </li>

        <!-- Populate the rest of the menu from DB -->
        <!-- main menu icon -->
        <li
          @click="getPos"
          class=""
          v-for="(menu, i) in userMenus.mainMenus"
          :key="i"
        >
          <router-link
            class="nav-icon-li"
            :class="pagePath.includes(menu.slug) ? 'active' : ''"
            @click.native="setSlug(menu.slug)"
            :to="'/' + menu.slug"
            :id="menu.slug"
          >
            <div class="icon-div">
              <img
                :src="require('@/assets/images/' + menu.slug + '.svg')"
                :alt="`${menu.slug} icon`"
              />
            </div>
            <span class="icon-text">{{ menu.name }}</span>
          </router-link>
        </li>
      </ul>
      <!-- menu icons /-->
    </div>

    <!-- rightNav -->
    <div id="rightNav">
      <div class="ml-3">
        <h6
          :title="username"
          class="text-white m-0 mt-1 d-inline-block text-truncate"
        >
          {{ username }}
        </h6>
        <p class="small text-truncate pr-2" :title="userEmail">
          {{ userEmail }}
        </p>
      </div>

      <!-- sub-menu links -->
      <ul class="">
        <!-- sub menu dashboard -->
        <div
          class="sub-menu-div"
          v-if="pagePath.includes('app')"
          :style="`position: relative; top:${subMenuOffset}px`"
        >
          <li class="">
            <router-link
              class="nav-link-item"
              :class="pagePath == '/app' ? 'active' : ''"
              to="/app"
              @click.native="closeMenu()"
            >
              Dashboard
            </router-link>
          </li>
        </div>

        <!-- Populate the rest of the menu from DB -->
        <!-- sub menus -->
        <div
          class="sub-menu-div"
          :style="`position: relative; top:${subMenuOffset}px`"
        >
          <li class="" v-for="(menu, i) in subMenuList" :key="i">
            <router-link
              class="nav-link-item"
              :class="pagePath == menu.path ? 'active' : ''"
              :to="menu.path"
              @click.native="closeMenu()"
            >
              {{ menu.name }}
            </router-link>
          </li>
        </div>
      </ul>
      <!-- sub-menu links /-->

      <div class="w-100">
        <router-link
          class="nav-link-item"
          :class="pagePath == '/app/change-password' ? 'active' : ''"
          to="/app/change-password"
        >
          <i class="fa fa-cog mx-2"></i>
          <span class="fw-bold text-white">Change Password</span>
        </router-link>

        <button @click="logoutUser" class="d-flex nav-link-btn">
          <i class="fas fa-sign-out-alt text-white mt-1"></i>
          <p class="fw-bold text-white ml-2">Logout</p>
        </button>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "SideNav",

  computed: {
    ...mapGetters([
      "username",
      "userEmail",
      "userLogo",
      "userMenus",
      "isMenuOpen",
    ]),

    pagePath() {
      return this.$route.path;
    },

    subMenuList() {
      return this.userMenus.subMenus.filter((menu) =>
        menu.path.includes(this.pageSlug)
      );
    },
  },

  watch: {
    pagePath(val) {
      this.pageSlug = val.split("/")[1];
      document.querySelector("#" + this.pageSlug).parentElement.click();
    },
  },

  mounted() {
    const pageSlug = this.$route.path.split("/")[1];
    document.querySelector("#" + pageSlug).parentElement.click();
  },

  data() {
    return {
      subMenuOffset: 0,
      pageSlug: this.$route.path.split("/")[1],
    };
  },

  methods: {
    ...mapMutations(["toggleIsMenuOpen"]),
    ...mapActions(["logout"]),
    logoutUser() {
      setTimeout(() => {
        this.$router.push({ path: "/" });

        this.logout();
      }, 300);
    },
    setSlug(slug) {
      this.pageSlug = slug;
    },
    getPos(e) {
      const liPos = e.currentTarget.getBoundingClientRect().top;
      this.subMenuOffset = Math.round(liPos - 179);
    },
    closeMenu() {
      if (this.isMenuOpen) this.toggleIsMenuOpen();
    },
  },
};
</script>
<style scoped>
#sideNav {
  background: #17517e;
  height: calc(100vh - 65px);
  width: 0;
  position: absolute;
  left: 0px;
  overflow-x: hidden;
  transition: 0.5s;
  z-index: 900;
}
#sideNav h6 {
  width: 80%;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.3125rem;
}
#sideNav .small {
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 0.75rem;
  margin-top: 0.25rem;
  color: rgba(255, 255, 255, 0.5);
}
#sideNav #leftNav {
  width: 62px;
  background: #053a51;
  height: calc(100vh - 65px);
  padding-top: 2.25rem;
}
#sideNav #rightNav {
  width: calc(100% - 62px);
  background: #03435f;
  height: calc(100vh - 65px);
  padding-top: 2.25rem;
}
#leftNav ul,
#rightNav ul {
  margin-top: 1.8125rem;
  padding-left: 0;
}
.nav-icon-li {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 2px;
  height: 61px;
  margin: 16px auto;
}
.nav-icon-li .icon-text {
  font-weight: 400;
  font-size: 8px;
  line-height: 0.6875rem;
  color: #ffffff;
}
.nav-icon-li > .icon-div {
  width: 3rem;
  height: 3rem;
  background: transparent;
  display: flex;
  justify-content: center;
  align-content: center;
}
.nav-icon-li.active > .icon-div {
  background: #17517e;
  border: 2px solid #90b8d0;
  border-radius: 10px;
}
.nav-icon-li.active > .icon-text {
  font-weight: 700;
}
ul li {
  list-style: none;
}
a {
  display: block;
  text-decoration: none;
}
button:hover {
  outline: none;
  box-shadow: none;
}

#sideNav > #rightNav > div:last-child {
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 1.1875rem;
  position: absolute;
  bottom: 0.1875rem;
}
.nav-link-btn {
  width: 100%;
  width: 100%;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
}
a.nav-link-item {
  display: flex;
  align-items: center;
  padding: 16px 2px 16px 16px;
  background: transparent;
  transition: all;
  color: #ffffff;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  text-overflow: ellipsis;
  cursor: pointer;
}

/* .nav-link-btn:hover, */
a.nav-link-item:visited,
/* a.nav-link-item:hover, */
a.nav-link-item.active {
  outline: none;
  background: #17517e !important;
  font-weight: 700;
  transition: all 0.3s ease-in-out;
}
.relative {
  position: relative;
}
.sub-menu-div {
  transition: all 0.5s ease-in-out;
}
/*Large devices (desktops, 1025px and up)*/
@media (min-width: 1025px) {
  #sideNav {
    width: 243px;
  }
}
</style>
