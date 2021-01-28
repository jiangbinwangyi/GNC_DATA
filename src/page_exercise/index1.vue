<template>
  <div class="myselfData">
    <header>
      <h1><a href="/index1">数据可视化-Echarts</a></h1>
      <div class="showTime" v-text="nowTime" />
    </header>
    <!-- 页面主体 -->
    <section class="mainbox">
      <div class="column">
        <div class="panel bar">
          <h2>当前就业行业</h2>
          <v-chart :options="barOption" class="echartBox" />
          <div class="panel-footer" />
        </div>
        <div class="panel line">
          <h2>就业人数变化</h2>
          <v-chart :options="lineOption" class="echartBox" />
          <div class="panel-footer" />
        </div>
        <div class="panel pie">
          <h2>就业行业占比</h2>
          <v-chart :options="pieOption" class="echartBox" />
          <div class="panel-footer" />
        </div>
      </div>
      <div class="column">
        <!-- 数字模块 -->
        <div class="no">
          <div class="no-hd">
            <ul>
              <li>124578</li>
              <li>135698</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>前端需求人数</li>
              <li>市场供应人数</li>
            </ul>
          </div>
        </div>
        <!-- 地图模块 -->
        <div class="map">
          <div class="map1" />
          <div class="map2" />
          <div class="map3" />
          <v-chart
            :options="mapOption"
            autoresize
            style="height: 100%"
          />
        </div>
      </div>
      <div class="column">
        <div class="panel bar2">
          <h2>就业技能需求</h2>
          <v-chart :options="barOption2" class="echartBox" />
          <div class="panel-footer" />
        </div>
        <div class="panel line2">
          <h2>就业方式变化</h2>
          <v-chart :options="lineOption2" class="echartBox" />
          <div class="panel-footer" />
        </div>
        <div class="panel pie2">
          <h2>就业地域占比</h2>
          <v-chart :options="pieOption2" class="echartBox" />
          <div class="panel-footer" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts'

import map from './data/map'

