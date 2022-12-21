import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });
import { fetchItems, fetchStates, fetchMenus } from "../services/sourceData";

Vue.use(Vuex);

const intialState = {
  user: null,
  items: null,
  allStates: null,
  newMenus: [],
  menus: {
    mainMenus: [],
    subMenus: [],
  },
  showMainOverlay: false,
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
    ...intialState,
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
    userType: (state) => {
      return state.user ? state.user.userType : null;
    },
    companyCode: (state) => {
      return state.user ? state.user.companyCode : null;
    },
    userEmail: (state) => {
      return state.user ? state.user.email : null;
    },
    userDateOfCreation: (state) => {
      return state.user ? state.user.createdAt : null;
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
      state.showMainOverlay = false;
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
        state[key] = intialState[key];
      });
    },
    toggleMainOverlay(state, value) {
      state.showMainOverlay = value;
    },
  },

  actions: {
    saveUserInfo({ commit }, { user, token }) {
      localStorage.setItem(process.env.VUE_APP_tokenName, token);

      console.log(user);

      if (user.userType == 100 && !user.companyCode) {
        commit("toggleMainOverlay", true);
      }

      commit("saveUser", user);
    },

    logout({ commit }) {
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
    async updateMenus({ commit }) {
      commit("saveMenus", await fetchMenus());
    },
  },
});
