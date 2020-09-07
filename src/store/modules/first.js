// import Cookies from 'js-cookie'

const state = {
  Websocket: null,
  menu: [{
    src: '/basic',
    name: '基础概况'
  }, {
    src: '/relation',
    name: '知识图谱'
  }, {
    src: '/track',
    name: '行为轨迹'
  }, {
    src: '/3Dmodel',
    name: '卫星模型'
  }],
  menuActive: '基础概况',
  basicData: {
    healthy: {
      time: [500, 1000, 1500, 2000, 2500, 3000],
      data: [98.6, 97.2, 96.3, 97.9, 98.4]
    },
    track: []
  }
}

const mutations = {
  setWebsocket(state, data) {
    state.Websocket = data
  },
  setMenuActive(state, data) {
    console.log(data)
    state.menuActive = data
  },
  setBasicData(state, data) {
    const time = state.basicData.healthy.time
    // const healthyData = state.basicData.healthy.data
    state.basicData.healthy.time.push((time[time.length - 1]) + 500)
    const newHealthyData = Math.floor(Math.random() * (1005 - 970 + 1) + 970)
    state.basicData.healthy.data.push(parseInt(newHealthyData) / 10)
    if (time.length > 20) {
      state.basicData.healthy.time.shift()
      state.basicData.healthy.data.shift()
    }

    const count = (num) => {
      const curTime = (time[time.length - 1] - 3000) / 500 * 45 - 180
      return Math.sin(Math.PI * ((curTime + (num * 45)) / 90)) * 180
    }
    const track = state.basicData.track
    if (track.length === 0) {
      state.basicData.track.push([count(0)])
    } else if (track[track.length - 1].length === 6) {
      state.basicData.track.push(count(track.length))
    } else {
      track.forEach((item, index) => {
        if (item.length <= 8) {
          item.push(count(index))
        }
      })
    }
    console.log(track)
    state.basicData.track = track
  }
}

const actions = {
  createWebsocket({ commit, state }, data) {
    const ws = new WebSocket('ws://192.168.0.147:3002')
    commit('setWebsocket', ws)
  },
  fetchMenuActive({ commit, state }, data) {
    state.Websocket.send(data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
