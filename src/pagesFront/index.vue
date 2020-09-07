<template>
  <div class="myselfData">
    <header>
      <div class="showTime" v-text="nowTime" />
      <h1>GNC系统实时状态可视化监控 -
        <el-dropdown @command="setMenuActive">
          <span class="el-dropdown-link">
            <a href="javascript:void(0);" style="font-size: 28px; color:#fff">{{ menuActive }}</a>
            <i class="el-icon-arrow-down el-icon--right" style="font-size: 16px;color:#fff;padding-left:10px" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in menu" :key="item.src" :command="item.name">
              <router-link :to="item.src">{{ item.name }}</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </h1>
    </header>
    <!-- 页面主体 -->
    <section class="mainbox">
      <div class="mapBg">
        <div class="map1" />
        <div class="map2" />
        <div class="map3" />
      </div>
      <router-view />
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      nowTime: ''
    }
  },
  computed: {
    ...mapState('first', ['Websocket', 'menu', 'menuActive'])
  },
  watch: {
    'Websocket': {
      handler(newVal, old) {
        if (newVal) {
          newVal.onmessage = e => {
            this.$router.push(e.data)
          }
        }
      },
      deep: true,
      immediate: true
    },
    '$route': {
      handler(newVal, old) {
        this.setMenuActive(newVal.meta.name)
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.createWebsocket()
    this.getNowTime()
    document.querySelector('html').style.fontSize = (document.documentElement.clientWidth > 1024 ? 1024 : document.documentElement.clientWidth) / 16 + 'px'
  },
  methods: {
    getNowTime() {
      let t = null
      const time = () => {
        clearTimeout(t)
        const dt = new Date()
        const y = dt.getFullYear()
        const mt = dt.getMonth() + 1
        const day = dt.getDate()
        const h = dt.getHours()
        const m = dt.getMinutes()
        const s = dt.getSeconds()
        this.nowTime = '当前时间：' + y + '年' + mt + '月' + day + '-' + h + '时' + m + '分' + s + '秒'

        this.setBasicData()
        t = setTimeout(time, 1000)
      }
      t = setTimeout(time, 1000)
    },
    ...mapMutations('first', ['setMenuActive', 'setBasicData']),
    ...mapActions('first', ['createWebsocket'])
  }
}
</script>

<style lang="scss" scoped>
@import 'style/index.scss';
</style>
