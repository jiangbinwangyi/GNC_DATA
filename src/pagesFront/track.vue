<template>
  <el-row style="width: 100%" :gutter="20" class="trackBox">
    <el-col :span="6">
      <div class="panel line">
        <div class="satell">
          <img src="static/globe/satell.svg" alt="">
        </div>
        <v-chart
          :options="globe"
          autoresize
          style="height: 100%;width:100%;position:relative;"
        />
      </div>
      <div class="panel line">
        <v-chart
          :options="mapOption"
          autoresize
          style="height: 100%;width:100%"
        />
      </div>
    </el-col>
    <el-col :span="12">
      <div class="panel map">
        <v-chart
          :options="scatterOption"
          autoresize
          style="height: 100%;width:100%"
        />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="panel line">
        <v-chart :options="barOption2" class="echartBox" />
      </div>
      <div class="panel line">
        <h2>信号实时报警监测</h2>
        <el-table
          :data="tableData"
          border
          class="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="序号"
            width="50"
          />
          <el-table-column
            prop="name"
            label="信号"
            width="90"
          />
          <el-table-column
            prop="address"
            label="检测位置"
            width="90"
          />
          <el-table-column
            prop="result"
            label="异常后果"
            width="100"
          />
          <el-table-column
            prop="method"
            label="解决方案"
            width="100"
          />
        </el-table>
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
    // const planePath = 'path://M1007.315862 166.87669L856.478897 16.057379c-21.044966-21.044966-54.360276-21.044966-73.65738 0L563.614897 235.272828c-21.044966 21.044966-21.044966 54.360276 0 73.648551l59.630344 59.630345-29.810758 29.810759-19.297104-19.288276c-28.054069-28.062897-64.882759-40.342069-99.954758-40.342069-47.351172-38.576552-108.738207-43.837793-143.80138-8.765793-35.080828 35.080828-29.819586 96.459034 8.765793 143.801379 0 36.837517 12.270345 71.909517 40.333242 99.972414l19.288276 19.288276-29.810759 29.810758-59.630345-59.621517c-21.044966-21.044966-54.360276-21.044966-73.657379 0L16.454621 782.433103c-21.044966 21.044966-21.044966 54.360276 0 73.648552l150.81931 150.828138c21.044966 21.044966 54.369103 21.044966 73.657379 0L460.146759 787.685517c21.044966-21.044966 21.044966-54.369103 0-73.657379l-50.846897-50.855724 29.801931-29.819586 66.648276 66.648275c17.531586-40.342069 45.594483-80.67531 80.666483-115.74731 35.072-35.080828 75.414069-63.134897 115.74731-80.67531l-66.648276-66.648276 29.819586-29.801931 50.855725 50.846896c21.044966 21.053793 54.369103 21.053793 73.657379 0l219.215448-219.20662c19.288276-19.288276 19.288276-52.612414-1.75669-71.90069z'
    // const planePath = 'image:///static/globe/satell.svg'

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
      }, {
        date: '5',
        name: '星敏Vy',
        address: '星敏',
        result: '严重',
        method: '调试XXX'
      }],
      globe: {
        title: {
          text: '卫星姿态实时监控',
          textStyle: {
            color: '#fff'
          },
          left: 'center'
        },
        globe: {
          globeRadius: 10,
          baseTexture: '/static/globe/world.topo.bathy.200401.jpg',
          displacementQuality: 'medium',
          viewControl: {
            autoRotateSpeed: 5,
            targetCoord: [50, 0] // 北京坐标
          }
        }
      },
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
            data: ['校正速度Vx', '校正速度Vy', '校正速度Vz', '壳体温度1', '壳体温度2', '校正时间', '轴温1', '轴温2'],
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
        color: myColor,
        series: [
          {
            name: '条',
            type: 'bar',
            data: [2, 3, 1, 4, 1, 1, 2, 4],
            // 柱子的宽度
            barWidth: 20,
            yAxisIndex: 0,
            // 柱子设为圆角
            itemStyle: {
              barBorderRadius: 10
            },
            label: {
              normal: {
                show: true,
                // 图形内显示
                position: 'right',
                // 文字的显示格式
                // {c}会自动解析为 series数据里面的数据
                formatter: '{c}'
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
        visualMap: [{
          show: false,
          dimension: 1,
          inRange: {
            color: myColor
          }
        }],
        grid3D: {},
        axisLabel: {
          color: '#fff' // 文本颜色
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
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
            color: myColor[0]
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
          min: 80,
          max: 120,
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
        series: [{
          name: '矫正速度Vx',
          data: this.$store.state.first.basicData.healthy.data,
          type: 'line',
          itemStyle: {
            normal: {
              color: myColor[0] // 改变折线点的颜色
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
              color: myColor[1] // 改变折线点的颜色
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
              color: myColor[2] // 改变折线点的颜色
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

<style lang='scss'>
@import 'style/index.scss';

.trackBox {
  .panel.line{
    height: 5.6rem;
    position: relative;
    .satell{
      position: absolute;
      top: 25%;
      left: 8%;
      right: 8%;
      bottom: 18%;
      border: solid 1px #1089E7;
      border-radius: 50%;
      //向上走的动画初始及结尾值
      @keyframes animX{
          0% {left: -20px;}
        100% {left: 280px;}
      }
      @keyframes animY{
            0% {top: -100px;}
          100% {top: 100px;}
      }
      img {
        width: 8%;
        position: absolute;
        top: 0;
        left: 0;
        animation: animX 4s cubic-bezier(0.36,0,0.64,1) -2s infinite alternate, animY 4s cubic-bezier(0.36,0,0.64,1)  0s infinite alternate;
      }
    }
  }
  .panel.map {
    width: 100%;
    height: 11.4rem;
  }
  .el-table.tableData {
    background: none;
    th, tr{
      background: none;
    }
  }
}
</style>
