<template>
  <!-- 页面主体 -->
  <el-row style="width: 100%" :gutter="20">
    <el-col :span="6">
      <div class="partBox">
        <el-row>
          <el-col v-for="(item, index) in part" :key="index" :span="12">
            <div class="panel">
              <p>{{ item.name }}</p>
              <img v-show="item.pic" :src="item.pic" alt="帆板">
              <div v-if="item.isErr" class="boxBg" />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="12">
      <!-- 地图模块 -->
      <div class="map">
        <model-obj src="/static/3d/file.obj" mtl="/static/3d/file.mtl" :rotation="rotation" :scale="{ x: 1.6, y: 1.6, z: 1.6 }" :background-alpha="0" @on-load="modelOnLoad" />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="panel bar2">
        <v-chart :options="barOption2" class="echartBox" />
      </div>
      <div class="panel line2">
        <h2>故障原因推导</h2>
        <div class="textBox">
          <p>原因一：任一压点开关短路</p>
          <p>原因二：压点开关同时开路</p>
          <p>原因三：火工品母线未接通</p>
        </div>
      </div>
      <div class="panel pie2">
        <h2>应对措施</h2>
        <div class="textBox">
          <p>措施一：发K2“火工品线通”</p>
          <p>措施二：发K1“火工品起爆”</p>
          <p>措施三：注入指令KZK209</p>
        </div>
        <el-dialog
          title="设计图纸"
          :visible.sync="dialogVisible1"
          width="30%"
          :before-close="handleClose"
        >
          <span>
            <img src="./pictures/DLL_design.png" alt="动量轮图纸">
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="异常信息"
          :visible.sync="dialogVisible2"
          width="30%"
          :before-close="handleClose"
        >
          <div>
            <el-table
              :data="tableData"
              height="215"
              border
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
                width="90"
              />
              <el-table-column
                prop="address"
                label="检测位置"
                width="90"
              />
              <el-table-column
                prop="result"
                label="异常后果"
              />
              <el-table-column
                prop="method"
                label="解决方案"
              />
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import 'three'
import { ModelObj } from 'vue-3d-model'
import { mapState } from 'vuex'

import ECharts from 'vue-echarts'
import 'echarts'

// import china from './china.js'
// ECharts.registerMap('china', china)
import chinaMap from './china.json'
ECharts.registerMap('china', chinaMap)

export default {
  name: '',
  components: {
    ModelObj,
    'v-chart': ECharts
  },
  data() {
    var labelRight = {
      position: 'left',
      color: '#ccc'
    }
    var labelLeft = {
      position: 'right',
      color: '#ccc'
    }
    return {
      part: [{
        name: '太阳帆板',
        pic: '/static/part/tyfb.jpg',
        isErr: true
      }, {
        name: '磁力矩器',
        pic: './static/part/cljq.jpg',
        isErr: false
      }, {
        name: '动量轮',
        pic: '/static/part/dll.jpg',
        isErr: false
      }, {
        name: '光纤陀螺',
        pic: '/static/part/gxtl.jpg',
        isErr: false
      }, {
        name: '航天飞机发动机',
        pic: '/static/part/fdj.jpg',
        isErr: false
      }, {
        name: '太阳敏感器',
        pic: '/static/part/tymgq.jpg',
        isErr: false
      }, {
        name: '星敏感器',
        pic: '/static/part/xmgq.jpg',
        isErr: false
      }, {
        name: '',
        pic: '',
        isErr: false
      }],
      tableData: [{
        date: '1',
        name: '电流',
        address: '动量轮',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '2',
        name: '电压',
        address: '动量轮',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '3',
        name: '温度',
        address: '动量轮',
        result: '严重',
        method: '调试XXX'
      }, {
        date: '4',
        name: '标称角动量',
        address: '动量轮',
        result: '一般',
        method: '调试XXX'
      }],
      nowTime: '',
      count: {
        total: 235411
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      dialogVisible1: false,
      dialogVisible2: false,
      barOption2: {
        title: {
          textStyle: {
            color: '#fff'
          },
          text: '星敏感器校正速度累计故障数',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          bottom: '0',
          show: true,
          containLabel: true // 包含刻度文字在内
        },
        axisLabel: {
          color: '#fff' // 文本颜色
        },
        xAxis: {
          type: 'value',
          position: 'top',
          splitLine: {
            lineStyle: {
              type: 'dashed'
              // color: '#ccc'
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          data: ['信号10', '信号9', '信号8', '信号7', '信号6', '信号5', '信号4', '信号3', '信号2', '信号1']
        },
        series: [
          {
            name: '信号监测值',
            type: 'bar',
            label: {
              show: true,
              formatter: '{b}'
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  var index_color = params.value
                  if (index_color >= 0) {
                    return '#56D0E3'
                  } else {
                    return '#F57474'
                  }
                }
              }
            },
            data: [
              { value: -0.07, label: labelRight },
              { value: 0.2, label: labelLeft },
              { value: 0.44, label: labelLeft },
              { value: -0.09, label: labelRight },
              { value: 0.08, label: labelLeft },
              { value: -0.36, label: labelRight },
              { value: 0.47, label: labelLeft },
              { value: 0.18, label: labelLeft },
              { value: -0.23, label: labelRight },
              { value: -0.17, label: labelRight }
            ]
          }
        ]
      }
      // option: {
      //   tooltip: {
      //     trigger: 'item',
      //     triggerOn: 'mousemove'
      //   },
      //   series: [
      //     {
      //       type: 'tree', // 设置树图
      //       name: 'xxxx',
      //       data: [data],
      //       layout: 'orthogona', // 正交布局（水平布局）
      //       symbol: 'rect', // 矩形标记
      //       symbolSize: [88, 30], // 标记大小
      //       initialTreeDepth: 2, // 树图层级
      //       label: {
      //         normal: {
      //           position: 'right',
      //           verticalAlign: 'middle',
      //           fontSize: 12,
      //           offset: [-86, 0], // 文本偏移量
      //           color: '#00173d',
      //           align: 'left'
      //         }
      //       },
      //       lineStyle: {
      //         curveness: 0.5 // 树图边的曲度
      //       }
      //     }
      //   ]
      // }
    }
  },
  computed: {
    ...mapState('first', ['basicData'])
  },
  methods: {
    modelOnLoad() {
      this.rotate()
    },
    rotate() {
      this.rotation.y += 0.003
      requestAnimationFrame(this.rotate)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style/index.scss';
.partBox{
  height: 11rem;
  width: 100%;
  display: inline-block;
  vertical-align: top;
  .panel{
    padding: 4% 0 0;
    text-align: center;
    position: relative;
    height: 2.85rem;
    margin: 0;
    img {
      width: 80%;
      height: auto;
    }
  }
  p {
    font-size: 16px;
    color: #fff;
    line-height: 1;
    margin-bottom: 10px;
  }
  .boxBg{
    position: absolute;
    top: 25px;
    left: 0;
    right: 0;
    bottom: 0;
    border: solid 3px #F57474;
    animation: radius 1s ease-out infinite forwards alternate;
  }
}
.textBox{
  text-align: center;
  font-size: 20px;
  line-height: 3;
}
.line2 .textBox{
  color: #F57474;
}
.pie2 .textBox{
  color: #56D0E3;
}
</style>
