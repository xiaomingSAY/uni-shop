<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
    
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="right" size="18"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="18" @click="cleanHistory"></uni-icons>
      </view>
      
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag inverted :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
    
    <!--  -->
    
    
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 防抖
        timer: null,
        // 搜索关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索关键词的历史记录
        historyList: ['a', 'app', 'apple']
      };
    },
    onLoad () {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      // input 输入事件的处理函数
      input(e) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.kw = e
          this.getSearchList()
        }, 500)
      },
      
      // 获取搜索建议列表
      async getSearchList () {
        // 判断搜索关键字是否为空
        if(this.kw.length === 0) {
          this.searchResults = []
          return
        }
        
        // 发起请求
        const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw }) 
        if(res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        
        this.saveSearchHistory()
      },
      
      // 点击搜索建议跳转详情页
      gotoDetail (item) {
        console.log(item.goods_id);
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      
      // 保存搜索历史
      saveSearchHistory () {
        // this.historyList.push(this.kw)
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        
        // 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      
      // 清空搜索历史记录
      cleanHistory () {
        this.historyList = []
        uni.setStorageSync('kw', '[]')
      },
      
      // 点击搜索记录跳转到商品列表页面
      gotoGoodsList (kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
      
      
      
      
    },
    computed: {
      histories () {
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
  // 建议列表样式
  .sugg-list {
    padding: 0 15px;
    
    .sugg-item{
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .goods-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  
  // 搜索历史
  .history-box {
    padding: 0 15px;
    
    .history-title {
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .history-list{
      display: flex;
      flex-wrap: wrap;
      
      uni-tag {
        margin-right: 5px;
        margin-top: 5px;
      }
    }
  }
  
  
</style>
