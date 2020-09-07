import Cookies from 'js-cookie'

const state = {
  odiSourceTypeText: [
    { text: 'Oracle', value: 'oracle_servicename' },
    { text: 'SQL Server 2005', value: 'sqlserver_2005' },
    { text: 'MySQL', value: 'mysql' }
  ],
  taskStatus: [
    { value: 1, text: '任务已创建' },
    { value: 2, text: '任务已生成数据映射' },
    { value: 3, text: '任务已生成' },
    { value: 4, text: '任务生成失败' },
    { value: 5, text: '任务已保存' },
    { value: 6, text: '任务已提交到队列' },
    { value: 7, text: '任务已执行' },
    { value: 8, text: '任务执行成功' },
    { value: 9, text: '任务执行失败' }
  ],
  wholeImportState: false,
  wholeImportBackState: false,
  wholeImportPercentage: 0
}

const mutations = {
  wholeImportSetState(state, data) {
    state.wholeImportState = data
  },
  wholeImportSetPercentage(state, data) {
    state.wholeImportPercentage = data
  },
  wholeImportBack(state, data) {
    state.wholeImportState = false
    state.wholeImportBackState = data.isBack
    Cookies.set('UPLOAD_PERCNETAGE', data.percentage)
  }
}

const actions = {
  wholeImportLoading({ commit, state, rootState }, taskId = 0) {
    commit('wholeImportSetState', true)

    let start = Cookies.get('UPLOAD_PERCNETAGE') || state.wholeImportPercentage
    let time = 1888
    let timeOut = null
    const setTime = () => {
      timeOut = setTimeout(() => {
        if (start < 88.88) {
          time = Math.floor(Math.random() * 8888 + time)
          start = Number((start / (-18) + 4.68 + start).toFixed(2))
          commit('wholeImportSetPercentage', start)
          clearTimeout(timeOut)
          setTime(time)
        } else {
          clearTimeout(timeOut)
        }
      }, time)
    }
    setTime(time)

    // 先建立ws连接握手，
    const ws = rootState.user.WebSocket
    ws.onmessage = (evt) => {
      const received_msg = evt.data
      if (received_msg.indexOf('生成成功') > 0) {
        commit('wholeImportSetPercentage', 100)
        commit('wholeImportBack', { percentage: 0, isBack: false })
        Cookies.remove('UPLOAD_PERCNETAGE')
        commit('wholeImportSetPercentage', 0)
        clearTimeout(timeOut)
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

