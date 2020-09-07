import { fetchList as fetchSatelliteList } from '@/api/metaManage/satellite'
import { fetchList as fetchTestProjectList } from '@/api/metaManage/testProject'
import { fetchList as fetchDataClassificationList } from '@/api/metaManage/dataClassification'
import formatDcList from '@/utils/dataClassification'

const state = {
  metaFilter: {
    sateInfoId: '',
    tpiId: '',
    dcId: ''
  },
  satelliteList: [],
  testProjectList: [],
  dataclassificationList: []
}

const mutations = {
  setSatelliteList(state, data) {
    state.metaFilter.sateInfoId = ''
    state.satelliteList = data.map(e => {
      return {
        id: e.sateinfoId,
        name: e.sateinfoName
      }
    })
  },
  setTestProjectList(state, data) {
    state.metaFilter.sateInfoId = data.sateInfoId
    state.metaFilter.tpiId = ''
    state.metaFilter.dcId = ''
    state.testProjectList = data.list.map(e => {
      return {
        name: e.tpiName,
        id: e.tpiId
      }
    })
  },
  setDataclassificationList(state, data) {
    state.metaFilter.tpiId = data.tpiId
    state.metaFilter.dcId = ''
    state.dataclassificationList = formatDcList(data.list)
  },
  setMetaFilterDcId(state, data) {
    state.metaFilter.dcId = data
  }
}

const actions = {
  getSatelliteList({ commit }) {
    fetchSatelliteList().then(res => {
      commit('setSatelliteList', res.data)
    })
  },
  getTestProjectList({ commit }, sateInfoId) {
    fetchTestProjectList({ sateInfoId }).then(res => {
      commit('setTestProjectList', { list: res.data, sateInfoId })
    })
  },
  getDataclassificationList({ commit }, tpiId) {
    fetchDataClassificationList({ tpiId }).then(res => {
      commit('setDataclassificationList', { list: res.data, tpiId })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

