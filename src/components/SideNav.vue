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
          src="@/assets/images/null_female.png"
          alt="user image"
        />
      </div>

      <!-- menu icons -->
      <ul class="">
        <!-- dashboard main menu icon -->
        <li class="">
          <router-link
            class="nav-icon-li"
            :class="pagePath.includes('app') ? 'active' : ''"
            @click.native="setSlug('app')"
            to="/app"
          >
            <div class="icon-div">
              <img src="@/assets/images/dashboard.svg" alt="dashboard icon" />
            </div>
            <span class="icon-text">Dashboard</span>
          </router-link>
        </li>

        <!-- Populate the rest of the menu from DB -->
        <!-- main menu icon -->
        <li class="" v-for="(menu, i) in userMenus.mainMenus" :key="i">
          <router-link
            class="nav-icon-li"
            :class="pagePath.includes(menu.slug) ? 'active' : ''"
            @click.native="setSlug(menu.slug)"
            :to="'/' + menu.slug"
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
        <p class="small">{{ userEmail }}</p>
      </div>

      <!-- sub-menu links -->
      <ul class="">
        <!-- sub menu dashboard -->
        <div v-if="pagePath.includes('app')">
          <li class="">
            <router-link
              class="nav-link-item"
              :class="pagePath == '/app' ? 'active' : ''"
              to="/app"
            >
              Dashboard
            </router-link>
          </li>

          <li class="">
            <router-link
              class="nav-link-item"
              :class="pagePath == '/app/change-password' ? 'active' : ''"
              to="/app/change-password"
            >
              Change Password
            </router-link>
          </li>
        </div>

        <!-- Populate the rest of the menu from DB -->
        <!-- sub menus -->
        <li class="" v-for="(menu, i) in subMenuList" :key="i">
          <router-link
            class="nav-link-item"
            :class="pagePath == menu.path ? 'active' : ''"
            :to="menu.path"
          >
            {{ menu.name }}
          </router-link>
        </li>
      </ul>
      <!-- sub-menu links /-->

      <div class="w-100">
        <button @click="logoutUser" class="d-flex nav-link-btn">
          <i class="fas fa-sign-out-alt text-white mt-1"></i>
          <p class="fw-bold text-white ml-2">Logout</p>
        </button>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SideNav",

  computed: {
    ...mapGetters(["username", "userEmail", "userMenus"]),

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
    },
  },

  data() {
    return {
      pageSlug: this.$route.path.split("/")[1],
    };
  },

  methods: {
    ...mapActions(["logout"]),
    logoutUser() {
      this.$router.push({ path: "/" });

      this.logout();
    },
    setSlug(slug) {
      this.pageSlug = slug;
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
  font-size: 16px;
  line-height: 21px;
}
#sideNav .small {
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.5);
}
#sideNav #leftNav {
  width: 62px;
  background: #053a51;
  height: calc(100vh - 65px);
  padding-top: 36px;
}
#sideNav #rightNav {
  width: calc(100% - 62px);
  background: #03435f;
  height: calc(100vh - 65px);
  padding-top: 36px;
}
#leftNav ul,
#rightNav ul {
  margin-top: 29px;
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
  line-height: 11px;
  color: #ffffff;
}
.nav-icon-li > .icon-div {
  width: 48px;
  height: 48px;
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
  line-height: 19px;
  position: absolute;
  bottom: 3px;
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
  font-size: 12px;
  line-height: 16px;
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
}
.relative {
  position: relative;
}
/*Large devices (desktops, 1025px and up)*/
@media (min-width: 1025px) {
  #sideNav {
    width: 243px;
  }
}
</style>
