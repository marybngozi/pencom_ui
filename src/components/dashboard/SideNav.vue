<template>
  <nav id="sideNav">
    <div class="py-4">
      <div class="d-flex mt-4 ml-4">
        <img
          class="rounded-circle"
          width="36"
          height="36"
          src="@/assets/images/null_female.png"
          alt="user image"
        />
        <div class="ml-3">
          <h6
            :title="username"
            class="text-white m-0 mt-1 d-inline-block text-truncate"
          >
            {{ username }}
          </h6>
          <small class="">{{ userEmail }}</small>
        </div>
      </div>

      <div class="shadow-md" id="sidenavSecExample">
        <ul class="relative px-1">
          <li id="sidenavSecExD" class="relative">
            <router-link
              class="overflow-hidden fs-6 text-nowrap mt-5 nav-link-item text-white"
              to="/app"
            >
              <i class="fa fa-tachometer w-3 h-3`"></i>
              <span class="mx-3">Dashboard</span>
            </router-link>
          </li>

          <li
            v-for="(menu, i) in userMenus"
            class="relative"
            :key="i"
            :id="`sidenavSecEx${i}`"
          >
            <a
              class="nav-link-item overflow-hidden fs-6 text-nowrap"
              data-toggle="collapse"
              :data-target="`#collapseSidenavSecEx${i}`"
              aria-expanded="false"
              :aria-controls="`collapseSidenavSecEx${i}`"
            >
              <i :class="`${menu.icon} w-3 h-3 mr-3`"></i>
              <span class="mx-3">{{ menu.name }}</span>
              <i class="fa fa-chevron-down w-3 h-3 ml-auto"></i>
            </a>
            <ul
              class="relative accordion-collapse collapse"
              :id="`collapseSidenavSecEx${i}`"
              :aria-labelledby="`sidenavSecEx${i}`"
              data-parent="#sidenavSecExample"
            >
              <li
                v-for="(subMenu, k) in menu.subMenus"
                :key="k"
                class="relative"
              >
                <router-link
                  :to="subMenu.path"
                  class="d-flex fs-7 nav-link-item overflow-hidden text-nowrap"
                >
                  {{ subMenu.name }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="w-100">
        <hr class="my-2" />

        <router-link to="/change-password" class="d-flex nav-link-item">
          <span class="fw-bold text-white">Change Password</span>
        </router-link>

        <button @click="logoutUser" class="btn d-flex nav-link-btn">
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
  },

  data() {
    return {
      menus: [
        {
          name: "Schedule",
          icon: "fa fa-suitcase",
          subMenus: [
            {
              name: "Upload Schedule",
              path: "/upload-schedule",
            },
          ],
        },
      ],
    };
  },

  methods: {
    ...mapActions(["logout"]),
    logoutUser() {
      this.$router.push({ path: "/" });

      this.logout();
    },
  },
};
</script>
<style scoped>
#sideNav {
  background: #03435f;
  height: calc(100vh - 65px);
  width: 0;
  position: absolute;
  left: 0px;
  overflow-x: hidden;
  transition: 0.5s;
}
a {
  display: block;
  text-decoration: none;
}
button:hover {
  outline: none;
  box-shadow: none;
}
#sideNav h6 {
  width: 80%;
  line-height: 15px;
}
#sideNav small {
  color: #bfb8b8;
}
#sideNav > div > div:last-child {
  position: absolute;
  bottom: 0;
}
.nav-link-btn {
  width: 100%;
  width: 100%;
  padding: 1rem 2rem;
  background: transparent;
}
a.nav-link-item {
  padding: 1.2rem 2rem;
  background: transparent;
  transition: all;
  color: #ffffff;
  text-overflow: ellipsis;
  cursor: pointer;
}

.nav-link-btn:hover,
a.nav-link-item:visited,
a.nav-link-item:hover,
a.nav-link-item:active {
  background: #013b54 !important;
}
.relative {
  position: relative;
}
/*Large devices (desktops, 992px and up)*/
@media (min-width: 992px) {
  #sideNav {
    width: 300px;
  }
}
</style>
