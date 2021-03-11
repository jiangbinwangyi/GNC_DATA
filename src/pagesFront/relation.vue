<template>
  <!-- 页面主体 -->
  <div class="relationBox">
    <el-row :gutter="20">
      <el-col :span="12">
        <!-- 地图模块 -->
        <div class="panel map" style="height: 11.8rem;">
          <h2>
            基于数据故障诊断
            <div class="ctrl">
              <el-select v-model="metaValue" size="mini" style="display:inline-block;margin-right: .2rem" @change="setOptionMain">
                <el-option
                  v-for="item in metaList"
                  :key="item.metaColumnId"
                  :label="item.metaColumnName"
                  :value="item.metaColumnId"
                />
              </el-select>
              <span style="font-size: .16rem;color: #0091ff"><i class="el-icon-s-order" /> 统计量 </span>
              <el-switch
                v-model="xingxiadian"
                style="display:inline-block;margin-right: .2rem"
                @change="setCount"
              />
              <span style="font-size: .16rem;color: #fbbe2f"><i class="el-icon-warning" /> 异常检测 </span>
              <el-switch
                v-model="isWarning"
                active-color="#fbbe2f"
                style="display:inline-block;margin-right: .2rem"
                @change="setWarning"
              />
              <el-button size="mini" type="primary" @click="isDetails = true">分析详情</el-button>
            </div>
          </h2>
          <div class="main">
            <v-chart :options="optionMain" style="height: 50%;" autoresize class="echartBox" />
            <div style="text-align:center; width:100%; height: 50%" @click="isBig = true">
              <img src="@/assets/images/zhishi.png" alt="" style="height: 100%">
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="panel map" style="height: 11.8rem;">
          <h2>基于规则故障诊断</h2>
          <div class="main">
            <v-chart
              :options="treeOption"
              autoresize
              style="height: 100%;width:100%"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="isBig" custom-class="setDialog2" width="64%" top="1vh">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="查询阶段">
          <el-select v-model="isBigJd">
            <el-option label="空间运行段" value="空间运行段" />
            <el-option label="载入返回段" value="载入返回段" />
            <el-option label="交会捕捉段" value="交会捕捉段" />
          </el-select>
        </el-form-item>
        <el-form-item label="查询实体">
          <el-select v-model="isBigSt">
            <el-option label="GNCC" value="GNCC" />
            <el-option label="接口装置" value="接口装置" />
            <el-option label="GNSS" value="GNSS" />
            <el-option label="GNC" value="GNC" />
            <el-option label="GNC分系统" value="GNC分系统" />
            <el-option label="左V尾舵机" value="左V尾舵机" />
          </el-select>
        </el-form-item>
      </el-form>
      <img src="@/assets/images/zhishi.png" alt="" style="width: 90%;">
    </el-dialog>

    <el-dialog :visible.sync="isDetails" custom-class="setDialog2" width="70%" top="3vh">
      <el-row>
        <el-col :span="12">
          <v-chart
            :options="barOption2"
            autoresize
            style="height: 5.8rem;width:100%"
          />
        </el-col>
        <el-col :span="12">
          <v-chart
            :options="barOption3"
            autoresize
            style="height: 5.8rem;width:100%"
          />
        </el-col>
        <el-col :span="12">
          <v-chart
            :options="barOption4"
            autoresize
            style="height: 5.8rem;width:100%"
          />
        </el-col>
        <el-col :span="12">
          <v-chart
            :options="barOption5"
            autoresize
            style="height: 5.8rem;width:100%"
          />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

import ECharts from 'vue-echarts'
import 'echarts'
import 'echarts-gl'
import 'element-ui'

