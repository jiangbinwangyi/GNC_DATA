<template>
  <!-- 页面主体 -->
  <el-row style="width: 100%" :gutter="20" class="relationBox">
    <el-col :span="6">
      <div class="panel">
        <h2>遥测信号箱线图分析</h2>
        <v-chart :options="barOption" class="echartBox" />
      </div>
      <div class="panel">
        <h2>遥测信号包络分析</h2>
        <v-chart :options="pieOption" class="echartBox" />
      </div>
    </el-col>
    <el-col :span="12">
      <!-- 地图模块 -->
      <div class="panel" style="height: 1rem">
        <el-form label-width="120px">
          <el-form-item label="选择遥测参数">
            <el-select v-model="metaValue" style="width: 100%" @change="setOptionMain">
              <el-option
                v-for="item in metaList"
                :key="item.metaColumnId"
                :label="item.metaColumnName"
                :value="item.metaColumnId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="panel map" style="height: 10.3rem">
        <h2>遥测信号时域分析</h2>
        <v-chart :options="optionMain" style="height: 70%;" autoresize class="echartBox" />
        <h3 style="font-size: .22rem; text-align: center; color: #fff; margin: .5rem 0 .3rem">统计量</h3>
        <el-table
          border
          fit
          :data="tableList"
          highlight-current-row
          style="width: 100%;"
          class="tableData"
        >
          <el-table-column prop="Max" label="最大值" />
          <el-table-column prop="Min" label="最小值" />
          <el-table-column prop="Average" label="平均值" />
          <el-table-column prop="Variance" label="方差" />
          <el-table-column prop="MeanSquare" label="均方差" />
          <el-table-column prop="StandardDeviation" label="均方根" />
          <el-table-column prop="lowerquantile" label="1/4分位数" />
          <el-table-column prop="Median" label="中位数" />
          <el-table-column prop="upperquantile" label="3/4分位数" />
          <el-table-column prop="AccumulativeTotal" label="累计数" />
        </el-table>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="panel">
        <h2>遥测信号FFT分析</h2>
        <v-chart :options="barOption2" class="echartBox" />
      </div>
      <div class="panel">
        <h2>遥测信号历史数据分析</h2>
        <p style="font-size: 14px; color: #ccc; text-align: center; line-height: 1; padding-top: 10px">时间：8546.666</p>
        <v-chart :options="barOption5" class="echartBox" style="margin: 0; padding: 0" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { getTelemetrySample, getTimeDomainResult, getFFTMainResult } from '@/api/dataChart/index'
import { mapMutations, mapState } from 'vuex'

import dataTool from 'echarts/extension/dataTool'
import ECharts from 'vue-echarts'
import 'echarts'
import 'echarts-gl'
import 'element-ui'

