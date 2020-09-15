// import Cookies from 'js-cookie'

const state = {
  Websocket: null,
  menu: [{
    src: '/basic',
    name: '基础数据'
  }, {
    src: '/track',
    name: '实时数据'
  }, {
    src: '/3Dmodel',
    name: '故障诊断'
  }, {
    src: '/relation',
    name: '历史数据'
  }],
  menuActive: '基础概况',
  nowTime: '',
  sunTime: '',
  basicData: {
    healthy: {
      time: [500],
      data: [100],
      data2: [98.6],
      data3: [99.6]
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
  setTime(state, data) {
    state.nowTime = data.nowTime
    state.sunTime = data.sunTime
  },
  setBasicData(state, data) {
    const time = state.basicData.healthy.time
    // const healthyData = state.basicData.healthy.data
    state.basicData.healthy.time.push((time[time.length - 1]) + 100)

    const newHealthyData = (Math.random() * (1005 - 980 + 1) + 970)
    // const anything = state.basicData.healthy.data[ARR.length - 1]
    // if ((time[time.length - 1] / 500) % 3 === 0) {
    //   state.basicData.healthy.data.push(anything - newHealthyData)
    // } else {
    //   state.basicData.healthy.data.push(anything + newHealthyData)
    // }
    state.basicData.healthy.data.push(parseInt(newHealthyData) / 10)

    const newHealthyData2 = Math.floor(Math.random() * (1005 - 960 + 1) + 970)
    state.basicData.healthy.data2.push(parseInt(newHealthyData2) / 10)

    const newHealthyData3 = Math.floor(Math.random() * (1005 - 950 + 1) + 970)
    state.basicData.healthy.data3.push(parseInt(newHealthyData3) / 10)

    if (time.length > 20) {
      state.basicData.healthy.time.shift()
      state.basicData.healthy.data.shift()
      state.basicData.healthy.data2.shift()
      state.basicData.healthy.data3.shift()
    }

    // const count = (num) => {
    //   const curTime = (time[time.length - 1] - 3000) / 500 * 45 - 180
    //   return Math.sin(Math.PI * ((curTime + (num * 45)) / 90)) * 180
    // }
    // const track = state.basicData.track
    // if (track.length === 0) {
    //   state.basicData.track.push([count(0)])
    // } else if (track[track.length - 1].length === 6) {
    //   state.basicData.track.push(count(track.length))
    // } else {
    //   track.forEach((item, index) => {
    //     if (item.length <= 8) {
    //       item.push(count(index))
    //     }
    //   })
    // }
    // console.log(track)
    // state.basicData.track = track
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
