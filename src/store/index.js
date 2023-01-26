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
  isMenuOpen: false,
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
    pfaCode: (state) => {
      return state.user ? state.user.pfaCode : null;
    },
    rsaPin: (state) => {
      return state.user ? state.user.rsaPin : null;
    },
    userEmail: (state) => {
      return state.user ? state.user.email : null;
    },
    userLogo: (state) => {
      return state.user && state.user.logo
        ? process.env.VUE_APP_API_URL + "/public/logos/" + state.user.logo
        : process.env.VUE_APP_API_URL + "/public/logos/null_female.png";
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
    isMenuOpen: (state) => {
      return state.isMenuOpen;
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
    toggleIsMenuOpen(state) {
      state.isMenuOpen = !state.isMenuOpen;
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
      if (token) localStorage.setItem(process.env.VUE_APP_tokenName, token);

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
