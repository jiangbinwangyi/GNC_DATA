<template>
  <!-- 页面主体 -->
  <div class="basicBox" style="width: 100%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="7">
        <div class="panel pie" style="height: 5rem">
          <h2>飞行器实时动作显示</h2>
          <div style="text-align: center; padding-top: 10px">
            <el-button size="mini" type="danger">BD2G01</el-button>
            <el-button size="mini" type="primary">BD2G02</el-button>
            <el-button size="mini" type="primary">BD2G03</el-button>
            <el-button size="mini" type="primary">BD2G04</el-button>
            <el-button size="mini" type="primary">BD2G05</el-button>
            <el-button size="mini" type="primary">BD2G06</el-button>
          </div>
          <el-row>
            <el-col :span="6" style="height: 100%;">
              <el-row :gutter="10" class="partBox">
                <el-col v-for="(item, index) in part" :key="index" :span="12" style="position:relative; margin-top: .1rem; padding: .05rem 0; border:solid 1px #333; min-height: .84rem">
                  <div v-if="item.isErr && failStatus" class="boxBg" />
                  <p style="position: relative; z-index: 9">{{ item.name }}</p>
                  <img v-show="item.pic" :src="item.pic" alt="帆板" style="position: relative; z-index: 10;" @click="visibleShow = index === 0">
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="18" style="padding-top: 1rem">
              <model-obj src="/static/3d/file12.obj" mtl="/static/3d/file12.mtl" :rotation="rotation" :scale="{ x: 1.6, y: 1.6, z: 1.6 }" :background-alpha="0" @on-load="modelOnLoad" />
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="10" class="timeBox">
        <div class="panel pie" style="height: 5rem; text-align: center">
          <h2>飞行器星下点轨迹</h2>
          <div style="text-align: center; padding-top: 10px; line-height: 0">
            <el-button size="mini" type="danger">BD2G01</el-button>
            <el-button size="mini" type="primary">BD2G02</el-button>
            <el-button size="mini" type="primary">BD2G03</el-button>
            <el-button size="mini" type="primary">BD2G04</el-button>
            <el-button size="mini" type="primary">BD2G05</el-button>
            <el-button size="mini" type="primary">BD2G06</el-button>
          </div>
          <div style="position: relative;">
            <img src="@/assets/images/guiji.png" style="width: 100%; height: auto; padding-top: 20px">
            <img src="static/globe/satell.svg" style="position: absolute; top: -10%; right: 19%; width: 20px" alt="">
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="panel map" style="height: 5rem">
          <h2>飞行器运行轨道实时显示</h2>
          <div style="text-align: center; padding-top: 10px">
            <el-button size="mini" type="danger">BD2G01</el-button>
            <el-button size="mini" type="primary">BD2G02</el-button>
            <el-button size="mini" type="primary">BD2G03</el-button>
            <el-button size="mini" type="primary">BD2G04</el-button>
            <el-button size="mini" type="primary">BD2G05</el-button>
            <el-button size="mini" type="primary">BD2G06</el-button>
          </div>
          <div class="satell" style="top: 26%; bottom: 17%; border-color: #666;" />
          <div class="satell">
            <img src="static/globe/satell.svg" alt="">
          </div>
          <v-chart
            :options="globe"
            autoresize
            style="height: 100%;width:100%;position:relative;"
          />
        </div>
      </el-col>
    </el-row>
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="7">
        <div class="panel bar" style="height: 6.5rem">
          <h2>飞行器实时健康状态</h2>
          <el-row class="xinhao">
            <el-col :span="8">
              <div>
                <img v-show="failStatus" src="@/assets/images/xinhao_red.png" alt="" class="xinhao_error">
                <img src="@/assets/images/xinhao_gray.png" alt="">
                <img src="@/assets/images/xinhao_gray.png" alt="">
                <img src="@/assets/images/xinhao_gray.png" alt="">
                <img src="@/assets/images/xinhao_gray.png" alt="">
                <img v-show="!failStatus" src="@/assets/images/xinhao_green.png" alt="">
              </div>
              <p>BD2G01</p>
            </el-col>
            <el-col v-for="item in 11" :key="item" :span="8">
              <div>
                <img src="@/assets/images/xinhao_gray.png" alt="">
                <img src="@/assets/images/xinhao_gray.png" alt="">
                <img src="@/assets/images/xinhao_gray.png" alt="">
                <img src="@/assets/images/xinhao_gray.png" alt="">
                <img src="@/assets/images/xinhao_green.png" alt="">
              </div>
              <p>BD2G0{{ item + 1 }}</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="panel relationBox" style="overflow:hidden">
          <h2 style="float: none; clear: both">飞行器实时运行信息</h2>
          <el-table :data="tableData" :row-class-name="isError">
            <el-table-column
              prop="name"
              label="飞行器"
              width="90"
            />
            <el-table-column
              prop="time"
              label="时间"
              width="190"
            />
            <el-table-column
              prop="info"
              label="信息"
              min-width="180"
            />
          </el-table>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="panel line2" style="height: 6.5rem">
          <h2 style="float: none; clear: both">飞行器实时运行影像</h2>
          <video src="@/assets/video.mp4" autoplay loop muted width="100%" height="100%" />
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="BD2G01 - 飞行器帆板实时信息"
      :visible.sync="visibleShow"
      width="70%"
    >
      <div>
        <el-row style="line-height: 1.8; margin-bottom: .5rem">
          <el-col :span="12" class="xinhao">
            <h3>部件实时状态</h3>
            <img src="@/assets/images/xinhao_red.png" alt="" class="xinhao_error">
            <img src="@/assets/images/xinhao_gray.png" alt="">
            <img src="@/assets/images/xinhao_gray.png" alt="">
            <img src="@/assets/images/xinhao_gray.png" alt="">
            <img src="@/assets/images/xinhao_gray.png" alt="">
          </el-col>
          <el-col :span="12">
            <h3>部件信息</h3>
            <p style="color: #cc0000">时间：2020-01-02 06:30:32 信息：状态 +y帆板工作信号 &nbsp; 0“状态异常”。</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <h3>运行状态分析</h3>
            <v-chart
              :options="radarOption"
              autoresize
              style="height: 5rem;width:100%;position:relative;"
            />
          </el-col>
          <el-col :span="12">
            <h3>实时数据检测</h3>
            <v-chart
              :options="mapOption"
              autoresize
              style="height: 5rem;width:100%;position:relative;"
            />
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'three'
import { ModelObj } from 'vue-3d-model'
import { mapState } from 'vuex'

