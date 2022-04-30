export default {
  // 开启命名空间
  namespaced: true,

  // state 数据
  state: () => ({
    // 收货地址
    // 读取本地的收货地址数据，初始化 address 对象
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    token: uni.getStorageSync('token') || '',
    // 用户的信息对象
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 重定向的 objeck 对象
    redirectInfo: null
  }),

  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      // 将 address 对象持久化存储到本地
      this.commit('m_user/saveAddressToStorage')
    },
    
    // 定义将 address 持久化存储到本地 mutations 方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    
    // 更新用户的基本信息
    updateUserInfo(state, userinfo) {
      state.userinfo = userinfo
      this.commit('m_user/saveUserInfoToStorage')
    },
    
     // 将 userinfo 持久化存储到本地
     saveUserInfoToStorage (state) {
       uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
     },
     
     // 更新 token 字符串
    updateToken (state, token) {
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    
    // 将 token 字符串持久化存储到本地
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token)
    },
    
    // 更新重定向的信息对象
    updateRedirectInfo (state, info) {
      state.redirectInfo = info
    }
  },

  // 数据包装器
  getters: {
    addstr (state) {
      if(!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  },
}