// import china from './china.js244'
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
    const myColor = ['#247af5', '#24cf43', '#56D0E3', '#fbbe2f', '#F57474']

    return {
      isDetails: false,
      isBig: false,
      isBigJd: '',
      isBigSt: '',
      isSmooth: false,
      isWarning: false,
      xingxiadian: false,
      dataJson: [],
      tableList: [],
      metaValue: '288',
      treeOption: {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [{
              'name': '星箭分类66s左右双太阳翼未展开（||）',
              'children': [
                {
                  'name': '压点开关FL3、FL4任一对地短路或同时开路||火工品母线未接通（&&）',
                  'children': [
                    { 'name': 'T>66s&&N01009+Y=0', 'value': 17011 },
                    { 'name': 'T>66s&&N01010-Y=0', 'value': 17012 },
                    { 'name': 'T>66s&&V01033=0', 'value': 17013 },
                    { 'name': 'T>66s&&N01006=0', 'value': 17014 }
                  ]
                },
                {
                  'name': '火工品起爆开关未接通（&&）',
                  'value': 2,
                  'children': [
                    { 'name': 'T>66s&&N01009+Y=0', 'value': 2 },
                    { 'name': 'T>66s&&N01010-Y=0', 'value': 5842 },
                    { 'name': 'T>66s&&V01034=0', 'value': 5843 },
                    { 'name': 'T>66s&&N01006=2A', 'value': 1041 }
                  ]
                },
                {
                  'name': '压缩释放机构故障||点火器故障||切割器故障（&&）',
                  'children': [
                    { 'name': 'T>66s&&N01009+Y=0', 'value': 1758 },
                    { 'name': 'T>66s&&N01010-Y=0', 'value': 1759 },
                    { 'name': 'T>66s&&V01033=23V', 'value': 2165 },
                    { 'name': 'T>66s&&V01034=1', 'value': 586 },
                    { 'name': 'T>66s&&N01006=0A', 'value': 3331 }
                  ]
                }
              ]
            }],
            top: '0',
            left: '14%',
            bottom: '0',
            right: '14%',
            symbolSize: 1,
            roam: true,
            label: {
              position: 'inside',
              verticalAlign: 'middle',
              align: 'center',
              fontSize: 12,
              backgroundColor: '#fff',
              color: '#fff',
              formatter(param) {
                console.log(11111, param)
                let name = ''
                const len = 21
                for (let i = 0; i < (param.name.length + len); i += len) {
                  if (param.name.substring(i, i + len)) {
                    if (i > 0) {
                      name += '\n'
                    }
                    name += param.name.substring(i, i + len)
                  }
                }
                const result = param.value < 100 ? `{b|${name}}` : `{a|${name}}`
                return [result].join('\n')
              },
              rich: {
                a: {
                  color: '#0091ff',
                  padding: 10,
                  lineHeight: 20
                },
                b: {
                  color: '#fff',
                  padding: 10,
                  backgroundColor: '#F57474',
                  lineHeight: 20
                }
              }
            },
            leaves: {
              label: {}
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      },
      nowTime: '',
      count: {
        total: 235411
      },
      barOption4: null,
      pieOption: null,
      barOption2: null,
      barOption3: null,
      barOption5: null,
      optionDefault: {
        title: {
          text: '',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          name: '时间',
          data: [],
          boundaryGap: false,
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
            color: '#fff',
            fontSize: '12'
          }
        },
        grid: [{
          left: 50,
          right: 70,
          bottom: '16%',
          containLabel: true
        }],
        color: myColor,
        tooltip: {
          // formatter(params) {
          //   return params[0].value
          // },
          trigger: 'axis',
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
        series: [{
          name: '值',
          type: 'line',
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          smooth: false,
          data: []
        }]
      },
      optionMain: null
    }
  },
  computed: {
    ...mapState('first', ['basicData', 'metaList'])
  },
  created() {
    // this.formInline.metaColumnIds = this.metaList.map(e => e.metaColumnId)
    this.getData().then(res => {
      this.dataJson = res
      const data = require('./data4.json')
      this.dataJson.push({ metaColumnId: '288', tdata: data.map((e, i) => {
        return { [i + 1]: e.tx }
      }).filter((e, i) => i % 2 === 0 && i % 3 === 0 && i % 5 === 0) })
      this.setOptionMain()
    })
    // this.getTimeDomainResult(this.formInline).then(res => {
    //   this.dataList = res
    //   this.setOptionMain()
    // })
  },
  methods: {
    getTreeData() {
      return new Promise((resolve, reject) => {
        resolve(require('./tree.json'))
      })
    },
    setSmooth() {
      if (this.isSmooth) {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.series[0].smooth = true
        this.optionMain = warningOption
      } else {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.series[0].smooth = false
        this.optionMain = warningOption
      }
    },
    setCount() {
      if (this.xingxiadian) {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.series[0].markLine = {
          silent: true,
          precision: 8,
          data: [{
            type: 'max',
            name: '最大值',
            lineStyle: {
              color: '#F57474'
            }
          }, {
            type: 'min',
            name: '最小值',
            lineStyle: {
              color: '#F57474'
            }
          }, {
            type: 'average',
            name: '平均值',
            lineStyle: {
              color: '#24cf43'
            }
          }]
        }
        this.optionMain = warningOption
      } else {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.series[0].markLine = {
          silent: true,
          precision: 8,
          data: []
        }
        this.optionMain = warningOption
      }
    },
    setWarning() {
      if (this.isWarning) {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.visualMap = {
          show: false,
          dimension: 0,
          pieces: [{
            lte: 695,
            color: '#0091ff'
          }, {
            gt: 695,
            lte: 800,
            color: '#fbbe2f'
          }, {
            gt: 800,
            color: '#0091ff'
          }]
        }
        warningOption.series[0].markArea = {
          itemStyle: {
            color: 'rgba(245, 116, 116, 0.1)'
          },
          data: [[{
            name: '异常部分',
            xAxis: this.optionMain.xAxis.data[695]
          }, {
            xAxis: this.optionMain.xAxis.data[800]
          }]]
        }
        this.optionMain = warningOption
      } else {
        const warningOption = JSON.parse(JSON.stringify(this.optionMain))
        warningOption.visualMap = {
          show: false,
          dimension: 0,
          pieces: [{
            lte: 100,
            color: '#0091ff'
          }, {
            gt: 100,
            lte: 200,
            color: '#0091ff'
          }, {
            gt: 200,
            color: '#0091ff'
          }]
        }
        warningOption.series[0].markArea = {
          itemStyle: {
            color: 'rgba(245, 116, 116, 0)'
          },
          data: []
        }
        this.optionMain = warningOption
      }
    },
    setOptionMain() {
      this.getTelemetrySample(this.metaValue).then(response => {
        // 时域分析
        const newSetOption = JSON.parse(JSON.stringify(this.optionDefault))
        response.forEach(e => {
          newSetOption.xAxis.data.push(Object.keys(e)[0])
          newSetOption.series[0].data.push(Object.values(e)[0])
        })
        this.optionMain = newSetOption

        // 一阶
        const newSetOption2 = JSON.parse(JSON.stringify(this.optionMain))
        newSetOption2.series[0].data = this.optionMain.series[0].data.map((e, i) => {
          if (i <= 650) {
            return (parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1
          } else if (i > 650 && i < 700) {
            return (parseFloat(Math.random().toFixed(2)) * 8 + 7) / 50 - 10
          } else {
            return (parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1
          }
        })
        newSetOption2.grid[0].bottom = '22%'
        newSetOption2.title.text = '1阶差分分析'
        this.barOption3 = newSetOption2
        // 移动方差
        const newSetOption3 = JSON.parse(JSON.stringify(this.optionMain))
        newSetOption3.series[0].data = this.optionMain.series[0].data.map((e, i) => {
          if (i <= 110) {
            return -((parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1)
          } else if (i > 650 && i < 700) {
            return -((parseFloat(Math.random().toFixed(2)) * 8 + 7) / 50 - 10)
          } else {
            return -((parseFloat(Math.random().toFixed(2)) * 2) / 20 - 1)
          }
        })
        newSetOption3.grid[0].bottom = '22%'
        newSetOption3.title.text = '移动方差分析'
        this.barOption4 = newSetOption3

        const newSetOption4 = JSON.parse(JSON.stringify(this.optionDefault))
        newSetOption4.xAxis.data = [1, 2, 3, 4, 5, 6, 7]
        newSetOption4.series[0].type = 'bar'
        const d = this.metaList.findIndex(e => e.metaColumnId === this.metaValue)
        const num1 = d * 80 + 1500
        const num2 = d * 30 + 200
        const num3 = d * 3 + 12
        newSetOption4.series[0].data = [num1, num2, num3, 1, 1, 0, 0]
        newSetOption4.grid[0].bottom = '22%'
        newSetOption4.xAxis.boundaryGap = true
        newSetOption4.title.text = '小波包分解系数能量'
        this.barOption5 = newSetOption4
      })
      // 频域分析
      this.getFFTMainResult().then(response => {
        let dataList = {
          FrequencyAmplitude: []
        }
        if (this.metaValue === '288') {
          const data = require('./data5.json')
          dataList.FrequencyAmplitude = data.map((e, i) => {
            return parseFloat(e.FFT_x)
          })
        } else {
          dataList = response.find(e => e.metaColumnId === this.metaValue)
        }
        const newSetOption = JSON.parse(JSON.stringify(this.optionDefault))
        newSetOption.xAxis.data = Object.keys(dataList.FrequencyAmplitude)
        newSetOption.series[0].data = Object.values(dataList.FrequencyAmplitude)
        newSetOption.grid[0].bottom = '20%'
        newSetOption.title.text = 'FFT频域分析'
        this.barOption2 = newSetOption
      })
    },
    getData() {
      return new Promise((resolve, reject) => {
        const data = require('./data.json')
        resolve(data)
      })
    },
    // 获取遥测工程值数据
    getTelemetrySample(id) {
      return new Promise((resolve, reject) => {
        const data = this.dataJson.find(e => {
          return e.metaColumnId === id
        }).tdata
        resolve(data)
      })
    },
    // 时域分析返回数据
    getTimeDomainResult(id) {
      this.dataList = this.dataJson.find(e => {
        return e.metaColumnId === id
      }).tdata
    },
    // 获取主要的FFT值
    getFFTMainResult() {
      return new Promise((resolve, reject) => {
        const data = require('./data2.json')
        resolve(data)
      })
    },
    ...mapMutations('first', ['setBasicData', 'setBarData'])
  }
}
</script>

<style lang="scss">
@import 'style/index.scss';
.relationBox{
  width: 100%;
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
.setDialog2 {
  background: #010101;
}
</style>
