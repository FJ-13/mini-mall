import Vue from 'vue'
import Vuex from 'vuex'

import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

Vue.use(Vuex)

const state={
  cartList:[]
}
const store=new Vuex.Store({
  state,
  actions,
  mutations,
  getters
  // 修改state的状态
  // mutations中的方法尽可能完成的事件比较单一
})

export default store
