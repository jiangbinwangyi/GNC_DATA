<template>
  <div class="peace">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="panel" style="height: 6.2rem">
          <h2>东部战区 XX旅 - 装备基本概况</h2>
          <el-row class="basic-box" :gutter="10">
            <el-col v-for="(item, index) in basic" :key="index" :span="4">
              <div>
                <img v-if="item.type === 0" src="../../assets/front/images/brigade_01.png" alt="">
                <img v-if="item.type === 1" src="../../assets/front/images/brigade_02.png" alt="">
                <img v-if="item.type === 2" src="../../assets/front/images/brigade_03.png" alt="">
                <img v-if="item.type === 3" src="../../assets/front/images/brigade_04.png" alt="">
                <p>{{ item.name }}</p>
                <p>
                  <el-tag :type="setState(item.state)" effect="dark">{{ item.state }}</el-tag>
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="panel" style="height: 4.7rem; text-align:center">
          <h2>全旅2020年 - 装备保养计划</h2>
          <v-chart :options="barOption2" style="height: 74%;width: 100%;" />
          <el-button style="width: 70%" type="primary" @click="dialogVisible = true">查看详情</el-button>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="panel" style="height: 11.1rem">
          <h2>全旅2020年 - 零部件管理</h2>
          <v-chart :options="barOption" style="height: 40%;width: 100%;margin-bottom: 1%;" />
          <h2>全旅2020年 - 零部件采购计划</h2>
          <el-table
            :data="tableData"
            border
          >
            <el-table-column
              prop="date"
              label="季度"
            />
            <el-table-column
              prop="address"
              label="计划完成率"
            >
              <template slot-scope="scope">
                <el-progress :percentage="parseFloat(scope.row.address)" :text-inside="true" :stroke-width="20" />
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="80"
            >
              <el-button size="mini" type="primary" @click="dialogVisible2 = true">分析</el-button>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="计划详情"
      :visible.sync="dialogVisible"
      width="80%"
      top="2vh"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-tabs v-model="activeName" type="border-card" class="whDialog">
            <el-tab-pane label="第一季度" name="second1">本季度详细维护保养内容</el-tab-pane>
            <el-tab-pane label="第二季度" name="second2">本季度详细维护保养内容</el-tab-pane>
            <el-tab-pane label="第三季度" name="second3">
              <p>维护保养项目一：详细的维护保养内容，措施<el-tag type="success">完成</el-tag></p>
              <p>维护保养项目二：详细的维护保养内容，措施<el-tag type="success">完成</el-tag></p>
              <p>维护保养项目三：详细的维护保养内容，措施<el-tag type="success">完成</el-tag></p>
              <p>维护保养项目四：详细的维护保养内容，措施<el-tag>进行中</el-tag></p>
              <p>维护保养项目五：详细的维护保养内容，措施<el-tag>进行中</el-tag></p>
              <p>维护保养项目六：详细的维护保养内容，措施<el-tag>进行中</el-tag></p>
              <p>维护保养项目七：详细的维护保养内容，措施<el-tag>进行中</el-tag></p>
              <p>维护保养项目八：详细的维护保养内容，措施<el-tag>进行中</el-tag></p>
            </el-tab-pane>
            <el-tab-pane label="第四季度" name="second4">本季度详细维护保养内容</el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12" style="padding: .1rem">
          <v-chart :options="option21" style="height: 8rem;width: 100%" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="零件采购历史分析"
      :visible.sync="dialogVisible2"
      width="50%"
      top="2vh"
    >
      <el-row :gutter="20">
        <el-col :span="24" style="padding: .1rem">
          <v-chart :options="lineOption" style="height: 6rem;width: 100%" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts'

