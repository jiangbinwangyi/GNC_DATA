<template>
  <el-row style="width: 100%" :gutter="20" class="trackBox">
    <el-col :span="12" style="margin-bottom: .3rem">
      <div class="panel line">
        <h2>
          遥测信号的未来趋势预测信息
          <div class="ctrl">
            <el-select v-model="metaValue" size="mini" style="display:inline-block;margin-right: .2rem" @change="setOptionMain">
              <el-option
                v-for="item in metaList"
                :key="item.metaColumnId"
                :label="item.metaColumnName"
                :value="item.metaColumnId"
              />
            </el-select>
          </div>
        </h2>
        <div class="main">
          <v-chart
            :options="mapOption"
            autoresize
            style="height: 100%;width:100%"
          />
        </div>
      </div>
    </el-col>
    <el-col :span="12" style="margin-bottom: .3rem">
      <div class="panel line" style="height: 5.6rem; overflow:hidden;">
        <h2>预测报警记录表</h2>
        <div class="main">
          <el-table
            :data="tableData"
            border
            height="90%"
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
            />
            <el-table-column
              prop="address"
              label="检测位置"
            />
            <el-table-column
              prop="time"
              label="预测时间"
              width="100"
            />
            <el-table-column
              prop="result"
              label="异常后果"
            >
              <template slot-scope="scope">
                <el-link type="danger">{{ scope.row.result }}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="method"
              label="解决方案"
              width="120"
            >
              <template slot-scope="scope">
                <el-link type="success">{{ scope.row.method }}</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="panel line">
        <h2>剩余寿命预测</h2>
        <div class="main">
          <v-chart
            :options="mapOption2"
            autoresize
            style="height: 100%;width:100%"
          />
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="panel line">
        <h2>XX飞行器健康监视</h2>
        <v-chart
          :options="mapOption3"
          autoresize
          style="height: 100%;width:100%"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts'