import china from './china.js'
ECharts.registerMap('china', china)
// import chinaMap from './china.json'
// ECharts.registerMap('china', chinaMap)

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    const yearData = [
      {
        year: '2020',
        data: [
          [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
          [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79]
        ]
      },
      {
        year: '2021',
        data: [
          [123, 175, 112, 197, 121, 67, 98, 21, 43, 64, 76, 38],
          [143, 131, 165, 123, 178, 21, 82, 64, 43, 60, 19, 34]
        ]
      }
    ]

    const myColor = ['#247af5', '#F57474', '#56D0E3', '#fbbe2f', '#24cf43']

    return {
      nowTime: '',
      barOption: {
        color: ['#2f89cf'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '0%',
          top: '10px',
          right: '0%',
          bottom: '4%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['旅游', '教育', '游戏', '医疗', '电商', '社交', '金融'],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: 'rgba(255,255,255,.6)',
              fontSize: '10'
            },
            axisLine: {
              show: false
            }
          }
        ],
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
            name: '直接访问',
            type: 'bar',
            barWidth: '35%',
            data: [200, 300, 300, 900, 1500, 1200, 600],
            itemStyle: {
              // 修改柱子的圆角
              barBorderRadius: 3
            }
          }
        ]
      },
      lineOption: {
        color: ['#00f2f1', '#ed3f35'],
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
          right: '10%'
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          show: true,
          borderColor: '#012f4a',
          containLabel: true // 包含刻度文字在内
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisTick: {
            show: false // 去除刻度线
          },
          axisLabel: {
            color: '#4c9bfd' // 文本颜色
          },
          axisLine: {
            show: false // 去除轴线
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false // 去除刻度线
          },
          axisLabel: {
            color: '#4c9bfd' // 文本颜色
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
            name: '新增粉丝',
            // 平滑显示smooth
            smooth: true,
            type: 'line',
            data: yearData[0].data[0]
          },
          {
            name: '新增游客',
            smooth: true,
            type: 'line',
            data: yearData[0].data[1]
          }
        ]
      },
      pieOption: {
        color: [
          '#065aab',
          '#066eab',
          '#0682ab',
          '#0696ab',
          '#06a0ab'
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: '0%',
          itemWidth: 10,
          itemHight: 10,
          textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: '12'
          }
        },
        series: [
          {
            name: '年龄分布',
            type: 'pie',
            center: ['50%', '40%'],
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1, name: '0岁以下' },
              { value: 4, name: '20-29岁' },
              { value: 2, name: '30-39岁' },
              { value: 2, name: '40-49岁' },
              { value: 1, name: '50岁以上' }
            ]
          }
        ]
      },
      barOption2: {
        grid: {
          left: '22%',
          top: '10%',
          bottom: '10%'
          // containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            data: ['HTML5', 'CSS3', 'javascript', 'VUE', 'NODE'],
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
            show: true,
            inverse: true,
            data: [702, 350, 610, 793, 664],
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
            name: '条',
            type: 'bar',
            data: [70, 34, 60, 78, 69],
            // 柱子之间的距离
            barCategoryGap: 50,
            // 柱子的宽度
            barWidth: 10,
            yAxisIndex: 0,
            // 柱子设为圆角
            itemStyle: {
              barBorderRadius: 20,
              // 此时的color，可以修改柱子的颜色
              // params为每个柱子对象
              color: function(params) {
                return myColor[params.dataIndex]
              }
            },
            label: {
              normal: {
                show: true,
                // 图形内显示
                position: 'inside',
                // 文字的显示格式
                // {c}会自动解析为 series数据里面的数据
                formatter: '{c}%'
              }
            }
          },
          {
            name: '框',
            type: 'bar',
            barCategoryGap: 50,
            barWidth: 15,
            yAxisIndex: 1,
            itemStyle: {
              color: 'none',
              borderColor: '#00c1de',
              borderWidth: 3,
              barBorderRadius: 15
            },
            data: [100, 100, 100, 100, 100]
          }
        ]
      },
      lineOption2: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // data: ['线上招聘', '人才市场'],
          top: '0%',
          textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: '12'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '10',
          top: '30',
          right: '10',
          bottom: '10',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '26', '28', '29', '30'],
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,.6)',
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.2)'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,.6)',
                fontSize: 12
              }
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            }
          }
        ],
        series: [
          {
            name: '邮件营销',
            smooth: true,
            type: 'line',
            lineStyle: {
              color: '#0184d5',
              width: 2
            },
            areaStyle: {
              color: 'rgba(1, 132, 213, 0.4)',
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            // 设置拐点 小圆点
            symbol: 'circle',
            // 拐点大小
            symbolSize: 8,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: '#0184d5',
              borderColor: 'rgba(221, 220, 107, .1)',
              borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: [30, 40, 30, 40, 30, 40, 30, 60, 20, 40, 30, 40, 30, 40, 30, 40, 30, 60, 20, 40, 30, 40, 30, 40, 30, 40, 20, 60, 50, 40]
          },
          {
            name: '联盟广告',
            smooth: true,
            type: 'line',
            lineStyle: {
              normal: {
                color: '#00d887',
                width: 2
              }
            },
            areaStyle: {
              color: 'rgba(0, 216, 135, 0.4)',
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            // 设置拐点 小圆点
            symbol: 'circle',
            // 拐点大小
            symbolSize: 5,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: '#00d887',
              borderColor: 'rgba(221, 220, 107, .1)',
              borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: [130, 10, 20, 40, 30, 40, 80, 60, 20, 40, 90, 40, 20, 140, 30, 40, 130, 20, 20, 40, 80, 70, 30, 40, 30, 120, 20, 99, 50, 20]
          }
        ]
      },
      pieOption2: {
        color: ['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: '0%',
          itemWidth: 10,
          itemHight: 10,
          textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: '10'
          }
        },
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: ['10', '70'],
            center: ['50%', '45%'],
            roseType: 'radius',
            label: {
              fontSize: 10
            },
            labelLine: {
              // 连接扇形图线长
              length: 6,
              // 连接文字线长
              length2: 8
            },
            data: [
              { value: 20, name: '云南' },
              { value: 26, name: '北京' },
              { value: 24, name: '山东' },
              { value: 25, name: '河北' },
              { value: 20, name: '江苏' },
              { value: 25, name: '浙江' },
              { value: 30, name: '四川' },
              { value: 42, name: '湖北' }
            ]
          }
        ]
      },
      mapOption: map
    }
  },
  created() {
    this.getNowTime()
    document.querySelector('html').style.fontSize = (document.documentElement.clientWidth > 1024 ? 1024 : document.documentElement.clientWidth) / 16 + 'px'
  },
  methods: {
    getNowTime() {
      let t = null
      const time = () => {
        clearTimeout(t)
        const dt = new Date()
        const y = dt.getFullYear()
        const mt = dt.getMonth() + 1
        const day = dt.getDate()
        const h = dt.getHours()
        const m = dt.getMinutes()
        const s = dt.getSeconds()
        this.nowTime = '当前时间：' + y + '年' + mt + '月' + day + '-' + h + '时' + m + '分' + s + '秒'
        t = setTimeout(time, 1000)
      }
      t = setTimeout(time, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  padding: 0;
  margin: 0;
}
/* 声明字体*/
@font-face {
  font-family: electronicFont;
  src: url(../assets/front/font/DS-DIGIT.TTF);
}
.myselfData {
  background: url(../assets/front/images/bga.jpg) no-repeat top center;
  font-size: 0;
  line-height: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  li {
    list-style: none;
  }
  .echartBox{
    width: 100%;
    height: 90%;
  }
}
header {
  position: relative;
  height: 1.25rem;
  background: url(../assets/front/images/header.png) no-repeat;
  background-size: 100% 100%;
  h1 {
    font-size: 0.475rem;
    color: #fff;
    text-align: center;
    line-height: 1rem;
    display: inline-block;
    text-align: center;
    width: 100%;
    margin: 0;
  }
  .showTime {
    position: absolute;
    right: 0.375rem;
    line-height: 0.9375rem;
    top: 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.25rem;
  }
}
// 页面主体盒子
.mainbox {
  display: flex;
  min-width: 1024px;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0.125rem 0.25rem 0;
  .column {
    flex: 3;
    &:nth-child(2) {
      flex: 5;
      margin: 0 0.125rem 0.1875rem;
      overflow: hidden;
    }
  }
  .panel {
    position: relative;
    height: 3.875rem;
    padding: 0 0.1875rem 0.5rem;
    margin-bottom: 0.1875rem;
    border: 1px solid rgba(25, 186, 139, 0.17);
    background: url(../assets/front/images/line（1）.png) rgba(255, 255, 255, 0.04);
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 10px;
      height: 10px;
      border-top: 2px solid #02a6b5;
      border-left: 2px solid #02a6b5;
      content: "";
    }
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-top: 2px solid #02a6b5;
      border-right: 2px solid #02a6b5;
      content: "";
    }
    .panel-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      &::before {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 10px;
        height: 10px;
        border-bottom: 2px solid #02a6b5;
        border-left: 2px solid #02a6b5;
        content: "";
      }
      &::after {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-bottom: 2px solid #02a6b5;
        border-right: 2px solid #02a6b5;
        content: "";
      }
    }
    h2 {
      height: 0.6rem;
      color: #fff;
      text-align: center;
      font-size: 0.25rem;
      line-height: 0.6rem;
      font-weight: normal;
      a {
        color: #fff;
        text-decoration: none;
        margin: 0 0.125rem;
      }
    }
    .chart {
      height: 3rem;
    }
  }
}
.no {
  background: rgba(101,132,226,0.1);
  padding: 0.1875rem;
  .no-hd {
    position: relative;
    border: 1px solid rgba(25, 186, 139, 0.17);
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      width: 30px;
      height: 10px;
      border-top: 2px solid #02a6b5;
      border-left: 2px solid #02a6b5;
    }
    &::after {
      position: absolute;
      bottom: 0;
      right: 0;
      content: "";
      width: 30px;
      height: 10px;
      border-bottom: 2px solid #02a6b5;
      border-right: 2px solid #02a6b5;
    }
    ul {
      display: flex;
      li {
        position: relative;
        flex: 1;
        line-height: 1rem;
        font-size: 0.875rem;
        color: #ffeb7b;
        text-align: center;
        font-family: "electronicFont";
      }
      li:first-child {
        &::after {
          content: "";
          position: absolute;
          top: 25%;
          right: 0;
          height: 50%;
          width: 1px;
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
  .no-bd {
    ul {
      display: flex;
      li {
        flex: 1;
        text-align: center;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.225rem;
        height: 0.5rem;
        line-height: 0.5rem;
        padding-top: 0.125rem;
      }
    }
  }
}
.map {
  position: relative;
  height: 10.125rem;
  .map1 {
    width: 6.475rem;
    height: 6.475rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url(../assets/front/images/map.png);
    background-size: 100% 100%;
    opacity: 0.3;
  }
  .map2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8.0375rem;
    height: 8.0375rem;
    background: url(../assets/front/images/lbx.png);
    background-size: 100% 100%;
    animation: rotate1 15s linear infinite;
    opacity: 0.6;
  }
  .map3 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 7.075rem;
    height: 7.075rem;
    background: url(../assets/front/images/jt.png);
    background-size: 100% 100%;
    animation: rotate2 10s linear infinite;
    opacity: 0.6;
  }
  .chart {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10.125rem;
  }

  @keyframes rotate1 {
    from {
      transform: translate(-50%, -50%)
      rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%)
      rotate(360deg);
    }
  }
  @keyframes rotate2 {
    from {
      transform: translate(-50%, -50%)
      rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%)
      rotate(-360deg);
    }
  }
}
/* 约束屏幕尺寸 */
@media screen and (max-width: 1024px) {
  html {
    font-size: 42px !important;
  }
}
@media screen and (min-width: 1920px) {
  html {
    font-size: 80px !important;
  }
}
</style>
