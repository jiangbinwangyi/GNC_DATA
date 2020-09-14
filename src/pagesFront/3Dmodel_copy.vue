<template>
  <!-- 页面主体 -->
  <el-row style="width: 100%" :gutter="20">
    <el-col :span="6" class="left">
      <div class="panel bar">
        <div class="bar">
          <div class="boxBg" />
          <img src="./pictures/FB.jpg" alt="帆板">
          <div style="text-align:center; font-size: 14px; color: #fff">帆板</div>
        </div>
      </div>
      <div class="panel pie">
        <div style="text-align:center; font-size: 14px; color: #fff">动量轮</div>
        <img src="./pictures/DLL.png" alt="动量轮">
      </div>
      <div class="panel line">
        <div style="text-align:center; font-size: 14px; color: #fff">太敏</div>
        <img src="./pictures/TM.png" alt="太敏">
      </div>
      <div class="panel line">
        <div style="text-align:center; font-size: 14px; color: #fff">陀螺</div>
        <img src="./pictures/TL2.png" alt="陀螺">
      </div>
      <div class="panel line">
        <div style="text-align:center; font-size: 14px; color: #fff">星敏</div>
        <img src="./pictures/XM2.png" alt="星敏">
      </div>
    </el-col>
    <el-col :span="12">
      <!-- 地图模块 -->
      <div class="map">
        <model-obj src="/static/3d/file.obj" mtl="/static/3d/file.mtl" :background-alpha="0" />
      </div>
    </el-col>
    <el-col :span="6">
      <div style="text-align:center; font-size: 14px; color: #fff">
        <div class="panel1 bar2">
          <span>帆板信号概况</span>
          <v-chart :options="barOption2" class="echartBox" />
        </div>
      </div>
      <div class="panel1 line2">
        <div style="font-size:5px;text-align: center">
          <span style="text-align:center; font-size: 14px; color: #fff;padding: 0px">故障原因推导</span>
          <div style="font-size:120px;text-align: left; padding: 0px 30px">
            <el-row>
              <el-col :span="24"><el-button type="text" style="color: #928c8c">原因一：任一压点开关短路</el-button></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><el-button type="text" style="color: #928c8c">原因二：压点开关同时开路</el-button></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><el-button type="text" style="color: #928c8c">原因三：火工品母线未接通</el-button></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><el-button type="text" style="color: #928c8c">原因四：火工品起爆开关未接通</el-button></el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="panel1 pie2">
        <div style="font-size:5px;text-align: center">
          <span style="text-align:center; font-size: 14px; color: #fff;padding: 0px">应对措施</span>
          <div style="font-size:120px;text-align: left; padding: 0px 30px">
            <el-row>
              <el-col :span="24"><el-button type="text" style="color: #15ac6d">措施一：发K2“火工品线通”</el-button></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><el-button type="text" style="color: #15ac6d">措施二：发K1“火工品起爆”</el-button></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><el-button type="text" style="color: #15ac6d">措施三：注入指令KZK209</el-button></el-col>
            </el-row>
          </div>
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
      dialogVisible1: false,
      dialogVisible2: false,
      barOption2: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 40,
          bottom: 0
        },
        axisLabel: {
          color: '#4c9bfd' // 文本颜色
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
                    return '#25daba'
                  } else {
                    return '#fe4365'
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
@import 'style/index copy.scss';
</style>
