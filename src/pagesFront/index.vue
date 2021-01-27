<template>
  <div class="myselfData">
    <header>
      <div class="showTime" v-text="nowTime" />
      <h1>XX飞行器可视化监测分析系统 -
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
      <div class="showSunTime" v-text="sunTime" />
    </header>
    <!-- 页面主体 -->
    <section class="mainbox">
      <router-view />
    </section>
    <!-- 全局语音警报 -->
    <audio ref="errorVoice" src="@/assets/xinhao3.mp3" :autoplay="failStatus" loop="loop" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState('first', ['Websocket', 'menu', 'menuActive', 'nowTime', 'sunTime', 'failStatus'])
  },
  watch: {
    failStatus: {
      handler(newVal, old) {
        if (newVal) {
          this.$refs['errorVoice'].play()
        } else {
          this.$refs['errorVoice'].pause()
        }
      }
    },
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
    // this.createWebsocket()
    this.getNowTime()
    this.setBasicData()
    document.querySelector('html').style.fontSize = (document.documentElement.clientWidth > 1024 ? 1024 : document.documentElement.clientWidth) / 16 + 'px'
    // this.createWs()
  },
  methods: {
    createWs() {
      const ws = new WebSocket('ws://192.168.0.222:8000/rule_monitor/2')
      const timeOut = setTimeout(() => {
        this.setFailStatus(true)
      }, 10000)
      ws.onopen = () => {
        console.log('联通')
      }
      ws.onmessage = (res) => {
        clearTimeout(timeOut)
        this.setFailStatus(true)
        this.setGzData(JSON.parse(res.data))
      }
    },
    getNowTime() {
      let t = null
      // let count = -4
      const time = () => {
        clearTimeout(t)
        const dt = new Date()
        const y = dt.getFullYear()
        const mt = dt.getMonth() + 1
        const day = dt.getDate()
        const h = dt.getHours()
        const m = dt.getMinutes()
        const s = dt.getSeconds()
        this.setTime({
          nowTime: '北京时间：' + y + '年' + mt + '月' + day + '日 ' + h + '时' + m + '分' + s + '秒',
          sunTime: '星时：' + (y - 2010) + '年' + mt + '月' + day + '日 ' + h + '时' + m + '分' + s + '秒'
        })

        // this.setBasicData(count)
        // if ((count + 6) % 8 === 0) {
        //   this.setFailStatus(true)
        //   this.setGzData({
        //     data: [{}, {
        //       time: '2021-1-4 18:28:39',
        //       starTime: { value: '11-1-4 18:29:5' },
        //       fault: '星箭分离66s左右，双太阳翼未展开',
        //       ErrDes: '太阳翼帆板未展开，会导致蓄电池过放电，任务可能失败。\n严重程度：严重',
        //       ErrHarm: 'N01009+Y太阳翼帆板信号故障指示',
        //       Situation: '1、发K2“火工品母线通”\n2、发K1“火工品起爆”\n若指令无效，向上级请示命令'
        //     }]
        //   })
        // } else if (count % 8 === 0) {
        //   this.setFailStatus(false)
        // }
        // this.setBarData()
        // count++
        t = setTimeout(time, 2000)
      }
      t = setTimeout(time, 2000)
    },
    ...mapMutations('first', ['setMenuActive', 'setBasicData', 'setTime', 'setBarData', 'setFailStatus', 'setGzData']),
    ...mapActions('first', ['createWebsocket'])
  }
}
</script>

<style lang="scss" scoped>
@import 'style/index.scss';
</style>
