import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });
import { fetchItems, fetchStates, fetchMenus } from "../services/sourceData";

Vue.use(Vuex);

const getStoreUser = () => {
  const encryptUser = localStorage.getItem(process.env.VUE_APP_user);

  if (encryptUser) return JSON.parse(atob(encryptUser));

  return null;
};

export default new Vuex.Store({
  plugins: [
    // persists the data on page reload
    createPersistedState({
      key: process.env.VUE_APP_appDB,
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],

  state: {
    user: getStoreUser(),
    items: null,
    allStates: null,
    menus: null,
  },

  getters: {
    username: (state) => {
      if (state.user && state.user.companyName) {
        return `${state.user.companyName}`;
      } else if (state.user && state.user.firstName) {
        return `${state.user.firstName} ${state.user.lastName}`;
      } else {
        return "Company";
      }
    },
    companyCode: (state) => {
      return state.user ? state.user.companyCode : null;
    },
    userEmail: (state) => {
      return state.user ? state.user.email : null;
    },
    allStates: (state) => {
      return state.allStates;
    },
    allItems: (state) => {
      return state.items;
    },
    userMenus: (state) => {
      return state.menus;
    },
  },

  mutations: {
    setCompanyCode(state, companyCode) {
      state.user.companyCode = companyCode;
    },
    saveUser(state, user) {
      state.user = user;
    },
    clearUserDetails(state) {
      state.user = null;
    },
    saveItems(state, items) {
      state.items = items;
    },
    saveStates(state, states) {
      state.allStates = states;
    },
    saveMenus(state, menus) {
      state.menus = menus;
    },
    clearState(state) {
      Object.keys(state).forEach((key) => {
        state[key] = null;
      });
    },
  },

  actions: {
    saveUserInfo({ commit }, { user, token }) {
      const data = JSON.stringify(user);
      const encodedString = btoa(data);
      localStorage.setItem(process.env.VUE_APP_user, encodedString);
      localStorage.setItem(process.env.VUE_APP_tokenName, token);

      commit("saveUser", user);
    },

    refreshUser({ commit }) {
      const userdata = localStorage.getItem(process.env.VUE_APP_user);
      const retrived = JSON.parse(atob(userdata));

      commit("saveUser", retrived);
    },

    logout({ commit }) {
      localStorage.removeItem(process.env.VUE_APP_user);
      localStorage.removeItem(process.env.VUE_APP_tokenName);

      commit("clearState");
      localStorage.removeItem(process.env.VUE_APP_appDB);
    },
    async getItems({ commit, state }) {
      if (!state.items) {
        commit("saveItems", await fetchItems());
      }
    },
    async getStates({ commit, state }) {
      if (!state.allStates) {
        commit("saveStates", await fetchStates());
      }
    },
    async getMenus({ commit }) {
      commit("saveMenus", await fetchMenus());
    },
  },
});
