<template>
  <!-- 页面主体 -->
  <el-row style="width: 100%" :gutter="20" class="relationBox">
    <el-col :span="16">
      <!-- 地图模块 -->
      <div class="panel map" style="height: 7.8rem;margin-bottom: .3rem">
        <h2>
          遥测信号时域分析
          <div class="ctrl">
            <el-select v-model="metaValue" size="mini" style="display:inline-block;margin-right: .2rem" @change="setOptionMain">
              <el-option
                v-for="item in metaList"
                :key="item.metaColumnId"
                :label="item.metaColumnName"
                :value="item.metaColumnId"
              />
            </el-select>
            <span style="font-size: .16rem;color: #0091ff"><i class="el-icon-s-order" /> 统计量 </span>
            <el-switch
              v-model="xingxiadian"
              style="display:inline-block;margin-right: .2rem"
              @change="setCount"
            />
            <span style="font-size: .16rem;color: #fbbe2f"><i class="el-icon-warning" /> 异常检测 </span>
            <el-switch
              v-model="isWarning"
              active-color="#fbbe2f"
              style="display:inline-block;margin-right: .2rem"
              @change="setWarning"
            />
            <span style="font-size: .16rem;color: #24cf43"><i class="el-icon-s-marketing" /> 拟合比对 </span>
            <el-switch
              v-model="isSmooth"
              active-color="#24cf43"
              style="display:inline-block"
              @change="setSmooth"
            />
          </div>
        </h2>
        <v-chart :options="optionMain" style="height: 100%;" autoresize class="echartBox" />
      </div>
      <div class="panel" style="height: 3.75rem">
        <h2>平滑FFT分析</h2>
        <v-chart :options="barOption2" class="echartBox" />
      </div>
    </el-col>
    <el-col :span="8">
      <div class="panel" style="height: 3.75rem; margin-bottom: .3rem">
        <h2>一阶差分分析</h2>
        <v-chart :options="barOption3" class="echartBox" />
      </div>
      <div class="panel" style="height: 3.75rem; margin-bottom: .3rem">
        <h2>移动方差分析</h2>
        <v-chart :options="barOption4" class="echartBox" />
      </div>
      <div class="panel" style="height: 3.75rem">
        <h2>小波包分解系数能量</h2>
        <v-chart :options="barOption5" class="echartBox" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

import ECharts from 'vue-echarts'
import 'echarts'
import 'echarts-gl'
import 'element-ui'

// import china from './china.js244'
// ECharts.registerMap('china', china)
import chinaMap from './china.json'
ECharts.registerMap('china', chinaMap)

var xAxisData = []
var data1 = []
var data2 = []
for (var i = 0; i < 100; i++) {
  xAxisData.push('频率' + i)
  data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
  data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5)
}

