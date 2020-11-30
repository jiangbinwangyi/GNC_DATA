<template>
  <div class="home">
    <el-row :gutter="10" style="margin-bottom: .15rem">
      <el-col :span="8" style="font-size: .4rem; color: #fff; text-align: center; line-height: 1rem">
        <i class="el-icon-star-on" />
        {{ birgadeName }}
        <el-radio-group v-model="radio4" size="small" style="margin-left: .1rem" @change="switchBirgade($event)">
          <el-radio-button :label="0">基本概况</el-radio-button>
          <el-radio-button :label="1">保障计划</el-radio-button>
          <el-radio-button :label="2">训练计划</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="10" class="dataViewNumber">
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
      </el-col>
    </el-row>
    <el-carousel ref="formBox" height="11rem" :autoplay="false" indicator-position="none" arrow="never" :loop="false" :initial-index="radio4">
      <el-carousel-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-row style="margin-bottom: .15rem">
              <el-card class="lineBox" shadow="never">
                <div slot="header">
                  <span><i class="el-icon-s-data" /> 装备状态数量统计</span>
                </div>
                <div style="height: 4.45rem">
                  <v-chart :options="option1" autoresize class="echartBox" />
                </div>
              </el-card>
            </el-row>
            <el-row>
              <el-card class="lineBox" shadow="never">
                <div slot="header">
                  <span><i class="el-icon-s-data" /> 装备状态占比统计</span>
                </div>
                <div style="height: 4.45rem">
                  <v-chart :options="option2" autoresize class="echartBox" />
                </div>
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="16">
            <el-row :gutter="10" style="margin-bottom: .15rem;">
              <el-col :span="12">
                <el-card class="lineBox" shadow="never">
                  <div slot="header">
                    <span><i class="el-icon-s-data" /> 装备完好率和装备可靠度</span>
                  </div>
                  <div style="height: 4.45rem">
                    <v-chart :options="option5" autoresize class="echartBox" />
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="lineBox" shadow="never">
                  <div slot="header">
                    <span><i class="el-icon-s-data" /> 现役和历史平均服役时长对比</span>
                  </div>
                  <div style="height: 4.45rem">
                    <v-chart :options="option4" autoresize class="echartBox" />
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="lineBox" shadow="never">
                  <div slot="header">
                    <span><i class="el-icon-s-data" /> 保障物资数量统计</span>
                  </div>
                  <div style="height: 4.45rem">
                    <v-chart :options="option3" autoresize class="echartBox" />
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-row style="margin-bottom: .15rem;">
              <el-card class="lineBox" shadow="never">
                <div slot="header">
                  <span><i class="el-icon-s-data" /> 驻地环境对装备影响程度</span>
                </div>
                <div style="height: 4.45rem">
                  <v-chart :options="option11" autoresize class="echartBox" />
                </div>
              </el-card>
            </el-row>
            <el-row>
              <el-card class="lineBox" shadow="never">
                <div slot="header">
                  <span><i class="el-icon-s-data" /> 平均保障时长</span>
                </div>
                <div style="height: 4.45rem">
                  <v-chart :options="option12" autoresize class="echartBox" />
                </div>
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="16">
            <el-row :gutter="10" style="margin-bottom: .15rem;">
              <el-col :span="16">
                <el-card class="lineBox" shadow="never">
                  <div slot="header">
                    <span><i class="el-icon-s-data" /> 历年完好率和故障率</span>
                  </div>
                  <div style="height: 4.45rem">
                    <v-chart :options="option13" autoresize class="echartBox" />
                  </div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card class="lineBox" shadow="never">
                  <div slot="header">
                    <span><i class="el-icon-s-data" /> 故障类型数量</span>
                  </div>
                  <div style="height: 4.45rem">
                    <v-chart :options="option17" autoresize class="echartBox" />
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="16">
                <el-card class="lineBox" shadow="never">
                  <div slot="header">
                    <span><i class="el-icon-s-data" /> 历年所需各保障物资数量</span>
                  </div>
                  <div style="height: 4.45rem">
                    <v-chart :options="option16" autoresize class="echartBox" />
                  </div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card class="lineBox" shadow="never">
                  <div slot="header">
                    <span><i class="el-icon-s-data" /> 故障类型占比</span>
                  </div>
                  <div style="height: 4.45rem">
                    <v-chart :options="option15" autoresize class="echartBox" />
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-card class="lineBox" shadow="never">
              <div slot="header">
                <span><i class="el-icon-s-data" /> 历年训练率</span>
              </div>
              <div style="height: 4.45rem">
                <v-chart :options="option21" autoresize class="echartBox" />
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="lineBox" shadow="never">
              <div slot="header">
                <span><i class="el-icon-s-data" /> 历年训练评分</span>
              </div>
              <div style="height: 4.45rem">
                <v-chart :options="option22" autoresize class="echartBox" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio4: 0,
      option21: {
        grid: {
          left: '6%',
          bottom: '8%',
          right: '6%'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['XX-X1型', 'XX-X2型', 'XX-X3型', 'XX-X4型']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            name: 'XX-X1型',
            type: 'line',
            data: [41.2, 48.1, 52.5, 64.6, 77.8, 57.4, 44.2, 75.5, 42.6, 43.8, 55.4, 68.2, 75.8],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'XX-X2型',
            type: 'line',
            data: [40.4, 37.8, 27.5, 25.2, 23.6, 13.3, 13.3, 36.6, 38.3, 13.2, 12.6, 34.3, 14.5],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'XX-X3型',
            type: 'line',
            data: [23.3, 38.3, 13.3, 40.4, 23.6, 14.5, 13.2, 34.3, 27.5, 25.2, 12.6, 37.8, 36.6],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'XX-X4型',
            type: 'line',
            data: [40.4, 37.8, 36.6, 12.6, 38.3, 34.3, 13.3, 14.5, 13.2, 27.5, 25.2, 23.6, 13.3],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      },
      option22: {
        grid: {
          left: '6%',
          bottom: '8%',
          right: '6%'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['XX-X1型', 'XX-X2型', 'XX-X3型', 'XX-X4型']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            name: 'XX-X1型',
            type: 'line',
            data: [41.2, 42.6, 43.8, 55.4, 68.2, 48.1, 52.5, 64.6, 77.8, 57.4, 44.2, 75.8, 75.5],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'XX-X2型',
            type: 'line',
            data: [40.4, 37.8, 36.6, 38.3, 34.3, 27.5, 25.2, 23.6, 13.3, 13.3, 14.5, 13.2, 12.6],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'XX-X3型',
            type: 'line',
            data: [13.3, 13.3, 40.4, 34.3, 27.5, 25.2, 23.6, 14.5, 13.2, 12.6, 37.8, 36.6, 38.3],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'XX-X4型',
            type: 'line',
            data: [27.5, 25.2, 23.6, 13.3, 40.4, 37.8, 36.6, 38.3, 34.3, 13.3, 14.5, 13.2, 12.6],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      },
      option15: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '故障类型占比',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: '故障类型一', selected: true },
              { value: 679, name: '故障类型二' },
              { value: 1548, name: '故障类型三' }
            ]
          },
          {
            name: '故障类型占比',
            type: 'pie',
            radius: ['40%', '55%'],
            data: [
              { value: 335, name: '故障类型一.1' },
              { value: 310, name: '故障类型一.2' },
              { value: 234, name: '故障类型一.3' },
              { value: 135, name: '故障类型二.1' },
              { value: 1048, name: '故障类型二.2' },
              { value: 251, name: '故障类型三.1' },
              { value: 147, name: '故障类型三.2' },
              { value: 102, name: '故障类型三.3' }
            ]
          }
        ]
      },
      option12: {
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
          }
        },
        dataset: {
          source: [
            ['product', 'XX-X1型', 'XX-X2型', 'XX-X3型', 'XX-X4型'],
            ['单次保障时长', 2.8, 3.2, 2.5, 1.7],
            ['间隔时长', 9.6, 10.3, 12.7, 9.4]
          ]
        },
        xAxis: { type: 'category', gridIndex: 0 },
        yAxis: { gridIndex: 0 },
        series: [
          // These series are in the second grid.
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' }
        ]
      },
      option13: {
        grid: {
          left: '6%',
          bottom: '8%',
          right: '6%'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['装备完好率', '装备故障率']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            name: '装备完好率',
            type: 'line',
            data: [71.2, 72.6, 73.8, 75.4, 78.2, 78.1, 82.5, 84.6, 87.8, 87.4, 94.2, 95.8, 95.5],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '装备故障率',
            type: 'line',
            data: [40.4, 37.8, 36.6, 38.3, 34.3, 27.5, 25.2, 23.6, 13.3, 13.3, 14.5, 13.2, 12.6],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      },
      option16: {
        grid: {
          left: '6%',
          bottom: '8%',
          right: '6%'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['XX油', 'XX油-XX号', 'XX剂', 'XXXX液', 'XXX链-1型', 'XX链-3型', 'XX部件-1型', 'XX部件-3型', 'XX部件-4型', 'XX部件-5型', 'XX部件-6型']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            name: 'XX油',
            type: 'line',
            data: [71.2, 72.6, 73.8, 75.4, 78.2, 78.1, 82.5, 84.6, 87.8, 87.4, 94.2, 95.8, 95.5],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'XXX链-1型',
            type: 'line',
            data: [81.2, 82.6, 83.8, 85.4, 88.2, 88.1, 72.5, 74.6, 87.8, 87.4, 74.2, 75.8, 85.5],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'XX油-XX号',
            type: 'line',
            data: [40.4, 47.8, 46.6, 48.3, 44.3, 47.5, 45.2, 43.6, 43.3, 43.3, 44.5, 53.2, 32.6],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'XXXX液',
            type: 'line',
            data: [47.4, 42.8, 43.6, 47.3, 49.3, 57.5, 55.2, 33.6, 43, 42.3, 41.5, 50.2, 39.6],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      },
      option11: {
        title: {},
        tooltip: {},
        radar: {
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: '温度', max: 100 },
            { name: '湿度', max: 100 },
            { name: '海拔高度', max: 100 },
            { name: '风沙', max: 100 },
            { name: '道路环境', max: 100 }
          ]
        },
        series: [{
          name: '影响程度',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [56, 12, 78, 36, 44],
              lineStyle: {
                color: '#27341b'
              },
              areaStyle: {
                opacity: 0.9,
                color: '#415c29'
              }
            }
          ]
        }]
      },
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
      option4: {
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
          }
        },
        dataset: {
          source: [
            ['product', 'XX-X1型', 'XX-X2型', 'XX-X3型', 'XX-X4型'],
            ['现役平均服役时长', 10.8, 11.2, 13.5, 9.7],
            ['退役平均服役时长', 9.6, 10.3, 12.7, 9.4]
          ]
        },
        xAxis: { type: 'category', gridIndex: 0 },
        yAxis: { gridIndex: 0 },
        series: [
          // These series are in the second grid.
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' }
        ]
      },
      option5: {
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
          }
        },
        dataset: {
          source: [
            ['product', 'XX-X1型', 'XX-X2型', 'XX-X3型', 'XX-X4型'],
            ['装备完好率', 10.8, 11.2, 13.5, 9.7],
            ['装备可靠度', 9.6, 10.3, 12.7, 9.4]
          ]
        },
        xAxis: { type: 'category', gridIndex: 0 },
        yAxis: { gridIndex: 0 },
        series: [
          // These series are in the second grid.
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' }
        ]
      },
      option2: {
        tooltip: {},
        title: [{
          subtext: 'XX-X1型',
          left: '25%',
          top: '44%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }, {
          subtext: 'XX-X2型',
          left: '75%',
          top: '44%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }, {
          subtext: 'XX-X3型',
          left: '25%',
          top: '92%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }, {
          subtext: 'XX-X4型',
          left: '75%',
          top: '92%',
          subtextStyle: {
            color: '#fff'
          },
          textAlign: 'center'
        }],
        series: [{
          type: 'pie',
          radius: '80%',
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
          bottom: '50%'
        }, {
          type: 'pie',
          radius: '80%',
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
          bottom: '50%'
        }, {
          type: 'pie',
          radius: '80%',
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
          top: '50%',
          bottom: 0
        }, {
          type: 'pie',
          radius: '80%',
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
          top: '50%',
          bottom: 0
        }]
      },
      option17: {
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
          }
        },
        dataset: {
          source: [
            ['product', '故障类型1', '故障类型2', '故障类型3'],
            ['故障类型1.1', 3.8, 4.2, 6.5, 9.7, 3.8, 4.2, 6.5, 9.7, 4.2, 6.5, 9.7],
            ['故障类型1.2', 9.6, 10.3, 12.7, 9.4, 9.6, 10.3, 12.7, 9.4, 12.7, 9.4, 9.6],
            ['故障类型1.3', 12.7, 9.4, 9.6, 10.3, 12.7, 9.4, 9.4, 9.6, 10.3, 12.7, 9.4],
            ['故障类型1.4', 11.7, 12.7, 9.4, 9.4, 9.6, 10.3, 12.7, 9.4, 10.3, 12.7, 9.4],
            ['故障类型1.5', 13.7, 9.4, 9.6, 9.4, 9.6, 10.3, 12.7, 9.4, 10.3, 12.7],
            ['故障类型1.6', 4.2, 6.5, 9.7, 3.8, 4.2, 6.5, 3.8, 4.2, 6.5, 9.7, 7.8]
          ]
        },
        xAxis: { type: 'category', gridIndex: 0 },
        yAxis: { gridIndex: 0 },
        series: [
          // These series are in the second grid.
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' }
        ]
      },
      option3: {
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
          }
        },
        dataset: {
          source: [
            ['product', 'XX油', 'XX油-XX号', 'XX剂', 'XXXX液', 'XXX链-1型', 'XX链-3型', 'XX部件-1型', 'XX部件-3型', 'XX部件-4型', 'XX部件-5型', 'XX部件-6型'],
            ['现存数量', 30.8, 41.2, 63.5, 90.7, 30.8, 41.2, 63.5, 90.7, 41.2, 63.5, 90.7],
            ['历年平均使用量', 9.6, 10.3, 12.7, 9.4, 9.6, 10.3, 12.7, 9.4, 12.7, 9.4, 9.6]
          ]
        },
        xAxis: { type: 'category', gridIndex: 0 },
        yAxis: { gridIndex: 0 },
        series: [
          // These series are in the second grid.
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' }
        ]
      }
    }
  },
  computed: {
    birgadeName() {
      return this.$route.query.name || ''
    }
  },
  methods: {
    switchBirgade(val) {
      this.$refs.formBox.setActiveItem(val)
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