import map from '../data/map'
import chinaMap from '../china.json'
ECharts.registerMap('china', chinaMap)

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    const myColor = ['#415c29', '#F57474', '#56D0E3', '#F8B448', '#83f574']

    return {
      activeName: 'second3',
      dialogVisible: false,
      dialogVisible2: false,
      basic: [{
        type: 0,
        name: 'XX-17 作战营',
        state: '战备值班'
      }, {
        type: 0,
        name: 'XX-17 作战营',
        state: '战备值班'
      }, {
        type: 0,
        name: 'XX-17 作战营',
        state: '训练'
      }, {
        type: 0,
        name: 'XX-17 作战营',
        state: '维修'
      }, {
        type: 1,
        name: 'XX-21 作战营',
        state: '战备值班'
      }, {
        type: 1,
        name: 'XX-21 作战营',
        state: '训练'
      }, {
        type: 1,
        name: 'XX-21 作战营',
        state: '训练'
      }, {
        type: 1,
        name: 'XX-21 作战营',
        state: '训练'
      }, {
        type: 2,
        name: 'XX-667 保障营',
        state: '战备值班'
      }, {
        type: 2,
        name: 'XX-667 保障营',
        state: '训练'
      }, {
        type: 3,
        name: 'XX-466 通信营',
        state: '战备值班'
      }, {
        type: 3,
        name: 'XX-466 通信营',
        state: '训练'
      }],
      mapOption: map,
      barOption: {
        color: myColor[0],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '2%',
          left: '0%',
          right: '0%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['防冻液', '备胎', '铰链', '发动机', '螺栓'],
          axisLabel: {
            color: 'rgba(255,255,255,.6)',
            fontSize: '10',
            interval: '0',
            rotate: '30'
          },
          axisLine: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: 'rgba(255,255,255,.6)',
              fontSize: '12'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)',
                width: 2,
                type: 'solid'
              }
            },
            // y轴分割线
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            barWidth: '35%',
            data: [8, 19, 24, 28, 33],
            itemStyle: {
              // 修改柱子的圆角
              barBorderRadius: 3
            }
          }
        ]
      },
      lineOption: {
        title: {
          textStyle: {
            color: '#fff'
          },
          text: '系统累计故障数',
          left: 'center'
        },
        color: '#ffffff',
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
          data: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
          axisTick: {
            show: false // 去除刻度线
          },
          axisLabel: {
            color: '#ffffff' // 文本颜色
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
            color: '#ffffff' // 文本颜色
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
            data: [10, 16, 13, 18, 19, 16, 15, 18, 13, 12, 11, 16]
          }
        ]
      },
      option21: {
        title: {
          text: '保养计划环境分析'
        },
        tooltip: {},
        legend: {
          data: ['环境因素']
        },
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
          splitArea: {
            areaStyle: {
              color: ['rgba(114, 172, 209, 0.2)'],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 10
            }
          },
          indicator: [
            { name: '温度', max: 100 },
            { name: '湿度', max: 100 },
            { name: '风沙', max: 100 },
            { name: '辐射', max: 100 },
            { name: '道路', max: 100 }
          ]
        },
        series: [{
          itemStyle: {
            color: myColor[0]
          },
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [90, 85, 60, 50, 60],
              name: '环境影响因素'
            }
          ]
        }]
      },
      tableData: [{
        date: '第一季度',
        address: '98.3'
      }, {
        date: '第二季度',
        address: '97.6'
      }, {
        date: '第三季度',
        address: '76'
      }, {
        date: '第四季度',
        address: '6'
      }],
      barOption2: {
        grid: {
          left: '22%',
          top: '0',
          bottom: '2%'
          // containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            data: ['第一季度', '第二季度', '第三季度', '第四季度'],
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
            show: false,
            inverse: true,
            data: [100, 100, 100, 100],
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
              color: 'rgba(255, 255, 255, 1)',
              borderColor: '#fff',
              borderWidth: 0
            },
            data: [100, 100, 100, 100]
          },
          {
            name: '条',
            type: 'bar',
            data: [99.6, 99.7, 68.2, 0],
            // 柱子的宽度
            barWidth: 20,
            yAxisIndex: 0,
            // 柱子设为圆角
            itemStyle: {
              // 此时的color，可以修改柱子的颜色
              // params为每个柱子对象
              color: function(params) {
                return myColor[0]
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
      }
    }
  },
  watch: {
    formInline: {
      handler(newVal) {
        const fIndex = this.warArea.findIndex(e => e === newVal.area)
        this.tableData = this.allData[fIndex]
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setState(name) {
      if (name.indexOf('战备值班') > -1) {
        return ''
      } else if (name.indexOf('维修') > -1) {
        return 'danger'
      } else if (name.indexOf('训练') > -1) {
        return 'warning'
      }
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
.peace{
  padding: .2rem 0 0;
  .basic-box{
    text-align: center;
    .el-col{
      div{
        background: rgba($color: #415c29, $alpha: .5);
        padding: .2rem 0;
        margin: 0 0 .18rem 0;
      }
    }
    p{
      font-size: .28rem;
      color: #fff;
      line-height: 2;
    }
    img {
      padding-bottom: .1rem;
      width: 42%;
    }
  }
}
.whDialog{
  line-height: 2.8;
  font-size: 0.28rem;
  color: #666;
  .el-tag{margin-left: .2rem;}
}
</style>
