import { asyncRoutes, constantRoutes } from '@/router'
import { getMenuListByUserId } from '@/api/user'
// import { format } from 'core-js/fn/date'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit, rootState }) {
    return new Promise(resolve => {
      getMenuListByUserId(rootState.user.userId).then(response => {
        // eslint-disable-next-line prefer-const
        let accessedRoutes = JSON.parse(response.data)
        const format = (n, o) => {
          o.forEach(oItem => {
            n.forEach(nItem => {
              if (oItem.path === nItem.path) {
                oItem.meta.title = nItem.name
                oItem.meta.icon = nItem.icon
                oItem.hidden = false
                if (oItem.children.length > 0) {
                  format(nItem.children, oItem.children)
                }
              }
            })
          })
        }
        format(accessedRoutes, asyncRoutes)
        // if (roles.includes('admin')) {
        // accessedRoutes = asyncRoutes.concat(templateRoutes) || []
        // console.log(accessedRoutes)
        // } else {
        //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        // }
        commit('SET_ROUTES', asyncRoutes)
        resolve(asyncRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
