<template>
  <div class="panel relationBox">
    <v-chart :options="option" class="echartBox" />
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts'
import 'echarts-gl'

// 采用关系图实现的版本地址，欢迎前往查看，效果比此图更好，谢谢
// https://gallery.echartsjs.com/editor.html?c=xO6bpzhc_c

const colors = ['#8B78F6', '#F57474', '#56D0E3', '#F8B448', '#1089E7']
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
  console.log(arr)
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
    'v-chart': ECharts
  },
  data() {
    return {
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
  }
}
</script>

<style lang="scss" scoped>
@import 'style/index.scss';

.mainbox{
  .panel.relationBox{
    width: 100%;
    height: 12rem;
  }
}

</style>
