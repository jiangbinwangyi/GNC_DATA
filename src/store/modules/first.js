// import Cookies from 'js-cookie'

const state = {
  Websocket: null,
  menu: [{
    src: '/basic',
    name: '实时监视'
  }, {
    src: '/3Dmodel',
    name: '故障诊断'
  }, {
    src: '/relation',
    name: '检测分析'
  }, {
    src: '/track',
    name: '实时预测'
  }, {
    src: '/setting',
    name: '故障系统'
  }],
  menuActive: '实时监视',
  metaList: [{
    metaColumnId: '288',
    metaColumnName: '陀螺X零偏'
  }, {
    metaColumnId: '289',
    metaColumnName: '陀螺Y零偏'
  }, {
    metaColumnId: '290',
    metaColumnName: '陀螺Z零偏'
  }, {
    metaColumnId: '291',
    metaColumnName: '帆板X轴'
  }, {
    metaColumnId: '292',
    metaColumnName: '动量轮X轴承温度'
  }, {
    metaColumnId: '294',
    metaColumnName: '动量轮Y轴承温度'
  }, {
    metaColumnId: '296',
    metaColumnName: '动量轮Z轴承温度'
  }],
  nowTime: '',
  sunTime: '',
  basicData: {
    healthy: {
      time: [500],
      data: [],
      data2: [],
      data4: [],
      data3: []
    },
    track: [[0, 200, 0, 200, 0]]
  },
  healthyValue: 92.5,
  life: {
    data: [],
    xAxis: [],
    seconds: []
  },
  tableData: [],
  barData: [],
  barMax: 100,
  barStatus: true,
  failStatus: false,
  gzData: null
}

const mutations = {
  setGzData(state, data) {
    state.gzData = data
  },
  setFailStatus(state, data) {
    state.failStatus = data
  },
  setBarData(state, data) {
    if (state.barMax % 23 === 0) {
      state.barStatus = state.barMax === 0
    }
    state.barMax = state.barStatus ? state.barMax + 1 : state.barMax - 1

    let begin = 168 - state.barMax
    if (state.barData.length === 168) {
      state.barData.splice(0, 168)
    }
    for (let i = 0; i < 24; i++) {
    // const i = state.barData.length % 24
    // const j = state.barData.length % 7
      for (let j = 0; j < 7; j++) {
        begin = parseInt(Math.random() * 40 + 10)
        const item = { value: [] }
        item.value.push(i)
        item.value.push(j)
        item.value.push(begin)
        state.barData.push(item)
      }
    }
  },
  setWebsocket(state, data) {
    state.Websocket = data
  },
  setMenuActive(state, data) {
    state.menuActive = data
  },
  setTime(state, data) {
    state.nowTime = data.nowTime
    state.sunTime = data.sunTime
  },
  setBasicData(state, second) {
    for (let i = 0; i < 25; i++) {
      const time = state.basicData.healthy.time
      // const healthyData = state.basicData.healthy.data
      state.basicData.healthy.time.push((time[time.length - 1]) + 100)

      const newHealthyData = parseInt((Math.random() * (205 - 160 + 1) + 170)) / 100
      // const anything = state.basicData.healthy.data[ARR.length - 1]
      // if ((time[time.length - 1] / 500) % 3 === 0) {
      //   state.basicData.healthy.data.push(anything - newHealthyData)
      // } else {
      //   state.basicData.healthy.data.push(anything + newHealthyData)
      // }
      state.basicData.healthy.data.push(newHealthyData)

      const newHealthyData2 = newHealthyData + parseFloat((Math.random() * 500 + 100).toFixed(2)) / 4000
      state.basicData.healthy.data2.push(newHealthyData2)

      const newHealthyData3 = newHealthyData - parseFloat((Math.random() * 500 + 100).toFixed(2)) / 4000
      state.basicData.healthy.data3.push(newHealthyData3)

      const newHealthyData4 = newHealthyData + parseFloat((Math.random() * 500 + 100).toFixed(2)) / 5000
      state.basicData.healthy.data4.push(newHealthyData4)

      if (time.length > 20) {
        state.basicData.healthy.data4.shift()
      }

      if (time.length > 20) {
        state.basicData.healthy.time.shift()
        state.basicData.healthy.data.shift()
        state.basicData.healthy.data2.shift()
        state.basicData.healthy.data3.shift()
      }
    }
    if (state.life.xAxis.length === 0) {
      for (let i = 0; i < 25; i++) {
        const now = new Date()
        const res = new Date(now.getTime() + i * 86400000)
        const month = res.getMonth() + 1
        const day = res.getDate()
        state.life.seconds.push(res.getTime())
        state.life.xAxis.push(month + '-' + day)
        const lastNum = state.life.data[state.life.data.length - 1] || 1688.88
        state.life.data.push(parseFloat((lastNum - (Math.random() * 2 + 1)).toFixed(2)))
      }
    } else {
      const now = new Date(state.life.seconds[24] + 86400000)
      state.life.seconds.push(now.getTime())
      const month = now.getMonth() + 1
      const day = now.getDate()
      state.life.xAxis.push(month + '-' + day)
      state.life.data.push(parseFloat(((state.life.data[24] - (Math.random() * 1.2)).toFixed(2))))
      state.life.xAxis.shift()
      state.life.seconds.shift()
      state.life.data.shift()
    }
    state.healthyValue = parseInt((Math.random() * 2 + 95))

    const basicTable = [{
      name: 'BD2G02',
      info: '+y帆板工作方式跳变为“复位保持”。'
    }, {
      name: 'BD2G03',
      info: '增强天线架构反射器展开驱动装置#温度高于上限'
    }, {
      name: 'BD2G04',
      info: 'SADA数据-X-SADM转动方向为正转'
    }, {
      name: 'BD2G05',
      info: 'SADA数据+Y-SADM转动方向为正转'
    }, {
      name: 'BD2G02',
      info: '+x帆板工作方式跳变为“复位保持”。'
    }, {
      name: 'BD2G06',
      info: 'SADM转动方向为反转'
    }, {
      name: 'BD2G07',
      info: '监视相机A电源（VMA9）关机！'
    }]
    const now = new Date()
    if (state.tableData.length === 0) {
      for (let i = 0; i < 7; i++) {
        basicTable[i].time = `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
        state.tableData.push(basicTable[i])
      }
    } else {
      let resData = JSON.parse(JSON.stringify(basicTable[parseInt(Math.random() * 7)]))
      if ((second + 6) % 8 === 0 && !state.failStatus) {
        resData = {
          name: 'BD2G01',
          info: '状态 +y帆板工作信号<0“状态异常”。'
        }
      }
      resData.time = `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
      state.tableData.unshift(resData)
      state.tableData.splice(state.tableData.length, 1)
      basicTable.unshift(resData)
      basicTable.splice(basicTable.length, 1)
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
  // createWebsocket({ commit, state }, data) {
  //   const ws = new WebSocket('ws://192.168.0.147:3002')
  //   commit('setWebsocket', ws)
  // },
  // fetchMenuActive({ commit, state }, data) {
  //   state.Websocket.send(data)
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
