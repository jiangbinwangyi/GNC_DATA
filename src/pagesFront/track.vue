<template>
  <div class="panel relationBox">
    <h2>飞行轨迹</h2>
    <v-chart :options="option" class="echartBox" />
    <div class="panel-footer" />
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts'
import './data/world2.js'

// import option from './data/world1.js'
// import option from './data/world3.js'
// import option from './data/world4.js'
import option from './data/world5.js'

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    return {}
  },
  computed: {
    option() {
      const data = this.$store.state.first.basicData.track
      console.log(data)
      data.forEach(item => {
        option.series.push({
          smooth: true,
          type: 'line',
          data: item
        })
      })
      return option
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'style/index.scss';

.mainbox {
  .panel.relationBox {
    width: 100%;
    height: 11rem;
  }
}
</style>