import 'echarts-gl'
import { mapState } from 'vuex'

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    const myColor = ['#247af5', '#F57474', '#56D0E3', '#fbbe2f', '#24cf43']
    // const planePath = 'path://M1007.315862 166.87669L856.478897 16.057379c-21.044966-21.044966-54.360276-21.044966-73.65738 0L563.614897 235.272828c-21.044966 21.044966-21.044966 54.360276 0 73.648551l59.630344 59.630345-29.810758 29.810759-19.297104-19.288276c-28.054069-28.062897-64.882759-40.342069-99.954758-40.342069-47.351172-38.576552-108.738207-43.837793-143.80138-8.765793-35.080828 35.080828-29.819586 96.459034 8.765793 143.801379 0 36.837517 12.270345 71.909517 40.333242 99.972414l19.288276 19.288276-29.810759 29.810758-59.630345-59.621517c-21.044966-21.044966-54.360276-21.044966-73.657379 0L16.454621 782.433103c-21.044966 21.044966-21.044966 54.360276 0 73.648552l150.81931 150.828138c21.044966 21.044966 54.369103 21.044966 73.657379 0L460.146759 787.685517c21.044966-21.044966 21.044966-54.369103 0-73.657379l-50.846897-50.855724 29.801931-29.819586 66.648276 66.648275c17.531586-40.342069 45.594483-80.67531 80.666483-115.74731 35.072-35.080828 75.414069-63.134897 115.74731-80.67531l-66.648276-66.648276 29.819586-29.801931 50.855725 50.846896c21.044966 21.053793 54.369103 21.053793 73.657379 0l219.215448-219.20662c19.288276-19.288276 19.288276-52.612414-1.75669-71.90069z'
    // const planePath = 'image:///static/globe/satell.svg'
    // const barData = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]
    return {
      metaValue: '288',
      mapOption3: {
        series: [
          {
            name: '速度',
            type: 'gauge',
            z: 3,
            min: 0,
            max: 100,
            center: ['72%', '50%'],
            radius: '65%',
            axisLine: {
              lineStyle: {
                width: 3,
                shadowColor: '#fff',
                shadowBlur: 5,
                color: [[0.1, '#F57474'], [0.25, '#fbbe2f'], [0.7, '#247af5'], [0.85, '#56D0E3'], [1, '#24cf43']]
              }
            },
            axisTick: {
              length: 15,
              lineStyle: {
                color: 'auto'
              }
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto'
              }
            },
            title: {
              offsetCenter: [0, '70%'],
              fontSize: 20,
              color: '#fff'
            },
            axisLabel: {
              backgroundColor: 'auto',
              borderRadius: 2,
              color: '#eee',
              padding: 3,
              textShadowBlur: 2,
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              textShadowColor: '#222'
            },
            detail: {
              offsetCenter: [0, '-30%'],
              fontWeight: 'bolder',
              fontFamily: 'Arial',
              color: 'auto'
            },
            data: [{ value: 95, name: '健康值' }]
          },
          {
            name: '转速',
            type: 'gauge',
            center: ['30%', '50%'],
            radius: '80%',
            min: 0,
            max: 10,
            axisLine: {
              lineStyle: {
                width: 3,
                shadowColor: '#fff',
                shadowBlur: 5,
                color: [[0.1, '#F57474'], [0.25, '#fbbe2f'], [0.7, '#247af5'], [0.85, '#56D0E3'], [1, '#24cf43']]
              }
            },
            title: {
              offsetCenter: [0, '70%'],
              fontSize: 20,
              color: '#fff'
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto'
              }
            },
            axisLabel: {
              backgroundColor: 'auto',
              borderRadius: 2,
              color: '#eee',
              padding: 3,
              textShadowBlur: 2,
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              textShadowColor: '#222'
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto'
              }
            },
            detail: {
              offsetCenter: [0, '-30%'],
              fontWeight: 'bolder',
              fontFamily: 'Arial',
              color: 'auto'
            },
            data: [{ value: 9.72, name: '剩余寿命(年)' }]
          }
        ]
      },
      tableData: [{
        date: '1',
        name: '星敏Vx',
        address: '星敏',
        time: '2020-05-12 08:23:15',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '2',
        name: '星敏Vy',
        address: '星敏',
        time: '2020-05-12 08:23:15',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '3',
        name: '星敏Vz',
        address: '星敏',
        time: '2020-05-12 08:23:15',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '4',
        name: '矫正时间',
        address: '星敏',
        time: '2020-05-12 08:23:15',
        result: '一般',
        method: '调试XXX'
      }, {
        date: '5',
        name: '星敏Vy',
        address: '星敏',
        time: '2020-05-12 08:23:15',
        result: '严重',
        method: '调试XXX'
      }],
      mapOption2: {
        color: myColor,
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
          left: 20,
          right: 70,
          bottom: '16%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          name: '预测时间',
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
          },
          // y轴分割线
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.8)'
            }
          },
          boundaryGap: false,
          data: this.$store.state.first.life.xAxis
        }],
        yAxis: [{
          type: 'value',
          name: '剩余时间(h)',
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
        }],
        series: [{
          type: 'line',
          smooth: true, // 是否平滑
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
          data: this.$store.state.first.life.data
        }]
      },
      mapOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '20',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          name: '时间(ms)',
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            color: 'rgba(255,255,255,.8)',
            fontSize: '12'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.8)',
              width: 2,
              type: 'solid'
            }
          },
          // y轴分割线
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.8)'
            }
          },
          data: this.$store.state.first.basicData.healthy.time
        },
        yAxis: {
          name: '遥测值',
          type: 'value',
          max: 4,
          axisLabel: {
            color: 'rgba(255,255,255,.8)',
            fontSize: '12'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.8)',
              width: 2,
              type: 'solid'
            }
          },
          // y轴分割线
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.8)'
            }
          }
        },
        series: [{
          data: this.$store.state.first.basicData.healthy.data,
          type: 'line',
          name: '预测遥测值',
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
        }, {
          data: this.$store.state.first.basicData.healthy.data4,
          type: 'line',
          name: '实际遥测值',
          itemStyle: {
            normal: {
              color: myColor[2] // 改变折线点的颜色
            }
          },
          smooth: true
        }, {
          data: this.$store.state.first.basicData.healthy.data2,
          type: 'line',
          name: '挖掘预测上限阈值',
          itemStyle: {
            normal: {
              color: myColor[3] // 改变折线点的颜色
            }
          },
          lineStyle: {
            type: 'dashed',
            opacity: 0.7
          },
          smooth: true
        }, {
          data: this.$store.state.first.basicData.healthy.data3,
          name: '挖掘预测下限阈值',
          type: 'line',
          itemStyle: {
            normal: {
              color: myColor[3] // 改变折线点的颜色
            }
          },
          lineStyle: {
            type: 'dashed',
            opacity: 0.7
          },
          smooth: true
        }]
      }
    }
  },
  computed: {
    ...mapState('first', ['healthyValue', 'metaList'])
  },
  watch: {
    healthyValue: {
      handler(newVal) {
        this.mapOption3.series[0].data[0].value = newVal
      },
      deep: true
    }
  }
}
</script>

<style lang='scss'>
@import 'style/index.scss';

.trackBox {
  .panel.line{
    height: 5.6rem;
  }
  .panel.map {
    width: 100%;
    height: 11.4rem;
    position: relative;
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
      &:hover, &.isActive{
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
</style>
