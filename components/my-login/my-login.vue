<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),

      // 获取微信用户的基本信息
      getUserProfile() {
        console.log(1);
        uni.getUserProfile({
          desc: '你的授权信息',
          success: (res) => {
            console.log(res);
            // 将信息存到 vuex 中
            this.updateUserInfo(res.userInfo)
            this.getToken(res)
          },
          fail: (res) => {
            return uni.$showMsg('您取消了登录授权')
          }
        })
        // if (e.detail.errMsg !== "getUserInfo:ok") return uni.$showMsg('您取消了登录授权！')
        // this.updateUserInfo(e.detail.userInfo)
        // this.getToken(e.detail)
      },

      // 调用登录接口，换取永久的 token
      async getToken(info) {
        const [err, res] = await uni.login().catch(err => err)

        if (err || res.errMsg !== "login:ok") return uni.showError('登录失败！')

        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: JSON.stringify(info.rawData),
          signature: info.signature
        }

        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)

        if (loginResult.meta.status === 400) {
          const logRes = {
            "message": {
              "user_id": 12,
              "user_email_code": null,
              "is_active": null,
              "user_sex": "男",
              "user_qq": "",
              "user_tel": "",
              "user_xueli": "本科",
              "user_hobby": "",
              "user_introduce": null,
              "create_time": 1525402223,
              "update_time": 1525402223,
              "token":
                // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o"
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
            },
            "meta": {
              "msg": "登录成功",
              "status": 200
            }
          }

          uni.$showMsg('登录成功')

          this.updateToken(logRes.message.token)

          this.navigateBack()

        } else if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！+')

        //  uni.$showMsg('登录成功')

        // this.updateToken(loginResult.message.token)

      },

      // 返回登录之前的页面
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }


    }


  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      width: 90%;
      background-color: #c00000;
      margin: 15px 0;
      border-radius: 100px;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
