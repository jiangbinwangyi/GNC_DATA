<template>
  <!-- 页面主体 -->
  <el-row style="width: 100%" :gutter="20" class="relationBox">
    <el-col :span="6">
      <div class="panel">
        <v-chart :options="barOption" class="echartBox" />
      </div>
      <div class="panel">
        <v-chart :options="pieOption" class="echartBox" />
      </div>
    </el-col>
    <el-col :span="12">
      <!-- 地图模块 -->
      <div class="map">
        <v-chart :options="option" autoresize class="echartBox" />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="panel">
        <v-chart :options="barOption2" class="echartBox" />
      </div>
      <div class="panel">
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

const colors = ['#8B78F6', '#286c81', '#56D0E3', '#8B78F6', '#1089E7']
const parts = [{
  name: '帆板',
  children: ['轴温1', '轴温2', '主份电机电流1', '主份电机电流2', '备份电机电流1', '备份电机电流2', '壳体温度1', '壳体温度2']
}, {
  name: '惯性姿态敏感器',
  children: ['G1马达电流遥测', 'G2马达电流遥测', 'G1温度遥测', 'G2温度遥测', 'G1电源状态遥测', 'G2电源状态遥测']
}, {
  name: '星敏感器',
  children: ['A重启次数', 'B重启次数', '校正时间', '校正速度Vx', '校正速度Vy', '校正速度Vz', '连续无姿态输出6000msht次数', '相对基准滚动角', '相对基准俯仰角', '相对基准偏航角']
}, {
  name: '陀螺',
  children: ['计算A', '计算B', '计算C', '定姿计数器', 'X轴常漂估值', 'Y轴常漂估值', 'Z轴常漂估值', 'X轴指数漂移估值', 'Y轴指数漂移估值', 'Z轴指数漂移估值', '变量N_GyroFault', '变量N_Gyroi1Fault', '变量N_Gyroi2Fault']
}, {
  name: '动量轮',
  children: ['X电机电流遥测', 'Y电机电流遥测', 'Z电机电流遥测', 'S电机电流遥测', 'X轴承温度遥测', 'Y轴承温度遥测', 'Z轴承温度遥测', 'S轴承温度遥测', 'X标称角动量', 'Y标称角动量', 'Z标称角动量', 'S标称角动量', 'X轮剔野计数器', 'X轮诊断次数', 'Y轮剔野计数器', 'Y轮诊断次数']
}]
const getdata = function getData() {
  const data = {
    name: 'GNC系统',
    value: 0,
    children: []
  }
  for (let i = 0; i < parts.length; i++) {
    const obj = {
      name: parts[i].name,
      value: i + 1,
      children: []
    }
    for (let j = 0; j <= parts[i].children.length; j++) {
      const obj2 = {
        name: parts[i].children[j],
        value: 0 + '-' + i + '-' + j
      }
      if (j % 2 === 1) {
        obj2.children = []
        for (let k = 1; k <= 3; k++) {
          const obj3 = {
            name: `节点1-${i}-${j}-${k}`,
            value: 1 + '-' + i + '-' + j + '-' + k
          }
          obj2.children.push(obj3)
        }
      }
      obj.children.push(obj2)
    }

    data.children.push(obj)
  }
  let arr = []
  arr.push(data)
  arr = handle(arr, 0)
  // console.log(arr)
  return arr
}
var handle = function handleData(data, index, color = colors[4]) {
  // index标识第几层
  return data.map((item, index2) => {
    // 计算出颜色
    if (index === 1) {
      color = colors.find((item, eq) => eq === index2)
    }
    // 设置节点大小
    if (index === 0 || index === 1) {
      item.label = {
        position: 'inside'
        // rotate: 0,
        // borderRadius: '50%',
      }
    }
    // 设置label大小
    switch (index) {
      case 0:
        item.symbolSize = 70
        break
      case 1:
        item.symbolSize = 50
        break
      default:
        item.symbolSize = 10
        break
    }
    // 设置线条颜色
    item.lineStyle = { color: color }

    if (item.children) { // 存在子节点
      item.itemStyle = {
        borderColor: color,
        color: color
      }
      item.children = handle(item.children, index + 1, color)
    } else { // 不存在
      item.itemStyle = {
        color: 'transparent',
        borderColor: color
      }
    }
    return item
  })
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
    const myColor = ['#1089E7', '#8B78F6', '#F57474', '#56D0E3', '#F8B448']

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
        title: {
          text: '多信号箱型图',
          textStyle: {
            color: '#fff'
          },
          left: 'center',
          top: '2%'
        },
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
        title: {
          text: '星敏感器校正速度包络图',
          textStyle: {
            color: '#fff'
          },
          left: 'center',
          top: '2%'
        },
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
          bottom: '0',
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
            color: '#4c9bfd' // 文本颜色
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
            name: '包络上限',
            type: 'line',
            smooth: true,
            data: [1.1, 1.3, 1.1, 1.3, 1.1, 1.3, 1.1, 1.4, 1.1, 1.3, 1.1, 1.4]
          },
          {
            name: '校正速度Vy',
            type: 'line',
            smooth: true,
            data: [0.7, 1, 0.8, 1, 0.7, 1, 0.8, 1, 0.7, 1, 0.8, 1]
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
        title: {
          text: '星敏矫正速度监控',
          textStyle: {
            color: '#fff'
          },
          left: 'center',
          top: '2%'
        },
        tooltip: {
          formatter(params, ticket, callback) {
            return Number(params.value[2].toFixed(2))
          }
        },
        visualMap: {
          show: false,
          dimension: 2,
          min: -1,
          max: 1,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        },
        axisLabel: {
          color: '#4c9bfd' // 文本颜色
        },
        axisLine: {
          lineStyle: {
            color: '#4c9bfd'
            // show: false
          }
        },
        xAxis3D: {
          name: '监测次数',
          nameTextStyle: {
            color: '#ccc',
            fontSize: '13'
          },
          type: 'value'
        },
        yAxis3D: {
          name: '检测时间',
          type: 'value',
          nameTextStyle: {
            color: '#ccc',
            fontSize: '13'
          }
        },
        zAxis3D: {
          name: '监测值',
          type: 'value',
          nameTextStyle: {
            color: '#ccc',
            fontSize: '13'
          }
        },
        grid3D: {
          viewControl: {
            // projection: 'orthographic'
          }
        },
        series: [{
          type: 'surface',
          wireframe: {
            // show: false
          },
          equation: {
            x: {
              step: 0.5,
              min: 1,
              max: 5
            },
            y: {
              step: 0.1,
              min: 1,
              max: 11
            },
            z: function(x, y) {
              if (Math.abs(x) < 0 && Math.abs(y) < 11) {
                return '-'
              } else {
                var ZZ = Math.sin(x / 5 * Math.PI) * Math.sin(y / 10 * Math.PI)
                return Number(ZZ)
              }
            }
          }
        }]
      },
      barOption3: {
        title: {
          text: '星敏矫正速度监控',
          textStyle: {
            color: '#fff'
          },
          left: 'center',
          top: '2%'
        },
        tooltip: {
          formatter(params, ticket, callback) {
            return Number(params.value[2].toFixed(2))
          }
        },
        axisLabel: {
          color: '#4c9bfd' // 文本颜色
        },
        axisLine: {
          lineStyle: {
            color: '#4c9bfd'
            // show: false
          }
        },
        xAxis3D: {
          name: '监测次数',
          nameTextStyle: {
            color: '#ccc',
            fontSize: '13'
          },
          type: 'value'
        },
        yAxis3D: {
          name: '检测时间',
          type: 'value',
          nameTextStyle: {
            color: '#ccc',
            fontSize: '13'
          }
        },
        zAxis3D: {
          name: '监测值',
          type: 'value',
          nameTextStyle: {
            color: '#ccc',
            fontSize: '13'
          }
        },
        grid3D: {
          viewControl: {
            // projection: 'orthographic'
          }
        },
        series: [{
          type: 'surface',
          color: myColor[0],
          equation: {
            x: {
              step: 0.5,
              min: 1,
              max: 5
            },
            y: {
              step: 0.5,
              min: 1,
              max: 4
            },
            z(x, y) {
              return Math.sin(x / 8 * Math.PI) * Math.sin(y / 12 * Math.PI)
            }
          }
        }, {
          type: 'surface',
          color: myColor[1],
          equation: {
            x: {
              step: 0.5,
              min: 1,
              max: 5
            },
            y: {
              step: 0.5,
              min: 1,
              max: 3
            },
            z(x, y) {
              return Math.sin(x / 16 * Math.PI) * Math.sin(y / 20 * Math.PI)
            }
          }
        }, {
          type: 'surface',
          color: myColor[2],
          equation: {
            x: {
              step: 0.5,
              min: 1,
              max: 5
            },
            y: {
              step: 0.5,
              min: 1,
              max: 3
            },
            z(x, y) {
              return Math.sin(x / 32 * Math.PI) * Math.sin(y / 36 * Math.PI)
            }
          }
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
        title: {
          text: '各零部件信号故障关系推断',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        type: 'tree',
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          borderWidth: 0.5,
          textStyle: {
            fontSize: 10
          }
        },
        series: [
          {
            type: 'tree',
            // hoverAnimation: true,
            data: getdata(),
            top: '8%',
            bottom: '2%',
            left: 0,
            right: 0,
            layout: 'radial',
            symbol: 'circle',
            animationDurationUpdate: 750,
            expandAndCollapse: true, // 子树折叠和展开的交互，默认打开
            initialTreeDepth: 2,
            roam: true, // 是否开启鼠标缩放和平移漫游。scale/move/true
            focusNodeAdjacency: true,
            itemStyle: {
              borderWidth: 1
            },
            label: { // 标签样式
              color: '#fff',
              fontSize: 10,
              rotate: 0
            },
            lineStyle: {
              width: 1,
              curveness: 0.5
            },
            forceAtlas2: {
              steps: 1,
              stopThreshold: 1,
              jitterTolerence: 10,
              edgeWeight: [0.2, 1],
              gravity: 0,
              edgeWeightInfluence: 1,
              scaling: 0.2
            }
          }
        ]
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
  .panel.map{}
}
.el-table.tableData {
  background: none;
  th, tr{
    background: none;
  }
}
</style>
