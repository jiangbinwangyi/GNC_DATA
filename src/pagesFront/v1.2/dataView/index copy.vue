<template>
  <div class="home">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-row style="margin-bottom: .15rem">
          <el-card class="lineBox" shadow="never">
            <div slot="header">
              <span><i class="el-icon-s-data" /> 装备状态数量统计</span>
            </div>
            <div style="height: 5rem">
              <v-chart :options="option1" autoresize class="echartBox" />
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="lineBox" shadow="never">
            <div slot="header">
              <span><i class="el-icon-s-data" /> 装备状态占比统计</span>
            </div>
            <div style="height: 5rem">
              <v-chart :options="option2" autoresize class="echartBox" />
            </div>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="10" class="dataViewNumber" style="margin-bottom: .15rem;">
          <el-col :span="8">
            <el-card class="lineBox" shadow="never">装备完好率<strong>98.5%</strong></el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="lineBox" shadow="never">装备值班率<strong>66.3%</strong></el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="lineBox" shadow="never">装备可靠度<strong>93.5%</strong></el-card>
          </el-col>
        </el-row>
        <el-card class="lineBox" shadow="never">
          <div slot="header">
            <span><i class="el-icon-s-data" /> 作战单位位置</span>
          </div>
          <div style="height: 9.84rem">
            <v-chart :options="option3" autoresize class="echartBox" @click="warManage($event)" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'

import chinaMap from '../../china.json'
ECharts.registerMap('china', chinaMap)

import map from '../../data/map'

export default {
  data() {
    return {
      option1: {
        grid: {
          left: '3%',
          bottom: '8%',
          right: '3%'
        },
        legend: {},
        tooltip: {},
        toolbox: {
          iconStyle: {
            color: '#fff'
          },
          feature: {
            magicType: {
              type: ['stack', 'tiled']
            }
          }
        },
        dataset: {
          source: [
            ['product', 'XX-X1型', 'XX-X2型', 'XX-X3型', 'XX-X4型'],
            ['战备值班', 86, 92, 88, 97],
            ['维修保障', 22, 13, 10, 13],
            ['训练', 61, 44, 36, 42],
            ['封存', 26, 67, 79, 86]
          ]
        },
        xAxis: { type: 'category', gridIndex: 0 },
        yAxis: { gridIndex: 0 },
        series: [
          // These series are in the second grid.
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' }
        ]
      },
      option2: {
        tooltip: {},
        title: [{
          subtext: 'XX-X1型',
          left: '25%',
          top: '40%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }, {
          subtext: 'XX-X2型',
          left: '75%',
          top: '40%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }, {
          subtext: 'XX-X3型',
          left: '25%',
          top: '90%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }, {
          subtext: 'XX-X4型',
          left: '75%',
          top: '90%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }],
        series: [{
          type: 'pie',
          radius: '100%',
          center: ['50%', '50%'],
          data: [{
            name: '战备值班',
            value: 70
          }, {
            name: '维修保障',
            value: 68
          }, {
            name: '训练',
            value: 48
          }, {
            name: '封存',
            value: 40
          }],
          animation: false,
          label: {
            position: 'inner',
            alignTo: 'none',
            bleedMargin: 5
          },
          left: 0,
          right: '50%',
          top: 0,
          bottom: '60%'
        }, {
          type: 'pie',
          radius: '100%',
          center: ['50%', '50%'],
          data: [{
            name: '战备值班',
            value: 70
          }, {
            name: '维修保障',
            value: 68
          }, {
            name: '训练',
            value: 48
          }, {
            name: '封存',
            value: 40
          }],
          animation: false,
          label: {
            position: 'inner',
            alignTo: 'labelLine',
            bleedMargin: 5
          },
          left: '50%',
          right: 0,
          top: 0,
          bottom: '60%'
        }, {
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          data: [{
            name: '战备值班',
            value: 70
          }, {
            name: '维修保障',
            value: 68
          }, {
            name: '训练',
            value: 48
          }, {
            name: '封存',
            value: 40
          }],
          animation: false,
          label: {
            position: 'inner',
            alignTo: 'edge',
            margin: 20
          },
          left: 0,
          right: '50%',
          top: '40%',
          bottom: 0
        }, {
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          data: [{
            name: '战备值班',
            value: 70
          }, {
            name: '维修保障',
            value: 68
          }, {
            name: '训练',
            value: 48
          }, {
            name: '封存',
            value: 40
          }],
          animation: false,
          label: {
            position: 'inner',
            alignTo: 'edge',
            margin: 20
          },
          left: '50%',
          right: 0,
          top: '40%',
          bottom: 0
        }]
      },
      option3: map
    }
  },
  methods: {
    warManage(e) {
      this.$router.push({ path: '/dataView/birgade', query: { name: e.data.area.name }})
    }
  }
}
</script>

<style lang="scss" scoped>
.dataViewNumber{
  font-size: .25rem;
  line-height: .7rem;
  .el-card{
    color: #fff;
    text-align: center;
    strong{
      font-size: .5rem;
      color: #2b3c1b;
      padding-left: .2rem;
    }
  }
}
.home {
  width: 100%;
  .el-button{
    display: block;
    margin: .6rem auto;
    width: 6rem;
    font-size: .4rem;
    color: #fff;
    background: #415c29;
    padding: .2rem 0;
    border: solid 1px #2b3c1b;
    img {
      width: .8rem;
      vertical-align: middle;
      margin-right: .4rem;
    }
    &:hover{
      background: #4b6b2f;
    }
    &:active{
      background: #415c29;
    }
  }
}
</style>
