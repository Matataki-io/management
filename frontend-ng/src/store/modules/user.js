import { getToken, setToken, removeToken } from '@/utils/auth'
import request from '@/utils/request'
import apis from '@/api/apis'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, { signature, message }) {
      return request({
        url: apis.loginBySignature,
        method: 'post',
        data: {
          signature,
          data: message
        }
      }).then(response => {
        const data = response.data
        const token = `${data.token_type} ${data.access_token}`
        setToken(token, { expires: new Date(Number(data.expires_in + '000')) })
        commit('SET_TOKEN', token)
      })
    },

    // 登出
    LogOut({ commit, state }) {
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
