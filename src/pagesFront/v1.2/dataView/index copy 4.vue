<template>
  <div class="home">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-row style="margin-bottom: .15rem">
          <el-card class="lineBox" shadow="never">
            <el-table
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column
                prop="date"
                label="装备各车"
              />
              <el-table-column
                prop="date1"
                label="装备型号"
              />
              <el-table-column
                prop="date2"
                label="设备编号"
              />
            </el-table>
          </el-card>
        </el-row>
        <el-row style="margin-bottom: .15rem">
          <el-card class="lineBox" shadow="never">
            <el-table
              :data="tableData2"
              style="width: 100%"
            >
              <el-table-column
                prop="date"
                label="评分项目"
              />
              <el-table-column
                prop="address"
                label="评分"
              />
            </el-table>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-row style="margin-bottom: .15rem">
          <el-card class="lineBox" shadow="never">
            <div slot="header">
              <span><i class="el-icon-s-data" /> 装备状态数量统计</span>
            </div>
            <div style="height: 5.08rem">
              <v-chart :options="option1" autoresize class="echartBox" />
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="lineBox" shadow="never">
            <div slot="header">
              <span><i class="el-icon-s-data" /> 装备状态占比统计</span>
            </div>
            <div style="height: 5.08rem">
              <v-chart :options="option2" autoresize class="echartBox" />
            </div>
          </el-card>
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
        date: 'FS车',
        date1: 'XX-15',
        date2: 'XX-15-001'
      }, {
        date: 'BB车',
        date1: 'XX-16',
        date2: 'XX-15-002'
      }, {
        date: '指挥车',
        date1: 'XX-17',
        date2: 'XX-15-003'
      }, {
        date: '警戒车',
        date1: 'XX-18',
        date2: 'XX-15-004'
      }, {
        date: '通信车',
        date1: 'XX-19',
        date2: 'XX-15-005'
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
        date: '设备状态',
        address: '正常'
      }, {
        date: '健康评分',
        address: '9'
      }, {
        date: '训练评分',
        address: '7'
      }, {
        date: '维修保障评分',
        address: '8'
      }, {
        date: '质量总分',
        address: '8'
      }],
      tableData3: [{
        date: 'XX-15 xxx1',
        name: '正常',
        address: '9',
        date1: '7',
        name1: '保障明细',
        address1: '履历明细'
      }, {
        date: 'XX-16 xxx1',
        name: '待保养',
        address: '9',
        date1: '7',
        name1: '保障明细',
        address1: '履历明细'
      }, {
        date: 'XX-17 xxx1',
        name: '在保养',
        address: '9',
        date1: '7',
        name1: '保障明细',
        address1: '履历明细'
      }, {
        date: 'XX-18 xxx1',
        name: '封存',
        address: '9',
        date1: '7',
        name1: '保障明细',
        address1: '履历明细'
      }, {
        date: 'XX-19 xxx1',
        name: '正常',
        address: '9',
        date1: '7',
        name1: '保障明细',
        address1: '履历明细'
      }, {
        date: 'XX-20 xxx1',
        name: '正常',
        address: '9',
        date1: '7',
        name1: '保障明细',
        address1: '履历明细'
      }, {
        date: 'XX-19 xxx1',
        name: '正常',
        address: '9',
        date1: '7',
        name1: '保障明细',
        address1: '履历明细'
      }, {
        date: 'XX-20 xxx1',
        name: '正常',
        address: '9',
        date1: '7',
        name1: '保障明细',
        address1: '履历明细'
      }],
      tableData4: [{
        date: 'XX17-配件XX1',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX',
        name1: 'XXX'
      }, {
        date: 'XX17-配件XX2',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX',
        name1: 'XXX'
      }, {
        date: 'XX17-配件XX3',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX',
        name1: 'XXX'
      }, {
        date: 'XX17-配件XX2',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX',
        name1: 'XXX'
      }, {
        date: 'XX17-配件XX3',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX',
        name1: 'XXX'
      }, {
        date: 'XX17-配件XX2',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX',
        name1: 'XXX'
      }, {
        date: 'XX17-配件XX3',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX',
        name1: 'XXX'
      }, {
        date: 'XX17-配件XX2',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX',
        name1: 'XXX'
      }, {
        date: 'XX17-配件XX3',
        name: 'XXX',
        address: 'XXX',
        date1: 'XXX',
        name1: 'XXX'
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
            ['product', 'XX-15型', 'XX-16型', 'XX-17型', 'XX-X18型'],
            ['健康评分', 86, 92, 88, 97],
            ['训练评分', 22, 13, 10, 13],
            ['维修保障评分', 61, 44, 36, 42],
            ['质量总分', 26, 67, 79, 86]
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
          subtext: 'XX-15型',
          left: '25%',
          top: '40%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }, {
          subtext: 'XX-16型',
          left: '75%',
          top: '40%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }, {
          subtext: 'XX-17型',
          left: '25%',
          top: '90%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }, {
          subtext: 'XX-18型',
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
            name: '健康评分',
            value: 70
          }, {
            name: '训练评分',
            value: 68
          }, {
            name: '维修保障评分',
            value: 48
          }, {
            name: '质量总分',
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
            name: '健康评分',
            value: 70
          }, {
            name: '训练评分',
            value: 68
          }, {
            name: '维修保障评分',
            value: 48
          }, {
            name: '质量总分',
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
            name: '健康评分',
            value: 70
          }, {
            name: '训练评分',
            value: 68
          }, {
            name: '维修保障评分',
            value: 48
          }, {
            name: '质量总分',
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
            name: '健康评分',
            value: 70
          }, {
            name: '训练评分',
            value: 68
          }, {
            name: '维修保障评分',
            value: 48
          }, {
            name: '质量总分',
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