import ECharts from 'vue-echarts'
import 'echarts'
import 'echarts-gl'
// import china from './china.js1'
// ECharts.registerMap('china', china)
import chinaMap from './china.json'
ECharts.registerMap('china', chinaMap)

const colors = ['#83f574', '#286c81', '#56D0E3', '#83f574', '#247af5']
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
    name: '飞行器',
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

export default {
  components: {
    ModelObj,
    'v-chart': ECharts
  },
  data() {
    const myColor = ['#247af5', '#F8B448', '#56D0E3', '#F57474', '#83f574']
    // function getCirlPoint(x0, y0, r, angle) {
    //   const x1 = x0 + r * Math.cos(angle * Math.PI / 180)
    //   const y1 = y0 + r * Math.sin(angle * Math.PI / 180)
    //   return {
    //     x: x1,
    //     y: y1
    //   }
    // }实时遥测信号知识图谱   遥测信号实时数据曲线图

    return {
      visibleShow: false,
      part: [{
        name: '太阳帆板',
        pic: '/static/part/tyfb.png',
        isErr: true
      }, {
        name: '星敏感器',
        pic: '/static/part/xmgq.png',
        isErr: false
      }, {
        name: '磁力矩器',
        pic: './static/part/cljq.png',
        isErr: false
      }, {
        name: '动量轮',
        pic: '/static/part/dll.png',
        isErr: false
      }, {
        name: '光纤陀螺',
        pic: '/static/part/gxtl.png',
        isErr: false
      }, {
        name: '发动机',
        pic: '/static/part/fdj.png',
        isErr: false
      }, {
        name: '太敏',
        pic: '/static/part/tymgq.png',
        isErr: false
      }, {
        name: '',
        pic: '',
        isErr: false
      }],
      value: '信号一',
      options: [{
        value: '信号一',
        label: '信号一'
      }, {
        value: '信号二',
        label: '信号二'
      }, {
        value: '信号三',
        label: '信号三'
      }],
      count: {
        total: 235411
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      globe: {
        globe: {
          globeRadius: 18,
          baseTexture: '/static/globe/world.topo.bathy.200401.jpg',
          displacementQuality: 'medium',
          viewControl: {
            autoRotateSpeed: 8,
            targetCoord: [50, 0] // 北京坐标
          }
        }
      },
      radarOption: {
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: '+Y展开', max: 1 },
            { name: '-Y展开', max: 1 },
            { name: '方阵电流', max: 1 },
            { name: '母线电压', max: 1 },
            { name: '起爆状态', max: 1 }
          ]
        },
        series: [{
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [0, 1, 1, 1, 1],
              name: '预算分配（Allocated Budget）'
            }
          ]
        }]
      },
      barOption: {
        tooltip: {},
        visualMap: {
          max: 20,
          show: false,
          inRange: { color: myColor }
        },
        xAxis3D: {
          type: 'category',
          axisLabel: {
            color: '#fff'
          },
          data: ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p']
        },
        yAxis3D: {
          type: 'category',
          axisLabel: {
            color: '#fff'
          },
          data: ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday']
        },
        zAxis3D: {
          type: 'value'
        },
        grid3D: {
          boxWidth: 150,
          boxDepth: 60,
          viewControl: {
            // projection: 'orthographic'
          },
          light: {
            main: {
              intensity: 1.2,
              shadow: true
            },
            ambient: {
              intensity: 0.3
            }
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
          },
          animationDelay(idx) {
            return idx * 10 + 100
          },
          emphasis: {
            label: {
              textStyle: {
                fontSize: 20,
                color: '#900'
              }
            },
            itemStyle: {
              color: '#900'
            }
          }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate(idx) {
          return idx * 5
        }
      },
      lineOption: {
        title: {
          left: 'center',
          textStyle: {
            color: '#fff'
          },
          text: '各分系统的故障总量统计'
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
          text: '{c|整体状态健康值\n}{a|' + 88 + '}{c|分}',
          x: 'center',
          y: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 48,
                color: '#29EEF3'
              },
              c: {
                fontSize: 16,
                color: '#ffffff',
                lineHeight: 40
                // padding: [5,0]
              }
            }
          }
        },
        legend: {
          type: 'plain',
          orient: 'vertical',
          right: 0,
          top: '10%',
          align: 'auto',
          data: [{
            name: '涨价后没吃过',
            icon: 'circle'
          }, {
            name: '天天吃',
            icon: 'circle'
          }, {
            name: '三五天吃一次',
            icon: 'circle'
          }, {
            name: '半个月吃一次',
            icon: 'circle'
          }],
          textStyle: {
            color: 'white',
            fontSize: 16,
            padding: [10, 1, 10, 0]
          },
          selectedMode: false
        },
        series: [{
          name: '',
          type: 'pie',
          radius: ['100%', '80%'],
          silent: true,
          clockwise: true,
          startAngle: 90,
          z: 0,
          zlevel: 0,
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: 88,
            name: '',
            itemStyle: {
              normal: {
                color: { // 完成的圆环的颜色
                  colorStops: [{
                    offset: 0,
                    color: '#4FADFD' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#28E8FA' // 100% 处的颜色
                  }]
                }
              }
            }
          },
          {
            value: 100 - 88,
            name: '',
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#173164'
              }
            }
          }]
        },
        {
          name: '',
          type: 'gauge',
          radius: '100%',
          center: ['50%', '50%'],
          startAngle: 0,
          endAngle: 359.9,
          splitNumber: 8,
          hoverAnimation: true,
          axisTick: {
            show: false
          },
          splitLine: {
            length: 60,
            lineStyle: {
              width: 5,
              color: '#061740'
            }
          },
          axisLabel: {
            show: false
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              opacity: 0
            }
          },
          detail: {
            show: false
          },
          data: [{
            value: 0,
            name: ''
          }]
        }]
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
            name: '各分系统监测信号占比',
            type: 'pie',
            radius: ['0', '60'],
            center: ['50%', '50%'],
            label: {
              fontSize: 10,
              position: 'inside'
            },
            data: [
              { value: 501, name: 'GNC分系统' },
              { value: 463, name: '电源分系统' },
              { value: 624, name: '载荷分系统' }
            ]
          }
        ]
      },
      mapOption: {
        color: myColor,
        toolbox: {
          left: 'center',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          top: -100,
          right: 10,
          pieces: [{
            gt: 24.11,
            lte: 24.15,
            color: '#cc0000'
          }, {
            lte: 23.3
          }]
        },
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
          axisLine: {
            show: true
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            color: '#000'
          },
          boundaryGap: false,
          data: ['11-01', '11-02', '11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09', '11-10', '11-11', '11-12', '11-13']
        }],
        yAxis: [{
          type: 'value',
          min: 0,
          max: 30,
          axisLabel: {
            color: '#000'
          }
        }],
        series: [{
          name: '注册总量',
          type: 'line',
          smooth: true, // 是否平滑
          showAllSymbol: true,
          // symbol: 'image://./static/images/guang-circle.png',
          symbol: 'circle',
          symbolSize: 15,
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
            borderColor: '#ccc',
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
          markLine: {
            silent: true,
            data: [{
              yAxis: 23,
              lineStyle: {
                color: '#F57474'
              }
            }]
          },
          data: [22.43, 22.64, 22.42, 22.44, 22.63, 22.57, 22.64, 22.78, 22.13, 22.68, 24.12, 22.78, 22.54, 22.35]
        }]
      }
    }
  },
  computed: {
    ...mapState('first', ['basicData', 'nowTime', 'sunTime', 'failStatus', 'tableData'])
  },
  methods: {
    isError({ row, rowIndex }) {
      if (row.info.indexOf('异常') > 0) {
        return 'table_error'
      } else if (rowIndex === 3) {
        return 'table_warning'
      }
    },
    modelOnLoad() {
      this.rotate()
    },
    rotate() {
      this.rotation.y += 0.003
      this.rotation.z += 0.001
      this.rotation.x += 0.001
      requestAnimationFrame(this.rotate)
    }
  }
}
</script>