export default {
  name: '',
  components: {
    'v-chart': ECharts
  },
  data() {
    const myColor = ['#247af5', '#24cf43', '#56D0E3', '#fbbe2f', '#F57474']

    return {
      isSmooth: false,
      isWarning: false,
      xingxiadian: false,
      dataJson: [],
      tableList: [],
      metaValue: '290',
      metaList: [{
        metaColumnId: '289',
        metaColumnName: '陀螺X零偏'
      }, {
        metaColumnId: '290',
        metaColumnName: '陀螺Y零偏'
      }, {
        metaColumnId: '291',
        metaColumnName: '陀螺Z零偏'
      }, {
        metaColumnId: '292',
        metaColumnName: '动量轮X轴承温度'
      }, {
        metaColumnId: '294',
        metaColumnName: '动量轮Y轴承温度'
      }, {
        metaColumnId: '296',
        metaColumnName: '动量轮Z轴承温度'
      }],
      nowTime: '',
      count: {
        total: 235411
      },
      barOption4: null,
      pieOption: null,
      barOption2: null,
      barOption3: null,
      barOption5: null,
      optionDefault: {
        xAxis: {
          name: '信号',
          data: [],
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff'
          }
        },
        grid: [{
          left: 50,
          right: 70,
          bottom: '16%',
          containLabel: true
        }],
        color: myColor,
        tooltip: {
          // formatter(params) {
          //   return params[0].value
          // },
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        toolbox: {
          left: 'center',
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
              type: 'takeGlobalCursor',
              key: 'dataZoomSelect',
              dataZoomSelectActive: true
            },
            restore: {},
            saveAsImage: {}
          }
        },
        yAxis: {
          name: '值',
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff'
          }
        },
        series: [{
          name: 'expected',
          type: 'line',
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          smooth: false,
          data: []
        }]
      },
      optionMain: null
    }
  },
  computed: {
    ...mapState('first', ['basicData'])
  },
  created() {
    // this.setBarData()
    // this.formInline.metaColumnIds = this.metaList.map(e => e.metaColumnId)
    this.getData().then(res => {
      console.log(res)
      this.dataJson = res
      this.setOptionMain()
    })
    // this.getTimeDomainResult(this.formInline).then(res => {
    //   this.dataList = res
    //   this.setOptionMain()
    // })
  },
  methods: {
    setSmooth() {
      if (this.isSmooth) {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.series[0].smooth = true
        this.optionMain = warningOption
      } else {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.series[0].smooth = false
        this.optionMain = warningOption
      }
    },
    setCount() {
      if (this.xingxiadian) {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.series[0].markLine = {
          silent: true,
          precision: 8,
          data: [{
            type: 'max',
            name: '最大值',
            lineStyle: {
              color: '#F57474'
            }
          }, {
            type: 'min',
            name: '最小值',
            lineStyle: {
              color: '#F57474'
            }
          }, {
            type: 'average',
            name: '平均值',
            lineStyle: {
              color: '#24cf43'
            }
          }]
        }
        this.optionMain = warningOption
      } else {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.series[0].markLine = {
          silent: true,
          precision: 8,
          data: []
        }
        this.optionMain = warningOption
      }
    },
    setWarning() {
      if (this.isWarning) {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.visualMap = {
          show: false,
          dimension: 0,
          pieces: [{
            lte: 100,
            color: '#0091ff'
          }, {
            gt: 100,
            lte: 200,
            color: '#fbbe2f'
          }, {
            gt: 200,
            color: '#0091ff'
          }]
        }
        warningOption.series[0].markArea = {
          itemStyle: {
            color: 'rgba(245, 116, 116, 0.1)'
          },
          data: [[{
            name: '异常部分',
            xAxis: this.optionMain.xAxis.data[100]
          }, {
            xAxis: this.optionMain.xAxis.data[200]
          }]]
        }
        this.optionMain = warningOption
      } else {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.visualMap = {
          show: false,
          dimension: 0,
          pieces: [{
            lte: 100,
            color: '#0091ff'
          }, {
            gt: 100,
            lte: 200,
            color: '#0091ff'
          }, {
            gt: 200,
            color: '#0091ff'
          }]
        }
        warningOption.series[0].markArea = {
          itemStyle: {
            color: 'rgba(245, 116, 116, 0)'
          },
          data: []
        }
        this.optionMain = warningOption
      }
    },
    setOptionMain() {
      this.getTelemetrySample(this.metaValue).then(response => {
        // 时域分析
        const newSetOption = JSON.parse(JSON.stringify(this.optionDefault))
        response.forEach(e => {
          newSetOption.xAxis.data.push(Object.keys(e)[0])
          newSetOption.series[0].data.push(Object.values(e)[0])
        })
        this.optionMain = newSetOption

        // 一阶
        const newSetOption2 = JSON.parse(JSON.stringify(this.optionMain))
        newSetOption2.series[0].data = this.optionMain.series[0].data.map((e, i) => {
          if (i <= 110) {
            return (parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1
          } else if (i > 110 && i < 156) {
            return (parseFloat(Math.random().toFixed(2)) * 8 + 7) / 50 - 10
          } else if (i >= 156 && i < 360) {
            return (parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1
          } else if (i >= 360 && i < 420) {
            return (parseFloat(Math.random().toFixed(2)) * 8 + 7) / 50 - 10
          } else if (i >= 420 && i < 600) {
            return (parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1
          } else if (i >= 600 && i < 650) {
            return (parseFloat(Math.random().toFixed(2)) * 8 + 7) / 50 - 10
          } else {
            return (parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1
          }
        })
        newSetOption2.grid[0].bottom = '22%'
        this.barOption3 = newSetOption2
        // 移动方差
        const newSetOption3 = JSON.parse(JSON.stringify(this.optionMain))
        newSetOption3.series[0].data = this.optionMain.series[0].data.map((e, i) => {
          if (i <= 110) {
            return -((parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1)
          } else if (i > 110 && i < 156) {
            return -((parseFloat(Math.random().toFixed(2)) * 8 + 7) / 50 - 10)
          } else if (i >= 156 && i < 360) {
            return -((parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1)
          } else if (i >= 360 && i < 420) {
            return -((parseFloat(Math.random().toFixed(2)) * 8 + 7) / 50 - 10)
          } else if (i >= 420 && i < 600) {
            return -((parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1)
          } else if (i >= 600 && i < 650) {
            return -((parseFloat(Math.random().toFixed(2)) * 8 + 7) / 50 - 10)
          } else {
            return -((parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1)
          }
        })
        newSetOption3.grid[0].bottom = '22%'
        this.barOption4 = newSetOption3

        const newSetOption4 = JSON.parse(JSON.stringify(this.optionDefault))
        newSetOption4.xAxis.data = [1, 2, 3, 4, 5, 6, 7]
        newSetOption4.series[0].type = 'bar'
        const d = this.metaList.findIndex(e => e.metaColumnId === this.metaValue)
        const num1 = d * 80 + 1500
        const num2 = d * 30 + 200
        const num3 = d * 3 + 12
        newSetOption4.series[0].data = [num1, num2, num3, 1, 1, 0, 0]
        newSetOption4.grid[0].bottom = '22%'
        newSetOption4.xAxis.boundaryGap = true
        this.barOption5 = newSetOption4
      })
      // 频域分析
      this.getFFTMainResult().then(response => {
        const dataList = response.find(e => e.metaColumnId === this.metaValue)
        const newSetOption = JSON.parse(JSON.stringify(this.optionDefault))
        console.log(dataList)
        newSetOption.xAxis.data = Object.keys(dataList.FrequencyAmplitude)
        newSetOption.series[0].data = Object.values(dataList.FrequencyAmplitude)
        newSetOption.grid[0].bottom = '20%'
        this.barOption2 = newSetOption
      })
    },
    getData() {
      return new Promise((resolve, reject) => {
        const data = require('./data.json')
        console.log(data)
        resolve(data)
      })
    },
    // 获取遥测工程值数据
    getTelemetrySample(id) {
      return new Promise((resolve, reject) => {
        const data = this.dataJson.find(e => {
          return e.metaColumnId === id
        }).tdata
        console.log(222222222, data)
        resolve(data)
      })
    },
    // 时域分析返回数据
    getTimeDomainResult(id) {
      this.dataList = this.dataJson.find(e => {
        return e.metaColumnId === id
      }).tdata
    },
    // 获取主要的FFT值
    getFFTMainResult() {
      return new Promise((resolve, reject) => {
        const data = require('./data2.json')
        resolve(data)
      })
    },
    ...mapMutations('first', ['setBasicData', 'setBarData'])
  }
}
</script>

<style lang="scss">
@import 'style/index.scss';
.relationBox{
  .panel{
    height: 5.65rem;
  }
  .el-table.tableData {
    background: none;
    padding: 0;
    margin-top: 10px;
    th, tr{
      background: none;
      border-color: #fff;
      color: #fff;
      font-size: 14px;
      line-height: auto;
      &:hover, &.isActive, &.current-row{
        background: none;
        td {
          background: none;
        }
      }
      td {
        font-size: 14px;
      }
    }
  }
}
</style>
