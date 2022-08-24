import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getter from './getter'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getter,
  mutations,
  actions,
})
