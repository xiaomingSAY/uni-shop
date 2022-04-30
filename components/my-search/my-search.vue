<template>
  <view class="my-search-container" :style="{'background-color': bgcolor}" @click="searchBoxHandler">
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}">
      <!-- 使用 uni-ui 提供的图标组件 -->
      <uni-icons type="search" size="18"></uni-icons>
      
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    props: {
      // 背景色
      bgcolor: {
        type: String,
        default: '#C00000'
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18,
      }
    },
    data() {
      return {
        
      };
    },
    methods: {
      searchBoxHandler() {
        // 触发外界通过 @click 绑定的 click 事件处理函数
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
.my-search-container {
  height: 50px;
  // background-color: #c00000;
  display: flex;
  align-items: center;
  padding: 0 15px;
  
  .my-search-box {
    width: 100%;
    height: 36px;
    background-color: #fff;
    // border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>
