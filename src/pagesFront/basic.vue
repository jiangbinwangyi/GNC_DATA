<template>
  <!-- 页面主体 -->
  <div class="basicBox" style="width: 100%">
    <el-row style="margin-bottom: .28rem" :gutter="20">
      <el-col :span="7">
        <div class="panel bar" style="height: 5rem">
          <h2>飞行器实时健康状态</h2>
        </div>
      </el-col>
      <el-col :span="10" class="timeBox">
        <div class="panel pie" style="height: 5rem;">
          <h2>飞行器星下点轨迹</h2>
          <div class="main" style="padding: 0">
            <img src="@/assets/images/guiji2.png" style="width: 100%; height: auto;">
            <img src="static/globe/satell.svg" style="position: absolute; top: -10%; right: 19%; width: 20px" alt="">
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="panel pie" style="height: 5rem">
          <h2 style="float: none; clear: both">飞行器实时运行影像</h2>
          <div class="main">
            <video src="@/assets/video.mp4" autoplay loop muted width="100%" height="100%" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="7">
        <div class="panel" style="height: 6.5rem">
          <h2>飞行器运行轨道实时显示</h2>
          <div class="main map">
            <div class="satell" style="top: 16%; bottom: 17%; border-color: #2d466f;" />
            <div class="satell">
              <div class="satellIcon">
                <img src="static/globe/satell.svg" alt="">
              </div>
            </div>
            <v-chart
              :options="globe"
              autoresize
              style="height: 100%;width:100%;position:relative;"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="panel relationBox" style="overflow:hidden">
          <h2>飞行器实时动作显示</h2>
          <div class="main">
            <model-obj src="/static/3d/file12.obj" mtl="/static/3d/file12.mtl" :rotation="rotation" :scale="{ x: 1.6, y: 1.6, z: 1.6 }" :background-alpha="0" @on-load="modelOnLoad" />
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="panel line2" style="height: 6.5rem">
          <h2 style="float: none; clear: both">飞行器实时运行信息</h2>
          <el-table :data="tableData" :row-class-name="isError">
            <el-table-column
              prop="time"
              label="时间"
              width="190"
            />
            <el-table-column
              prop="info"
              label="信息"
              min-width="180"
            />
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="BD2G01 - 飞行器帆板实时信息"
      :visible.sync="visibleShow"
      width="70%"
    >
      <div>
        <el-row style="line-height: 1.8; margin-bottom: .5rem">
          <el-col :span="12" class="xinhao">
            <h3>部件实时状态</h3>
            <img src="@/assets/images/xinhao_red.png" alt="" class="xinhao_error">
            <img src="@/assets/images/xinhao_gray.png" alt="">
            <img src="@/assets/images/xinhao_gray.png" alt="">
            <img src="@/assets/images/xinhao_gray.png" alt="">
            <img src="@/assets/images/xinhao_gray.png" alt="">
          </el-col>
          <el-col :span="12">
            <h3>部件信息</h3>
            <p style="color: #cc0000">时间：2020-01-02 06:30:32 信息：状态 +y帆板工作信号 &nbsp; 0“状态异常”。</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <h3>运行状态分析</h3>
            <v-chart
              :options="radarOption"
              autoresize
              style="height: 5rem;width:100%;position:relative;"
            />
          </el-col>
          <el-col :span="12">
            <h3>实时数据检测</h3>
            <v-chart
              :options="mapOption"
              autoresize
              style="height: 5rem;width:100%;position:relative;"
            />
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'three'
import { ModelObj } from 'vue-3d-model'
import { mapState } from 'vuex'

import ECharts from 'vue-echarts'
import 'echarts'
import 'echarts-gl'
// import china from './china.js1'dddd
// ECharts.registerMap('china', china)
import chinaMap from './china.json'
ECharts.registerMap('china', chinaMap)

