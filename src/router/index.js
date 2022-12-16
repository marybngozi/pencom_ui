import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import PassThrough from "../components/PassThrough.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "auth-login" },
    meta: {
      guest: true,
    },
  },
  {
    path: "/auth/login",
    name: "auth-login",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/SignIn.vue"),
  },
  {
    path: "/auth/company-signup",
    name: "auth-company-signup",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/CompanySignUp.vue"),
  },
  {
    path: "/auth/staff-signup",
    name: "auth-staff-signUp",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/StaffSignUp.vue"),
  },
  {
    path: "/auth/verify/:token",
    name: "auth-verify-token",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/Verify.vue"),
  },
  {
    path: "/auth/forgot-password",
    name: "/auth-forgot-password",
    meta: {
      guest: true,
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/ForgotPassword.vue"),
  },
  {
    path: "/auth/reset-password/:token",
    name: "auth-reset-password",
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
        name: "dashboard",
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

      /* Schedule & children start */
      {
        path: "/schedule/",
        component: PassThrough,
        redirect: { name: "schedule-upload" },
        children: [
          {
            path: "upload",
            name: "schedule-upload",
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
            path: "upload-status",
            name: "schedule-upload-status",
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
            path: "view-processed",
            name: "schedule-view-processed",
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/schedule/ViewProcessed.vue"
              ),
            meta: {
              requiresAuth: true,
              free: false,
            },
          },
        ],
      },
      /* Schedule & children end */

      /* Account & children start */
      {
        path: "/account/",
        component: PassThrough,
        redirect: { name: "list-staff" },
        children: [
          {
            path: "list-staff",
            name: "list-staff",
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
            path: "create-staff",
            create: "create-staff",
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
          {
            path: "/list-transaction",
            component: () =>
              import(
                /* webpackChunkName: "account" */ "../views/staff/ListTransaction.vue"
              ),
            meta: {
              requiresAuth: true,
              free: false,
            },
          },
        ],
      },
      /* Account & children start */

      {
        path: "/schedule/mandate/:invoiceNo",
        name: "schedule-mandate",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/schedule/Mandate.vue"
          ),
        meta: {
          guest: true,
        },
      },
      {
        path: "/schedule/make-payment/:invoiceNo",
        name: "schedule-make-payment",
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
        path: "/view-contribution",
        component: () =>
          import(
            /* webpackChunkName: "account" */ "../views/pfa/ListContribution.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
        },
      },
      {
        path: "/create-subadmin",
        component: () =>
          import(
            /* webpackChunkName: "account" */ "../views/pfa/CreateSubadmin.vue"
          ),
        meta: {
          requiresAuth: true,
          free: false,
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
      query: { nextUrl: to.fullPath },
    });
    return;
  }

  // allow free routes
  if (to.meta.free) {
    next();
    return;
  }

  // check if the path is assigned to the user menu
  const userMenus = store.getters.userMenus;
  let menuExists = false;

  // check the submenus
  for (let j = 0; j < userMenus.subMenus.length; j++) {
    const submenu = userMenus.subMenus[j];
    if (to.path.includes(submenu.path)) {
      menuExists = true;
      break;
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
