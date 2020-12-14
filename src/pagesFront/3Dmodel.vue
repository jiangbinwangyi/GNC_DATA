<template>
  <!-- 页面主体 -->
  <el-row style="width: 100%" :gutter="20" class="modelBox">
    <el-col :span="2">
      <div class="partBox">
        <div class="panel" style="height: 11.6rem;">
          <el-row>
            <div v-for="(item, index) in part" :key="index" style="position:relative; padding: .2rem; height: 1.6rem" @click="model='bujian'">
              <div v-if="item.isErr" class="boxBg" />
              <p style="position: relative; z-index: 9">{{ item.name }}</p>
              <img v-show="item.pic" :src="item.pic" alt="帆板" style="height: calc(100% - 25px);position: relative; z-index: 10">
            </div>
          </el-row>
        </div>
      </div>
    </el-col>
    <el-col :span="14">
      <!-- 地图模块 -->
      <div class="panel map" style="height: 11.6rem; text-align: center">
        <div style="text-align: right; margin-bottom: .2rem">
          <el-button size="mini" type="danger">BD2G01</el-button>
          <el-button size="mini" type="primary">BD2G02</el-button>
          <el-button size="mini" type="primary">BD2G03</el-button>
          <el-button size="mini" type="primary">BD2G04</el-button>
          <el-button size="mini" type="primary">BD2G05</el-button>
          <el-button size="mini" type="primary">BD2G06</el-button>
        </div>
        <div v-if="model === '3d'" style="height: 100%">
          <model-obj src="/static/3d/file.obj" mtl="/static/3d/file.mtl" :rotation="rotation" :scale="{ x: 1.6, y: 1.6, z: 1.6 }" :background-alpha="0" style="height: 90%" @on-load="modelOnLoad" />
          <el-button type="danger" style="transform: scale(1.4)">生成故障诊断报告</el-button>
        </div>
        <div v-else-if="model === 'zhishi'">
          <img src="@/assets/images/zhishi.png" style="width: 90%; height: auto">
          <el-button type="primary" @click="model='3d'">返回3D模型</el-button>
        </div>
        <div v-else-if="model = 'bujian'">
          <img src="@/assets/images/bujian.png" style="width: 100%; height: 100%">
          <el-button type="primary" @click="model='3d'">返回3D模型</el-button>
      </div>
      </div>
    </el-col>
    <el-col :span="8">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="panel map" style="height: 1.3rem">
            <h2>故障时间</h2>
            <p class="info">2020-12-31 17:30:00.000</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="panel map" style="height: 1.3rem">
            <v-chart :options="option" autoresize class="echartBox" style="display: none" />
            <h2>故障模式</h2>
            <p class="info">星箭分离66s左右，双太阳翼未展开</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="panel map" style="height: 1.3rem">
            <v-chart :options="option" autoresize class="echartBox" style="display: none" />
            <h2>故障判断</h2>
            <p class="info">N01009+Y 太阳翼帆板信号故障指示</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="panel map" style="height: 1.3rem">
            <v-chart :options="option" autoresize class="echartBox" style="display: none" />
            <h2>故障危害</h2>
            <p class="info">太阳翼帆板未展开，会导致蓄电池过放电，任务可能失败。</p>
            <p class="info">严重程度：严重</p>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="panel map" style="height: 2rem">
            <v-chart :options="option" autoresize class="echartBox" style="display: none" />
            <h2>处置建议</h2>
            <p class="info">1、 发K2“火工品母线通” 2、 发K1“火工品起爆”</p>
            <p class="info">若指令无效，向上级请示命令</p>
          </div>
        </el-col>
      </el-row>
      <div class="panel map" style="height: 6.4rem">
        <h2>知识图谱</h2>
        <img src="@/assets/images/zhishi.png" style="width: 100%; height: auto; padding-top: .5rem" @dblclick="model = 'zhishi'">
      </div>
    </el-col>
  </el-row>
</template>

<script>
import 'three'
import { ModelObj } from 'vue-3d-model'
import { mapState } from 'vuex'

import ECharts from 'vue-echarts'
import 'echarts'

// import china from './china.js'
// ECharts.registerMap('china', china)
import chinaMap from './china.json'
ECharts.registerMap('china', chinaMap)

const colors = ['#8B78F6', '#286c81', '#56D0E3', '#8B78F6', '#247af5']
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

