<template>
  <div class="home">
    <el-row :gutter="10">
      <el-col :span="10">
        <el-row :gutter="10" style="margin-bottom: .15rem">
          <el-col :span="12">
            <el-card class="lineBox" shadow="never">
              <el-table
                :data="tableData"
                style="width: 100%"
              >
                <el-table-column
                  prop="date"
                  label="装备各车"
                />
              </el-table>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="lineBox" shadow="never">
              <el-table
                :data="tableData1"
                style="width: 100%"
              >
                <el-table-column
                  prop="date"
                  label="装备型号"
                />
              </el-table>
            </el-card>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: .15rem">
          <el-card class="lineBox" shadow="never">
            <el-table
              :data="tableData2"
              style="width: 100%"
            >
              <el-table-column
                prop="date"
                label="统计类别"
              />
              <el-table-column
                prop="name"
                label="数量"
              />
              <el-table-column
                prop="address"
                label="数量占比"
              />
            </el-table>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="14">
        <el-row style="margin-bottom: .15rem">
          <el-card class="lineBox" shadow="never">
            <div slot="header">
              <span><i class="el-icon-s-data" /> 作战单位位置</span>
            </div>
            <div style="height: 6.9rem">
              <v-chart :options="option3" autoresize class="echartBox" @click="warManage($event)" />
            </div>
          </el-card>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-card class="lineBox" shadow="never">
              <div slot="header">
                <span><i class="el-icon-s-data" /> 装备状态数量统计</span>
              </div>
              <div style="height: 3.2rem">
                <v-chart :options="option1" autoresize class="echartBox" />
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="lineBox" shadow="never">
              <div slot="header">
                <span><i class="el-icon-s-data" /> 装备状态数量统计</span>
              </div>
              <div style="height: 3.2rem">
                <v-chart :options="option2" autoresize class="echartBox" />
              </div>
            </el-card>
          </el-col>
        </el-row>
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
      tableData: [{
        date: 'FS车'
      }, {
        date: 'BB车'
      }, {
        date: '指挥车'
      }, {
        date: '警戒车'
      }, {
        date: '通信车'
      }],
      tableData1: [{
        date: 'XX-15'
      }, {
        date: 'XX-16'
      }, {
        date: 'XX-17'
      }, {
        date: 'XX-18'
      }, {
        date: 'XX-19'
      }],
      tableData2: [{
        date: '装备总计',
        name: 'XXX',
        address: 'XX%'
      }, {
        date: '完好装备',
        name: 'XXX',
        address: 'XX%'
      }, {
        date: '战备值班',
        name: 'XXX',
        address: 'XX%'
      }, {
        date: '已封存',
        name: 'XXX',
        address: 'XX%'
      }, {
        date: '正在训练',
        name: 'XXX',
        address: 'XX%'
      }, {
        date: '维修保障',
        name: 'XXX',
        address: 'XX%'
      }],
      tableData3: [{
        date: '故障XX1',
        name: '严重',
        address: 'XXX',
        date1: 'XXX%',
        name1: 'XXX%'
      }, {
        date: '故障XX2',
        name: '中度',
        address: 'XXX',
        date1: 'XXX%',
        name1: 'XXX%'
      }, {
        date: '故障XX3',
        name: '轻度',
        address: 'XXX',
        date1: 'XXX%',
        name1: 'XXX%'
      }],
      tableData4: [{
        date: '部件XX1',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX%',
        name1: '严重'
      }, {
        date: '部件XX2',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX%',
        name1: '中度'
      }, {
        date: '部件XX3',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX%',
        name1: '轻度'
      }],
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