<style lang='scss'>
@import 'style/index.scss';

.el-table, .el-table tr, .el-table th, .el-table td{
  background: none;
  color: #fff;
  font-size: 18px;
  padding: .2rem 0;
  &.table_error td{
    color: #F57474;
  }
  &.table_warning td{
    // color: #F8B448
  }
}
.el-table--enable-row-hover .el-table__body tr:hover > td{
  background: none;
}
.mainbox {
  .basicBox{
    .xinhao div {
      padding-top: .3rem;
    }
    .xinhao p{
      font-size: .22rem;
      color: #fff;
      text-align: center;
      line-height: 1;
      padding-top: .15rem;
    }
    .xinhao img{
      width: 24px;
      height: 24px;
      margin: 0 3px;
    }
    @keyframes error {
      0% {
        opacity: .5;
      }
      100% {
        opacity: 1;
      }
    }
    .xinhao_error{
      animation: error .2s ease-in-out infinite alternate;
    }
    .el-button {
      padding: 2px;
    }
    .panel.map {
      width: 100%;
      position: relative;
      .satell{
        position: absolute;
        top: 29%;
        left: 8%;
        right: 8%;
        bottom: 14%;
        border: solid 1px #5098ff;
        border-radius: 50%;
        //向上走的动画初始及结尾值
        @keyframes animX{
            0% {left: -7%;}
          100% {left: 95%;}
        }
        @keyframes animY{
          0% {top: -50%;}
            100% {top: 50%;}
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
    .panel.relationBox {
      width: 100%;
      height: 6.5rem;
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
    .mapChart{
      border: none;
      margin-top: 0rem;
    }
    .el-select{
      float: right;
      position: relative;
      z-index: 10;
      opacity: .8;
      margin: -.52rem .5rem 0 0;
    }
    .timeBox{
      font-size: .47rem;
      height: 3.67rem;
      line-height: 1;
      color: #247af5;
      p {
        text-shadow: 1px 1px rgba($color: #000, $alpha: .5);
        padding-top: 0.8rem;
        font-weight: bold;
        text-align: center;
      }
    }
    .partBox{
      width: 100%;
      display: inline-block;
      vertical-align: top;
      text-align: center;
      img {
        width: 50%;
        height: auto
      }
      p {
        text-align: center;
        font-size: 10px;
        color: #fff;
        line-height: 1;
        margin-bottom: 10px;
      }
      .boxBg{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: solid 3px #F57474;
        background: #F57474;
        // animation: radius 1s ease-out infinite forwards alternate;
      }
    }
  }
}
.el-dialog{
  background:#061940;
  .el-dialog__title, h3{
    color: #fff;
  }
}
</style>