export default {
  components: {
    ModelObj,
    'v-chart': ECharts
  },
  data() {
    return {
      visibleShow: false,
      part: [{
        name: '太阳帆板',
        pic: '/static/part/tyfb.png',
        isErr: true
      }, {
        name: '星敏感器',
        pic: '/static/part/xmgq.png',
        isErr: false
      }, {
        name: '磁力矩器',
        pic: './static/part/cljq.png',
        isErr: false
      }, {
        name: '动量轮',
        pic: '/static/part/dll.png',
        isErr: false
      }, {
        name: '光纤陀螺',
        pic: '/static/part/gxtl.png',
        isErr: false
      }, {
        name: '发动机',
        pic: '/static/part/fdj.png',
        isErr: false
      }, {
        name: '太敏',
        pic: '/static/part/tymgq.png',
        isErr: false
      }, {
        name: '',
        pic: '',
        isErr: false
      }],
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      globe: {
        globe: {
          globeRadius: 26,
          baseTexture: '/static/globe/world.topo.bathy.200401.jpg',
          displacementQuality: 'medium',
          viewControl: {
            autoRotateSpeed: 0.5,
            targetCoord: [50, 0] // 北京坐标
          }
        }
      },
      radarOption: {
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
          indicator: [
            { name: '+Y展开', max: 1 },
            { name: '-Y展开', max: 1 },
            { name: '方阵电流', max: 1 },
            { name: '母线电压', max: 1 },
            { name: '起爆状态', max: 1 }
          ]
        },
        series: [{
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [0, 1, 1, 1, 1],
              name: '预算分配（Allocated Budget）'
            }
          ]
        }]
      }
    }
  },
  computed: {
    ...mapState('first', ['basicData', 'nowTime', 'sunTime', 'failStatus', 'tableData'])
  },
  methods: {
    isError({ row, rowIndex }) {
      if (row.info.indexOf('异常') > 0) {
        return 'table_error'
      } else if (rowIndex === 3) {
        return 'table_warning'
      }
    },
    modelOnLoad() {
      this.rotate()
    },
    rotate() {
      this.rotation.y += 0.003
      this.rotation.z += 0.001
      this.rotation.x += 0.001
      requestAnimationFrame(this.rotate)
    }
  }
}
</script>

<style lang='scss'>
@import 'style/index.scss';

.el-table, .el-table tr, .el-table th, .el-table td{
  background: none;
  color: #fff;
  font-size: 14px;
  padding: .17rem 0;
  &.table_error td{
    color: #F57474;
  }
  &.table_warning td{
    color: #F8B448
  }
}
.el-table--enable-row-hover .el-table__body tr:hover > td{
  background: none;
}
.mainbox {
  .basicBox{
    .xinhao div {
      padding-top: .3rem;
    }
    .xinhao p{
      font-size: .22rem;
      color: #fff;
      text-align: center;
      line-height: 1;
      padding-top: .15rem;
    }
    .xinhao img{
      width: 24px;
      height: 24px;
      margin: 0 3px;
    }
    @keyframes error {
      0% {
        opacity: .5;
      }
      100% {
        opacity: 1;
      }
    }
    .xinhao_error{
      animation: error .2s ease-in-out infinite alternate;
    }
    .el-button {
      padding: 2px;
    }
    .main.map {
      .satell{
        position: absolute;
        top: 19%;
        left: .2rem;
        right: .2rem;
        bottom: 14%;
        border: solid 1px #2495bd;
        border-radius: 50%;
        //向上走的动画初始及结尾值
        @keyframes animX{
            0% {left: -7%;}
            50%{transform: rotate(90deg);}
          100% {left: 95%;transform: rotate(150deg);}
        }
        @keyframes animY{
          0% {top: -10%;}
            100% {top: 95%;}
        }
        .satellIcon {
          position: absolute;
          top: 0;
          left: 0;
          animation: animX 4s cubic-bezier(0.36,0,0.64,1) -2s infinite alternate, animY 4s cubic-bezier(0.36,0,0.64,1) 0s infinite alternate;
          width: 8%;
          img {
            width: 100%;
          }
        }
      }
    }
    .panel.relationBox {
      width: 100%;
      height: 6.5rem;
      position: relative;
      .mapBorder{
        position: absolute;
        top: 19%;
        left: 10%;
        right: 10%;
        bottom: 19%;
        border-top: solid 1px #195BB9;
        border-bottom: solid 1px #195BB9;
      }
    }
    .mapChart{
      border: none;
      margin-top: 0rem;
    }
    .el-select{
      float: right;
      position: relative;
      z-index: 10;
      opacity: .8;
      margin: -.52rem .5rem 0 0;
    }
    .timeBox{
      font-size: .47rem;
      height: 3.67rem;
      line-height: 1;
      color: #247af5;
      p {
        text-shadow: 1px 1px rgba($color: #000, $alpha: .5);
        padding-top: 0.8rem;
        font-weight: bold;
        text-align: center;
      }
    }
    .partBox{
      width: 100%;
      display: inline-block;
      vertical-align: top;
      text-align: center;
      img {
        width: 50%;
        height: auto
      }
      p {
        text-align: center;
        font-size: 10px;
        color: #fff;
        line-height: 1;
        margin-bottom: 10px;
      }
      .boxBg{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: solid 3px #F57474;
        background: #F57474;
        // animation: radius 1s ease-out infinite forwards alternate;
      }
    }
  }
}
.el-dialog{
  background:#061940;
  .el-dialog__title, h3{
    color: #fff;
  }
}
</style>
