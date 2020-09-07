import { login, getInfo } from '@/api/user'
import Cookies from 'js-cookie'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userId: Cookies.get('USERINFO_ID'),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  WebSocket: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_WEBSOCKET(state, ws) {
    state.WebSocket = ws
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const user_Info = { name: userInfo.username.trim(), password: userInfo.password }
    return new Promise((resolve, reject) => {
      login(user_Info).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_USERID', data.userId)
        setToken(data.token)
        Cookies.set('USERINFO_ID', data.userId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.userId).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { userName } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_ROLES', ['admin'])
        commit('SET_NAME', userName)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      Cookies.remove('USERINFO_ID')
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  // 建立WS握手
  createWS({ commit }) {
    const operateId = Cookies.get('USERINFO_ID')
    const ws = new WebSocket('ws://172.16.1.80:8081/webSocket/' + operateId)
    ws.onopen = () => {
      ws.send(operateId)
      console.log('发送成功')
    }
    commit('SET_WEBSOCKET', ws)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
