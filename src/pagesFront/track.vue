<template>
  <el-row style="width: 100%" :gutter="20">
    <el-col :span="8">
      <div class="panel map">
        <v-chart
          :options="mapOption"
          autoresize
          style="height: 100%;width:100%"
        />
      </div>
    </el-col>
    <el-col :span="8">
      <div class="panel map">
        <v-chart
          :options="scatterOption"
          autoresize
          style="height: 100%;width:100%"
        />
      </div>
    </el-col>
    <el-col :span="8">
      <div class="panel map">
        <v-chart :options="barOption2" class="echartBox" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import data from './life-expectancy-table.json'

import ECharts from 'vue-echarts'
import 'echarts'
import 'echarts-gl'

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    const myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6']
    return {
      barOption2: {
        title: {
          text: '单机实时报警数量统计',
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
          }
        ],
        series: [
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
      scatterOption: {
        title: {
          text: '多信号实时数据',
          textStyle: {
            color: '#fff'
          },
          left: 'center',
          top: '2%'
        },
        grid3D: {},
        axisLabel: {
          color: '#fff' // 文本颜色
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
            // show: false
          }
        },
        xAxis3D: {
          type: 'category'
        },
        yAxis3D: {},
        zAxis3D: {},
        dataset: {
          dimensions: [
            'Income',
            'Life Expectancy',
            'Population',
            'Country',
            { name: 'Year', type: 'ordinal' }
          ],
          source: data
        },
        series: [
          {
            type: 'scatter3D',
            symbolSize: 4,
            encode: {
              x: 'Country',
              y: 'Life Expectancy',
              z: 'Income',
              tooltip: [0, 1, 2, 3, 4]
            }
          }
        ]
      },
      mapOption: {
        title: {
          text: '星敏感器校正速度状态监控',
          textStyle: {
            color: '#fff'
          },
          left: 'center',
          top: '2%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          textStyle: {
            color: '#4c9bfd'
          },
          left: 'center',
          top: '12%'
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0',
          containLabel: true
        },
        // color: myColor[0],
        xAxis: {
          name: '(ms)',
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            color: 'rgba(255,255,255,.6)'
          },
          data: this.$store.state.first.basicData.healthy.time
        },
        yAxis: {
          name: '健康值',
          // maxInterval: 20,
          type: 'value',
          min: 95,
          max: 104,
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
        },
        visualMap: {
          show: false
          // pieces: [{
          //   gt: 97,
          //   lte: 105,
          //   color: myColor[0]
          // }, {
          //   gt: 0,
          //   lte: 97,
          //   color: myColor[1]
          // }]
        },
        series: [{
          name: '矫正速度Vx',
          data: this.$store.state.first.basicData.healthy.data,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#8cd5c2', // 改变折线点的颜色
              lineStyle: {
                color: 'rgba(198, 223, 89, 0.5)' // 改变折线颜色
              }
            }
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgb(198, 223, 89)' // 0% 处的颜色
              }, {
                offset: 1, color: '#0a37b1' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          smooth: true
          // areaStyle: {},
          // markLine: {
          //   data: [
          //     { yAxis: 97, name: '故障阈值', lineStyle: { color: myColor[1] }}
          //   ]
          // }
        },
        {
          name: '矫正速度Vy',
          data: this.$store.state.first.basicData.healthy.data2,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#8cd5c2', // 改变折线点的颜色
              lineStyle: {
                color: 'rgba(184, 187, 216, 0.5)' // 改变折线颜色
              }
            }
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgb(184, 187, 216)' // 0% 处的颜色
              }, {
                offset: 1, color: '#0a37b1' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          smooth: true
          // areaStyle: {},
          // markLine: {
          //   data: [
          //     { yAxis: 97, name: '故障阈值', lineStyle: { color: myColor[1] }}
          //   ]
          // }
        },
        {
          name: '矫正速度Vz',
          data: this.$store.state.first.basicData.healthy.data3,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#8cd5c2', // 改变折线点的颜色
              lineStyle: {
                color: 'rgba(19, 235, 37, 0.5)' // 改变折线颜色
              }
            }
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgb(19, 235, 37)' // 0% 处的颜色
              }, {
                offset: 1, color: '#0a37b1' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          smooth: true
          // areaStyle: {},
          // markLine: {
          //   data: [
          //     { yAxis: 105, name: '故障阈值', lineStyle: { color: myColor[1] }}
          //   ]
          // }
        }]
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'style/index.scss';

.mainbox {
  .panel.map {
    width: 100%;
    height: 6rem;
  }
}
</style>