export default {
  name: '',
  components: {
    ModelObj,
    'v-chart': ECharts
  },
  data() {
    var labelRight = {
      position: 'left',
      color: '#ccc'
    }
    var labelLeft = {
      position: 'right',
      color: '#ccc'
    }
    return {
      model: '3d',
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
      },
      part: [{
        name: '太阳帆板',
        pic: '/static/part/tyfb.png',
        isErr: true
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
        name: '飞行器发动机',
        pic: '/static/part/fdj.png',
        isErr: false
      }, {
        name: '太阳敏感器',
        pic: '/static/part/tymgq.png',
        isErr: false
      }, {
        name: '星敏感器',
        pic: '/static/part/xmgq.png',
        isErr: false
      }],
      tableData: [{
        date: '1',
        name: '电流',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '2',
        name: '电压',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '3',
        name: '温度',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '4',
        name: '标称角动量',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '一般',
        method: '调试XXX'
      }, {
        date: '2',
        name: '电压',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '3',
        name: '温度',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '4',
        name: '标称角动量',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '一般',
        method: '调试XXX'
      }, {
        date: '2',
        name: '电压',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '3',
        name: '温度',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '4',
        name: '标称角动量',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '一般',
        method: '调试XXX'
      }, {
        date: '2',
        name: '电压',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '3',
        name: '温度',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '4',
        name: '标称角动量',
        address: '动量轮',
        time: '2020-11-20 05:08:16',
        result: '一般',
        method: '调试XXX'
      }],
      nowTime: '',
      count: {
        total: 235411
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      dialogVisible1: false,
      dialogVisible2: false,
      barOption2: {
        title: {
          textStyle: {
            color: '#fff'
          },
          text: '星敏感器校正速度累计故障数',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          bottom: '0',
          show: true,
          containLabel: true // 包含刻度文字在内
        },
        axisLabel: {
          color: '#fff' // 文本颜色
        },
        xAxis: {
          type: 'value',
          position: 'top',
          splitLine: {
            lineStyle: {
              type: 'dashed'
              // color: '#ccc'
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          data: ['信号10', '信号9', '信号8', '信号7', '信号6', '信号5', '信号4', '信号3', '信号2', '信号1']
        },
        series: [
          {
            name: '信号监测值',
            type: 'bar',
            label: {
              show: true,
              formatter: '{b}'
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  var index_color = params.value
                  if (index_color >= 0) {
                    return '#56D0E3'
                  } else {
                    return '#F57474'
                  }
                }
              }
            },
            data: [
              { value: -0.07, label: labelRight },
              { value: 0.2, label: labelLeft },
              { value: 0.44, label: labelLeft },
              { value: -0.09, label: labelRight },
              { value: 0.08, label: labelLeft },
              { value: -0.36, label: labelRight },
              { value: 0.47, label: labelLeft },
              { value: 0.18, label: labelLeft },
              { value: -0.23, label: labelRight },
              { value: -0.17, label: labelRight }
            ]
          }
        ]
      }
      // option: {
      //   tooltip: {
      //     trigger: 'item',
      //     triggerOn: 'mousemove'
      //   },
      //   series: [
      //     {
      //       type: 'tree', // 设置树图
      //       name: 'xxxx',
      //       data: [data],
      //       layout: 'orthogona', // 正交布局（水平布局）
      //       symbol: 'rect', // 矩形标记
      //       symbolSize: [88, 30], // 标记大小
      //       initialTreeDepth: 2, // 树图层级
      //       label: {
      //         normal: {
      //           position: 'right',
      //           verticalAlign: 'middle',
      //           fontSize: 12,
      //           offset: [-86, 0], // 文本偏移量
      //           color: '#00173d',
      //           align: 'left'
      //         }
      //       },
      //       lineStyle: {
      //         curveness: 0.5 // 树图边的曲度
      //       }
      //     }
      //   ]
      // }
    }
  },
  computed: {
    ...mapState('first', ['basicData'])
  },
  methods: {
    modelOnLoad() {
      this.rotate()
    },
    rotate() {
      this.rotation.y += 0.003
      requestAnimationFrame(this.rotate)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="scss">
@import 'style/index.scss';
.mainbox .modelBox  .panel h2{
  font-size: 0.22rem;
}
.partBox{
  width: 100%;
  display: inline-block;
  vertical-align: top;
  .panel{
    padding: .2rem 0;
    text-align: center;
    position: relative;
    height: 2rem;
    margin: 0;
    img {
      height: 80%;
      width: auto;
    }
  }
  p {
    font-size: 16px;
    color: #fff;
    line-height: 1;
    margin-bottom: 10px;
  }
  .boxBg{
    position: absolute;
    top: 0;
    left: .2rem;
    right: .2rem;
    bottom: 0;
    border: solid 3px #F57474;
    background: #F57474;
    // animation: radius 1s ease-out infinite forwards alternate;
  }
}
.textBox{
  text-align: center;
  font-size: 20px;
  line-height: 3;
}
.line2 .textBox{
  color: #F57474;
}
.pie2 .textBox{
  color: #56D0E3;
}
.el-table.tableData {
    background: none;
    th, tr{
      background: none;
    }
  }
</style>
