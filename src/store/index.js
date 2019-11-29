import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sessions: {
      session1: '',
      session2: '',
      selected: 0
    },
    chatHistory: []
  },
  mutations: {
    initMessages: (state, messages) => {
      state.chatHistory = messages
    },
    addMessage: (state, message) => {
      state.chatHistory.push(message)
    }
  },
  actions: {
  },
  modules: {
  }
})
