import request from '@/utils/request'
import apis from '@/api/apis'

const rp = {
  state: {
    redPacketList: [],
    redPacketItemList: [],
    probabilityList: [],
    projectList: [],
    loading1: false,
    loading2: false,
    loading3: false
  },
  mutations: {
    SET_RP_LIST(state, list) {
      state.redPacketList = list
    },
    SET_ITEM_LIST(state, list) {
      state.redPacketItemList = list
    },
    SET_P_List(state, list) {
      state.probabilityList = list
    },
    SET_LOADING1(state, v) {
      state.loading1 = v
    },
    SET_LOADING2(state, v) {
      state.loading2 = v
    },
    SET_LOADING3(state, v) {
      state.loading3 = v
    },
    SET_PROJECT_LIST(state, list) {
      state.projectList = list
    }
  },
  actions: {
    getRedPacket({ commit }) {
      commit('SET_LOADING1', true)
      return request({
        url: apis.redpacket,
        noLoading: true,
        method: 'get'
      }).then(res => {
        commit('SET_LOADING1', false)
        commit('SET_RP_LIST', res.data || [])
      })
    },
    getRedPacketItem({ commit }, id) {
      commit('SET_LOADING2', true)
      return request({
        url: apis.redpacketItem,
        noLoading: true,
        method: 'get',
        params: { id }
      }).then(res => {
        commit('SET_LOADING2', false)
        commit('SET_ITEM_LIST', res.data || [])
      })
    },
    getProbabilityList({ commit }, id) {
      commit('SET_LOADING3', true)
      return request({
        url: apis.redpacketProbability,
        noLoading: true,
        method: 'get',
        params: { id }
      }).then(res => {
        commit('SET_LOADING3', false)
        commit('SET_P_List', res.data || [])
      })
    },
    updateRp({ state, commit }, { requestData, id }) {
      return request({
        url: `${apis.redpacket}/${id}`,
        method: 'put',
        data: requestData
      }).then(res => {
        const result = []
        for (const item of state.redPacketList) {
          if (item.RedpacketId === id) {
            result.push(requestData)
          } else {
            result.push(item)
          }
        }
        commit('SET_RP_LIST', result)
      })
    },
    createRp({ state, commit }, requestData) {
      return request({
        url: apis.redpacket,
        method: 'post',
        data: requestData
      }).then(res => {
        const result = [...state.redPacketList, res.data]
        commit('SET_RP_LIST', result)
      })
    },
    // 增加item
    createItem({ state, commit }, requestData) {
      return request({
        url: apis.redpacketItem,
        noLoading: true,
        method: 'post',
        data: requestData
      }).then(res => {
        const result = [...state.redPacketItemList, res.data]
        commit('SET_ITEM_LIST', result)
      })
    },
    // 删除item
    deleteItem({ state, commit }, id) {
      return request({
        url: `${apis.redpacketItem}/${id}`,
        method: 'delete'
      }).then(res => {
        const result = []
        for (const item of state.redPacketItemList) {
          if (item.RedpacketItemId !== id) {
            result.push(item)
          }
        }
        commit('SET_ITEM_LIST', result)
      })
    },
    // 修改item
    updateItem({ state, commit }, { requestData, id }) {
      return request({
        url: `${apis.redpacketItem}/${id}`,
        method: 'put',
        data: requestData
      }).then(res => {
        const result = []
        for (const item of state.redPacketItemList) {
          if (item.RedpacketItemId === id) {
            result.push(requestData)
          } else {
            result.push(item)
          }
        }
        commit('SET_ITEM_LIST', result)
      })
    },
    // 增加Probability
    createProbability({ state, commit }, requestData) {
      return request({
        url: apis.redpacketProbability,
        method: 'post',
        data: requestData
      }).then(res => {
        const result = [...state.probabilityList, res.data]
        commit('SET_P_List', result)
      })
    },
    // 删除Probability
    deleteProbability({ state, commit }, id) {
      return request({
        url: `${apis.redpacketProbability}/${id}`,
        method: 'delete'
      }).then(res => {
        const result = []
        for (const item of state.probabilityList) {
          if (item.Id !== id) {
            result.push(item)
          }
        }
        commit('SET_P_List', result)
      })
    },
    // 修改Probability
    updateProbability({ state, commit }, { requestData, id }) {
      return request({
        url: `${apis.redpacketProbability}/${id}`,
        method: 'put',
        data: requestData
      }).then(res => {
        const result = []
        for (const item of state.probabilityList) {
          if (item.Id === id) {
            result.push(requestData)
          } else {
            result.push(item)
          }
        }
        commit('SET_P_List', result)
      })
    },
    getProjectList({ commit }) {
      request({
        url: apis.project,
        noLoading: true,
        method: 'get'
      }).then(res => {
        commit('SET_PROJECT_LIST', res.data.rows || [])
      })
    }
  }
}

export default rp
