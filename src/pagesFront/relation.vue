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
      <div class="panel map" style="height: 11.5rem">
        <h2>XX卫星剩余寿命预测</h2>
        <v-chart :options="option" style="height: 80%;" autoresize class="echartBox" />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="panel">
        <h2>遥测信号FFT分析</h2>
        <v-chart :options="barOption2" class="echartBox" />
      </div>
      <div class="panel">
        <h2>遥测信号数据拟合</h2>
        <v-chart :options="barOption3" class="echartBox" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'

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

const boxData = dataTool.prepareBoxplotData([
  [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
  [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
  [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
  [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
  [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
])

export default {
  name: '',
  components: {
    'v-chart': ECharts
  },
  data() {
    const myColor = ['#247af5', '#8B78F6', '#F57474', '#56D0E3', '#F8B448']

    return {
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
      barOption: {
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: boxData.axisData,
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false
          },
          axisLabel: {
            formatter: '信号 {value}',
            color: '#fff'
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          min: 500,
          axisLabel: {
            color: '#fff'
          },
          splitArea: {
            show: true
          }
        },
        series: [
          {
            name: 'boxplot',
            type: 'boxplot',
            data: boxData.boxData,
            tooltip: {
              formatter(param) {
                return [
                  '星敏Vx ' + param.name + ': ',
                  '星敏Vy: ' + param.data[5],
                  '星敏Vz: ' + param.data[4],
                  '矫正速度Vx: ' + param.data[3],
                  '矫正速度Vy: ' + param.data[2],
                  '矫正速度Vz: ' + param.data[1]
                ].join('<br/>')
              }
            }
          },
          {
            name: 'outlier',
            type: 'scatter',
            data: boxData.outliers
          }
        ]
      },
      pieOption: {
        legend: {
          textStyle: {
            color: '#4c9bfd'
          },
          left: 'center',
          top: '12%'
        },
        color: myColor,
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1min', '2min', '3min', '4min', '5min', '6min', '7min', '8min'],
          axisTick: {
            show: false // 去除刻度线
          },
          axisLabel: {
            color: '#fff' // 文本颜色
          },
          axisLine: {
            show: false // 去除轴线
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          min: -1,
          max: 3,
          axisLabel: {
            color: '#fff' // 文本颜色
          },
          boundaryGap: false, // 去除轴内间距
          splitLine: {
            lineStyle: {
              color: '#012f4a' // 分割线颜色
            }
          }
        },
        series: [
          {
            name: '包络上限',
            type: 'line',
            smooth: true,
            data: [1.1, 1.3, 1.1, 1.3, 1.1, 1.3, 1.1, 1.4, 1.1, 1.3, 1.1, 1.4]
          },
          {
            name: '校正速度Vy',
            type: 'line',
            smooth: true,
            data: [0.7, 1, 0.8, 1, 0.7, 1, 1, 1.28, 0.7, 1, 1.1, 1.3]
          },
          {
            name: '包络下限',
            type: 'line',
            smooth: true,
            data: [0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 0.6]
          }
        ]
      },
      barOption2: {
        grid: {
          top: '10%',
          bottom: '30%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#505765'
            }
          }
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 65,
            end: 85,
            top: '80%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: 'rgba(255, 255, 255,.8)',
              fontSize: '12'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255,.8)',
                width: 2,
                type: 'solid'
              }
            },
            // y轴分割线
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255,.8)'
              }
            },
            data: (() => {
              const arr = []
              for (let i = 0; i < 3000; i++) {
                arr.push(i * 600)
              }
              return arr
            })()
          }
        ],
        yAxis: [{
          name: '振幅',
          type: 'value',
          max: 2000,
          axisLabel: {
            color: 'rgba(255, 255, 255,.8)',
            fontSize: '12'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255,.8)',
              width: 2,
              type: 'solid'
            }
          },
          // y轴分割线
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255,.8)'
            }
          }
        }],
        series: [{
          name: '流量',
          type: 'line',
          animation: false,
          barWidth: 1,
          markLine: {
            silent: true,
            data: [{
              yAxis: 2000,
              lineStyle: {
                color: myColor[2],
                type: 'solid'
              }
            }, {
              yAxis: 1500,
              lineStyle: {
                color: myColor[4],
                type: 'solid'
              }
            }]
          },
          data: (() => {
            const result = []
            for (let i = 0; i < 3000; i++) {
              const range = parseInt(Math.random() * 2000)
              if (range % 33 === 0) {
                result.push(parseInt(Math.random() * 1000 + 500))
              } else {
                result.push(parseInt(Math.random() * 300 + 100))
              }
            }
            return result
          })()
        }]
      },
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
          markLine: {
            silent: true,
            data: [{
              yAxis: 2100,
              lineStyle: {
                color: myColor[2],
                type: 'solid'
              }
            }, {
              yAxis: 1800,
              lineStyle: {
                color: myColor[4],
                type: 'solid'
              }
            }]
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320, 1420, 1589, 1656, 1703, 1905],
          type: 'line',
          color: myColor[0],
          smooth: true
        }, {
          color: myColor[1],
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
      option: {
        color: myColor,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(0, 255, 233,0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(255, 255, 255,1)'
                }, {
                  offset: 1,
                  color: 'rgba(0, 255, 233,0)'
                }],
                global: false
              }
            }
          }
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '15%'
          // containLabel: true
        },
        xAxis: [{
          type: 'category',
          axisLabel: {
            color: 'rgba(255,255,255,.8)',
            fontSize: '12'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.8)',
              width: 2,
              type: 'solid'
            }
          },
          // y轴分割线
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.8)'
            }
          },
          boundaryGap: false,
          data: ['11-01', '11-02', '11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09', '11-10', '11-11', '11-12', '11-13']
        }],
        yAxis: [{
          type: 'value',
          min: 0,
          // max: 140,
          splitNumber: 4,
          axisLabel: {
            color: 'rgba(255,255,255,.8)',
            fontSize: '12'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.8)',
              width: 2,
              type: 'solid'
            }
          },
          // y轴分割线
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.8)'
            }
          }
        }],
        series: [{
          type: 'line',
          smooth: true, // 是否平滑
          showAllSymbol: true,
          // symbol: 'image://./static/images/guang-circle.png',
          symbol: 'circle',
          symbolSize: 15,
          markLine: {
            silent: true,
            data: [{
              yAxis: 300,
              lineStyle: {
                color: myColor[2],
                type: 'solid'
              }
            }, {
              yAxis: 400,
              lineStyle: {
                color: myColor[4],
                type: 'solid'
              }
            }]
          },
          lineStyle: {
            normal: {
              shadowColor: 'rgba(0, 0, 0, .6)',
              shadowBlur: 0,
              shadowOffsetY: 5,
              shadowOffsetX: 5
            }
          },
          label: {
            show: true,
            position: 'top'
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 3,
            shadowColor: 'rgba(0, 0, 0, .6)',
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2
          },
          tooltip: {
            show: false
          },
          areaStyle: {
            normal: {
              color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0,179,244,0.3)'
              },
              {
                offset: 1,
                color: 'rgba(0,179,244,0)'
              }], false),
              shadowColor: 'rgba(0,179,244, 0.9)',
              shadowBlur: 20
            }
          },
          data: [502.84, 492.84, 482.84, 472.84, 462.84, 452.84, 442.84, 432.84, 422.84, 412.84, 402.84, 392.84, 382.84, 372.84, 362.84, 352.84, 342.84, 332.84, 502.84, 502.84, 502.84, 502.84, 502.84]
        }]
      }
    }
  },
  computed: {
    ...mapState('first', ['basicData'])
  },
  methods: {}
}
</script>

<style lang="scss">
@import 'style/index.scss';
.relationBox{
  .panel{
    height: 5.6rem;
  }
}
.el-table.tableData {
  background: none;
  th, tr{
    background: none;
  }
}
</style>
