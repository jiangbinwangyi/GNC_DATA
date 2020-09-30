<template>
  <!-- 页面主体 -->
  <div style="width: 100%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="6">
        <div class="panel pie">
          <v-chart :options="pieOption" class="echartBox" />
        </div>
      </el-col>
      <el-col :span="12" class="timeBox">
        <div class="panel">
          <p>{{ nowTime }}</p>
          <p>{{ sunTime }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel pie2">
          <v-chart :options="pieOption2" class="echartBox" />
        </div>
      </el-col>
    </el-row>
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="6">
        <div class="panel bar">
          <v-chart :options="barOption" class="echartBox" />
        </div>
        <div class="panel line2">
          <v-chart :options="lineOption2" class="echartBox" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="panel relationBox">
          <v-chart :options="mapOption" class="echartBox" style="border:solid 1px #145e97" />
          <div class="mapBorder" />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel line">
          <v-chart :options="lineOption" class="echartBox" />
        </div>
        <div class="panel bar2">
          <v-chart :options="barOption2" class="echartBox" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ECharts from 'vue-echarts'
import 'echarts'

// import china from './china.js'
// ECharts.registerMap('china', china)
import chinaMap from './china.json'
ECharts.registerMap('china', chinaMap)

import './data/world2.js'
import option from './data/world5.js'

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    const myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6']

    return {
      count: {
        total: 235411
      },
      barOption: {
        title: {
          text: '各部件故障数量统计',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        color: myColor[0],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['帆板', '惯姿敏感器', '星敏感器', '陀螺', '动量轮'],
          axisLabel: {
            color: 'rgba(255,255,255,.6)',
            fontSize: '10',
            interval: '0',
            rotate: '30'
          },
          axisLine: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: 'rgba(255,255,255,.6)',
              fontSize: '12'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)',
                width: 2,
                type: 'solid'
              }
            },
            // y轴分割线
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            }
          }
        ],
        series: [
          {
            name: '信号量',
            type: 'bar',
            barWidth: '35%',
            data: [8, 19, 24, 28, 33],
            itemStyle: {
              // 修改柱子的圆角
              barBorderRadius: 3
            }
          }
        ]
      },
      lineOption: {
        title: {
          textStyle: {
            color: '#fff'
          },
          text: '系统累计故障数',
          left: 'center'
        },
        color: myColor,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // 如果series里面有name属性值，则legend里可将data值删去
          // data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
          // 修改图例组件文字
          textStyle: {
            color: '#4c9bfd'
          },
          left: 'center',
          top: '12%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '0',
          show: true,
          borderColor: '#012f4a',
          containLabel: true // 包含刻度文字在内
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1min', '2min', '3min', '4min', '5min', '6min', '7min', '8min', '9min', '10min', '11min', '12min'],
          axisTick: {
            show: false // 去除刻度线
          },
          axisLabel: {
            color: '#4c9bfd' // 文本颜色
          },
          axisLine: {
            show: false // 去除轴线
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisTick: {
            show: false // 去除刻度线
          },
          axisLabel: {
            color: '#4c9bfd' // 文本颜色
          },
          axisLine: {
            show: false // 去除轴线
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
            type: 'line',
            data: [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3]
          }
        ]
      },
      pieOption: {
        title: {
          textStyle: {
            color: '#fff'
          },
          text: '各部件信号量占比',
          left: 'center'
        },
        color: myColor,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: '0%',
          itemWidth: 10,
          itemHight: 10,
          textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: '12'
          }
        },
        series: [
          {
            name: '年龄分布',
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1, name: '帆板' },
              { value: 4, name: '惯姿敏感器' },
              { value: 2, name: '星敏感器' },
              { value: 2, name: '陀螺' },
              { value: 1, name: '动量轮' }
            ]
          }
        ]
      },
      barOption2: {
        title: {
          text: '各部件故障信号量占比',
          textStyle: {
            color: '#fff'
          },
          left: 'center'
        },
        grid: {
          left: '22%',
          top: '14%',
          bottom: '0'
          // containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            data: ['帆板', '惯性姿态敏感器', '星敏感器', '陀螺', '动量轮'],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#fff'
            }
          },
          {
            show: true,
            inverse: true,
            data: [8, 19, 24, 28, 33],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            }
          }
        ],
        series: [
          {
            name: '框',
            type: 'bar',
            barWidth: 20,
            yAxisIndex: 1,
            itemStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#fff',
              borderWidth: 0,
              barBorderRadius: 10
            },
            data: [100, 100, 100, 100, 100]
          },
          {
            name: '条',
            type: 'bar',
            data: [20, 15, 13, 10, 8],
            // 柱子的宽度
            barWidth: 20,
            yAxisIndex: 0,
            // 柱子设为圆角
            itemStyle: {
              barBorderRadius: 10,
              // 此时的color，可以修改柱子的颜色
              // params为每个柱子对象
              color: function(params) {
                return myColor[params.dataIndex]
              }
            },
            label: {
              normal: {
                show: true,
                // 图形内显示
                position: 'right',
                // 文字的显示格式
                // {c}会自动解析为 series数据里面的数据
                formatter: '{c}%'
              }
            }
          }
        ]
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
      pieOption2: {
        title: {
          text: '各部件故障数量占比',
          textStyle: {
            color: '#fff'
          },
          left: 'center'
        },
        color: myColor,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: '0%',
          itemWidth: 10,
          itemHight: 10,
          textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: '10'
          }
        },
        series: [
          {
            name: '故障占比',
            type: 'pie',
            radius: ['0', '60'],
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
              fontSize: 10
            },
            data: [
              { value: 1, name: '帆板' },
              { value: 1, name: '惯姿敏感器' },
              { value: 3, name: '星敏感器' },
              { value: 2, name: '陀螺' },
              { value: 2, name: '动量轮' }
            ]
          }
        ]
      }
    }
  },
  computed: {
    mapOption() {
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
    },
    ...mapState('first', ['basicData', 'nowTime', 'sunTime'])
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
@import 'style/index.scss';

.mainbox {
  .panel.relationBox {
    width: 100%;
    height: 7.5rem;
    position: relative;
    .mapBorder{
      position: absolute;
      top: 19%;
      left: 10%;
      right: 10%;
      bottom: 19%;
      border-top: solid 1px #195BB9;
      border-bottom: solid 1px #195BB9;
    }
  }
  .timeBox{
    font-size: 28px;
    height: 3.67rem;
    line-height: 1;
    color: #F8B448;
    p {
      padding-top: 0.8rem;
      text-align: center;
    }
  }
}
</style>
