<template>
  <div style="height: 100vh;width:100%;overflow:hidden;background:#07172e">
    <el-row style="height: 100%;">
      <el-col :span="24" style="height: 100%;">
        <v-chart
          :options="mapOption"
          autoresize
          style="height: 100%;width:100%"
          @click="test($event)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts'

const baseData = { name: '规模', data: [93.4, 114.2, 146.9, 192.6, 256, 346.1] }
const rowData = [
  { name: '应用层', data: [38.01, 46.71, 62.87, 88.02, 125.70, 182.39] },
  { name: '平台层', data: [17.84, 21.93, 28.20, 36.40, 47.10, 61.61] },
  { name: '基础层', data: [37.64, 45.57, 55.82, 68.18, 83.20, 102.10] }
]

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      isrow: false,
      isPart: false,
      mapOption: {
        title: {
          top: 20,
          left: 20,
          text: '中国工业大数据市场规模分析',
          textStyle: {
            color: '#fff',
            fontSize: 28
          }
        },
        grid: {
          top: 120,
          left: 60,
          right: 60
        },
        legend: {
          top: 20,
          textStyle: {
            color: '#fff',
            fontSize: 24
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['2017年', '2018年', '2019年', '2020年', '2021年', '2022年'],
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              color: '#fff',
              fontSize: '16'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '规模（亿元）',
            min: 0,
            max: 400,
            interval: 50,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {
              color: '#fff'
            }
          },
          {
            type: 'value',
            name: '增长率（%）',
            min: 0,
            max: 0.4,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {
              color: '#fff'
            }
          }
        ],
        series: [
          {
            name: '规模',
            type: 'bar',
            label: {
              show: true,
              fontSize: 18
            },
            color: '#4b4fed',
            data: [93.4, 114.2, 146.9, 192.6, 256, 346.1]
          },
          {
            name: '增长率',
            type: 'line',
            label: {
              show: true,
              fontSize: 18,
              color: '#fff',
              formatter(a) {
                return (a.data * 100).toFixed(2) + '%'
              }
            },
            color: '#ed904b',
            yAxisIndex: 1,
            data: [0.211, 0.223, 0.286, 0.311, 0.329, 0.352]
          }
        ]
      }
    }
  },
  methods: {
    test(e) {
      if (!this.isrow) {
        this.setRow()
        return
      }
      if (!this.isPart) {
        this.setPart()
        return
      }
    },
    setRow() {
      this.isrow = !this.isrow
      this.mapOption.series.splice(0, 1)
      rowData.forEach(item => {
        this.mapOption.series.unshift({
          name: item.name,
          data: item.data,
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
            formatter(a) {
              return (a.data / baseData.data[a.dataIndex] * 100).toFixed(2) + '%'
            },
            fontSize: 18
          }
        })
      })
      this.mapOption.color = ['#058cff', '#00d9b5', '#29d2f5']
    },
    setPart() {
      this.isPart = !this.isPart
      const oldOption = JSON.parse(JSON.stringify(this.mapOption))
      oldOption.series = []
      oldOption.color = []
      oldOption.series.unshift(this.mapOption.series[3])
      const newData = rowData[0].data.map((e, i) => e + rowData[1].data[i])
      this.mapOption.series[2].label.formatter = (a) => {
        return newData[a.dataIndex].toFixed(2)
      }
      this.mapOption.series[2].label.position = 'top'
      oldOption.series.unshift(this.mapOption.series[2])
      this.mapOption.series[1].label.show = false
      oldOption.series.unshift(this.mapOption.series[1])
      // oldOption.series.unshift({
      //   name: '平台层 + 应用层',
      //   data: newData,
      //   type: 'bar',
      //   stack: 'total',
      //   label: {
      //     show: true,
      //     formatter(a) {
      //       return a.data.toFixed(2)
      //     },
      //     fontSize: 18
      //   }
      // })
      oldOption.color.push(this.mapOption.color[0], this.mapOption.color[1])
      this.mapOption = oldOption
    }
  }
}
</script>

<style>
</style>
