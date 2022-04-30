<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#c00000" :checked="isFullCheck" /><text>全选</text>
    </label>

    <!-- 合计 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>

    <!-- 结算 -->
    <view class="btn-settle" @click="settlement">结算({{checkCount}})</view>
  </view>


</template>



<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时的秒数
        seconds: 1,
        timer: null
      };
    },
    computed: {
      ...mapState('m_cart', ['cart']),
      ...mapGetters('m_cart', ['checkCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),

      // 是否全选
      isFullCheck() {
        return this.checkCount === this.total
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),

      // label 的点击事件处理函数
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },

      // 点击了结算按钮
      settlement() {
        if (!this.checkCount) return uni.$showMsg('请选择要结算的商品！')
        if (!this.addstr) return uni.$showMsg('请选择收货地址！')

        // if(!this.token) return uni.$showMsg('请先登录！')
        // 最后判断用户是否登录了，如果没有登录，则调用 delayNavigate() 进行倒计时的导航跳转
        if (!this.token) return this.delayNavigate()

        // 微信支付
        this.payOrder()
      },

      // 微信支付
      async payOrder() {
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // order_price: this.checkedGoodsAmount,
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }

        // 1.2 发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create')

        if (res.meta.status === 400) {
          // 1.3 得到服务器响应的“订单编号”
          const orderRes = {
            "message": {
              "order_id": 45,
              "user_id": 12,
              "order_number": "GD20180504000000000045",
              "order_price": 0.1,
              "order_pay": "0",
              "is_send": "否",
              "trade_no": "",
              "order_fapiao_title": "个人",
              "order_fapiao_company": "",
              "order_fapiao_content": "",
              "consignee_addr": "广州市天河区",
              "pay_status": "0",
              "create_time": 1525408071,
              "update_time": 1525408071,
              "order_detail": "[{\"goods_id\":55578,\"goods_name\":\"初语2017秋装新款潮牌女装加绒宽松BF风慵懒卫衣女套头连帽上衣\",\"goods_price\":279,\"goods_small_logo\":\"http://image2.suning.cn/uimg/b2c/newcatentries/0070067836-000000000690453616_2_400x400.jpg\",\"counts\":1,\"selectStatus\":true}]",
              "goods": [{
                "id": 64,
                "order_id": 45,
                "goods_id": 5,
                "goods_price": 15,
                "goods_number": 11,
                "goods_total_price": 15
              }]
            },
            "meta": {
              "msg": "创建订单成功",
              "status": 200
            }
          }
          const orderNumber = 'GD20180504000000000045'

          // 2. 订单预支付

          // 2.1 发起请求获取订单的支付信息
          const {
            data: res2
          } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
            order_number: orderNumber
          })
          // 2.2 预付订单生成成功
          if (res.meta.status === 400) {
            const payInfo = {
              "message": {
                "pay": {
                  "timeStamp": "1525681145",
                  "nonceStr": "BkPggorBXZwPGXe3",
                  "package": "prepay_id=wx071619042918087bb4c1d3d72999385683",
                  "signType": "MD5",
                  "paySign": "D1642DEEF1663C8012EDEB9297E1D516"
                },
                "order_number": "GD20180507000000000110"
              },
              "meta": {
                "msg": "预付订单生成成功",
                "status": 200
              }
            }
            // 2.2 预付订单生成成功
            
           const [err, succ] = await uni.requestPayment(payInfo)
           
           
           // if(err) return uni.$showMsg('订单未支付')
           
          const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
          
            if(res3.meta.status === 400) {
              uni.showToast({
                title: '支付完成！',
                icon: 'success'
              })
              
            }else if(res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
            
          } else if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')

        } else if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')



      },

      // 延迟导航到 my 页面
      delayNavigate() {
        this.showTips(this.seconds)

        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            this.seconds = 1
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)

      },

      // 展示倒计时提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: `请登录后再结算！${n}秒后自动跳转到登录页面`,
          mask: true,
          duration: 1500
        })
      }

    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: #fff;
    z-index: 88;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #c00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      line-height: 50px;
      background-color: #c00000;
      padding: 0 10px;
      min-width: 100px;
      color: #fff;
      text-align: center;
    }
  }
</style>