// import china from './china.js'
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
    const myColor = ['#247af5', '#83f574', '#56D0E3', '#F8B448', '#F57474']

    return {
      tableList: [],
      metaValue: '5419',
      metaList: [{
        metaColumnId: '5419',
        metaColumnName: 'SQL_SBX'
      }, {
        metaColumnId: '5422',
        metaColumnName: 'SQL_SBZ'
      }, {
        metaColumnId: '5423',
        metaColumnName: 'SQL_EBY'
      }, {
        metaColumnId: '5426',
        metaColumnName: 'SQL_EBX'
      }, {
        metaColumnId: '5427',
        metaColumnName: 'SQL_EBZ'
      }, {
        metaColumnId: '5428',
        metaColumnName: 'SQL_X'
      }],
      formInline: {
        metaColumnIds: '5419',
        teststartTime: '2000-10-21T00:52:02.000Z',
        testendTime: '2020-10-20T01:52:02.000Z',
        sampleNum: 888
      },
      barOption5: {
        tooltip: {},
        visualMap: {
          max: 60,
          show: false,
          inRange: { color: myColor }
        },
        xAxis3D: {
          type: 'category',
          name: '',
          nameTextStyle: {
            color: '#fff'
          },
          axisLabel: {
            color: '#fff'
          },
          data: (() => {
            const arr = []
            for (let i = 1; i < 25; i++) {
              arr.push('信号' + i)
            }
            return arr
          })()
        },
        yAxis3D: {
          type: 'category',
          name: '',
          axisLabel: {
            color: '#fff'
          },
          data: ['信号A', '信号B', '信号C', '信号D', '信号E', '信号F', '信号G']
        },
        zAxis3D: {
          type: 'value',
          name: '信号值',
          nameTextStyle: {
            color: '#fff',
            fontSize: 12
          },
          axisLabel: {
            color: '#fff'
          },
          max: 60
        },
        grid3D: {
          top: '-10%',
          boxWidth: 150,
          boxDepth: 60,
          viewControl: {
            distance: 200,
            alpha: 10,
            beta: 20
          }
        },
        series: [{
          type: 'bar3D',
          data: this.$store.state.first.barData,
          shading: 'lambert',
          label: {
            textStyle: {
              fontSize: 16,
              borderWidth: 1
            }
          }
        }]
      },
      tableData: [{
        date: '1',
        name: '星敏Vx',
        address: '星敏',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '2',
        name: '星敏Vy',
        address: '星敏',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '3',
        name: '星敏Vz',
        address: '星敏',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '4',
        name: '矫正时间',
        address: '星敏',
        result: '一般',
        method: '调试XXX'
      }],
      nowTime: '',
      count: {
        total: 235411
      },
      barOption: null,
      pieOption: null,
      barOption2: null,
      barOption3: {
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#fff'
          },
          data: ['11-1', '11-2', '11-3', '11-4', '11-5', '11-6', '11-7', '11-8', '11-9', '11-10', '11-11', '11-12']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          }
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320, 1420, 1589, 1656, 1703, 1905],
          type: 'line',
          smooth: true
        }, {
          data: [820, 932, 901, 934, 1290, 1330, 1320, 1420, 1589, 1656, 1703, 1905],
          type: 'line'
        }]
      },
      lineOption2: {
        title: {
          text: '各部件健康指标分析',
          textStyle: {
            color: '#fff'
          },
          left: 'center'
        },
        tooltip: {},
        radar: {
          center: ['50%', '65%'],
          radius: 65,
          name: {
            textStyle: {
              color: '#fff'
            }
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(114, 172, 209, 0.2)'],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 10
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          indicator: [
            { name: '帆板', max: 6500 },
            { name: '惯性姿态敏感器', max: 16000 },
            { name: '星敏感器', max: 30000 },
            { name: '陀螺', max: 38000 },
            { name: '动量轮', max: 52000 }
          ]
        },
        series: [{
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [4300, 10000, 28000, 35000, 50000, 19000],
              name: '各部件故障态势',
              itemStyle: {
                color: myColor[0]
              },
              areaStyle: {}
            }
          ]
        }]
      },
      optionDefault: {
        xAxis: {
          name: '信号',
          data: [],
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff'
          }
        },
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
          smooth: true,
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
    this.setBarData()
    this.formInline.metaColumnIds = this.metaList.map(e => e.metaColumnId)
    this.getTimeDomainResult(this.formInline).then(res => {
      this.dataList = res
      this.setOptionMain()
    })
  },
  methods: {
    setOptionMain() {
      this.formInline.metaColumnIds = [this.metaValue]
      this.getTelemetrySample(this.formInline).then(response => {
        // 时域分析
        const newSetOption = JSON.parse(JSON.stringify(this.optionDefault))
        response[0].tdata.forEach(e => {
          newSetOption.xAxis.data.push(Object.keys(e)[0])
          newSetOption.series[0].data.push(Object.values(e)[0])
        })
        this.optionMain = newSetOption
        // 包络分析
        const limitOption = JSON.parse(JSON.stringify(newSetOption))
        limitOption.series[0].markLine = {
          silent: true,
          precision: 8,
          lineStyle: {
            color: '#F57474'
          },
          data: [{
            type: 'max',
            name: '最大值'
          }, {
            type: 'min',
            name: '最小值'
          }]
        }
        this.pieOption = limitOption
      })
      // 频域分析
      this.getFFTMainResult(this.formInline).then(response => {
        const newSetOption = JSON.parse(JSON.stringify(this.optionDefault))
        response.forEach(e => {
          newSetOption.xAxis.data = Object.keys(e.FrequencyAmplitude)
          newSetOption.series[0].data = Object.values(e.FrequencyAmplitude)
        })
        this.barOption2 = newSetOption
      })
      // 统计量
      this.tableList = [this.dataList.find(e => e.metaColumnId === this.metaValue)]
      // 箱线图
      const boxOption = JSON.parse(JSON.stringify(this.optionDefault))
      const boxData = []
      for (let i = 0; i < 1; i++) {
        boxData.push([
          this.dataList[i].Min,
          this.dataList[i].Max,
          this.dataList[i].Median,
          this.dataList[i].lowerquantile,
          this.dataList[i].upperquantile
        ])
        boxOption.xAxis.data.push(this.metaList[i].metaColumnName)
      }
      boxOption.series[0].type = 'boxplot'
      boxOption.series[0].data = dataTool.prepareBoxplotData(boxData).boxData
      this.barOption = boxOption
    },
    // 获取遥测工程值数据
    getTelemetrySample(data) {
      return new Promise((resolve, reject) => {
        getTelemetrySample(data).then(response => {
          resolve(response.data)
        }).catch(() => {
          reject(false)
        })
      })
    },
    // 时域分析返回数据
    getTimeDomainResult(data) {
      return new Promise((resolve, reject) => {
        getTimeDomainResult(data).then(response => {
          resolve(response.data)
        }).catch(() => {
          reject(false)
        })
      })
    },
    // 获取主要的FFT值
    getFFTMainResult(data) {
      return new Promise((resolve, reject) => {
        getFFTMainResult(data).then(response => {
          resolve(response.data)
        }).catch(() => {
          reject(false)
        })
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
