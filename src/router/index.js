import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "SignIn",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/SignIn.vue"),
  },
  {
    path: "/company-signup",
    name: "SignUp",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/CompanySignUp.vue"),
  },
  {
    path: "/staff-signup",
    name: "StaffSignUp",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/StaffSignUp.vue"),
  },
  {
    path: "/verify/:token",
    name: "Verify",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/Verify.vue"),
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/ForgotPassword.vue"),
  },
  {
    path: "/reset-password/:token",
    name: "ResetPassword",
    props: (route) => ({
      email: route.query.email,
      token: route.params.token,
    }),
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/ResetPassword.vue"),
  },
  {
    path: "/app",
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ "../views/dashboard/AppFrame.vue"
      ),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/dashboard/Dashboard.vue"
          ),
        meta: {
          requiresAuth: true,
          free: true,
        },
      },
      {
        path: "/change-password",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/dashboard/ChangePassword.vue"
          ),
        meta: {
          requiresAuth: true,
          free: true,
        },
      },
      {
        path: "/list-schedule",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/schedule/List.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
        },
      },
      {
        path: "/upload-schedule",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/schedule/Upload.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
        },
      },
      {
        path: "/upload-status",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/schedule/UploadStatus.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
        },
      },
      {
        path: "/process-schedule",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/schedule/Process.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
        },
      },
      {
        path: "/view-processed",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/schedule/ListProcessed.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
        },
      },
      {
        path: "/schedule-mandate/:invoiceNo",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/schedule/Mandate.vue"
          ),
        meta: {
          guest: true,
        },
      },
      {
        path: "/make-payment/:invoiceNo",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/schedule/Payment.vue"
          ),
        meta: {
          requiresAuth: true,
          free: true,
        },
      },
      {
        path: "/validate-company",
        component: () =>
          import(
            /* webpackChunkName: "account" */ "../views/account/ValidateCompany.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
        },
      },
      {
        path: "/create-staff",
        component: () =>
          import(
            /* webpackChunkName: "account" */ "../views/account/CreateAdminStaff.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
        },
      },
      {
        path: "/list-staff",
        component: () =>
          import(
            /* webpackChunkName: "account" */ "../views/account/ListAdminStaff.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
        },
      },
      {
        path: "/assign-menu/:rsaPin",
        component: () =>
          import(
            /* webpackChunkName: "account" */ "../views/account/AssignMenu.vue"
          ),
        meta: {
          requiresAuth: true,
          free: true,
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/PageNotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.guest || !to.meta.requiresAuth) {
    next();
    return;
  }

  if (!localStorage.getItem(process.env.VUE_APP_tokenName)) {
    next({
      path: "/",
      params: { nextUrl: to.fullPath },
    });
    return;
  }

  // allow free routes
  if (to.meta.free) {
    next();
    return;
  }

  // check if the path is assigned to the admin's menu
  const userMenus = store.getters.userMenus;
  let menuExists = false;

  for (let i = 0; i < userMenus.length; i++) {
    const menu = userMenus[i];
    if (menuExists) {
      break;
    }

    // check the submenus
    for (let j = 0; j < menu.subMenus.length; j++) {
      const submenu = menu.subMenus[j];
      if (to.path.includes(submenu.path)) {
        menuExists = true;
        break;
      }
    }
  }

  if (menuExists) {
    next();
    return;
  }

  next({
    path: from.path,
  });
  return;
});

export default router;
