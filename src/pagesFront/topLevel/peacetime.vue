<template>
  <div class="peace">
    <el-button @click="addData()">anniu</el-button>
    <v-chart :options="lineOption" autoresize style="height: 500px;width: 500px" />
    <div class="peace_filter">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.area" placeholder="战区选择" @change="mapLink($event)">
            <el-option v-for="(item, index) in warArea" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.key" placeholder="要素选择">
            <el-option v-for="(item, index) in keyType" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="panel" style="height: 10.1rem">
          <h2>{{ formInline.area }} - 火箭军装备概况</h2>
          <el-table
            :data="tableData"
            style="width: 100%"
            :show-header="false"
          >
            <el-table-column
              prop="date"
            />
            <el-table-column>
              <template slot-scope="scope">
                <el-progress v-if="scope.row.name.indexOf('%') > 0" :percentage="parseFloat(scope.row.name)" :text-inside="true" :stroke-width="20" />
                <el-tag
                  v-else-if="scope.row.name.indexOf('战备') > 0"
                  :type="zbTab(scope.row.name)"
                  effect="dark"
                >{{ scope.row.name }}</el-tag>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="panel" style="height: 10.1rem">
          <v-chart
            :options="mapOption"
            autoresize
            style="height: 100%;width: 100%;"
          />
        </div>
      </el-col>
    </el-row>
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
    return {
      lineOption: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      },
      warArea: ['全部战区', '东部战区', '南部战区', '西部战区', '北部战区', '中部战区'],
      keyType: ['全部要素', '发射阵地', '发射单元', '发射基地', '发射井'],
      formInline: {
        area: '全部战区',
        key: '全部要素'
      },
      mapOption: map,
      tableData: [],
      allData: [[{
        date: '装备完好率',
        name: '97.5%'
      }, {
        date: '战备值班率',
        name: '66.3%'
      }, {
        date: '装备维修率',
        name: '13.6%'
      }, {
        date: '导弹数量',
        name: '1024（个）'
      }, {
        date: '发射单元数量',
        name: '104（个）'
      }, {
        date: '基地数量',
        name: '12（个）'
      }, {
        date: '发射阵地数量',
        name: '268（个）'
      }, {
        date: '发射井数量',
        name: '156（个）'
      }], [{
        date: '战备状态',
        name: '三级战备'
      }, {
        date: '装备完好率',
        name: '92.6%'
      }, {
        date: '战备值班率',
        name: '87.6%'
      }, {
        date: '装备维修率',
        name: '18.6%'
      }, {
        date: '导弹数量',
        name: '216（个）'
      }, {
        date: '发射单元数量',
        name: '31（个）'
      }, {
        date: '基地数量',
        name: '3（个）'
      }, {
        date: '发射阵地数量',
        name: '88（个）'
      }, {
        date: '发射井数量',
        name: '49（个）'
      }], [{
        date: '战备状态',
        name: '三级战备'
      }, {
        date: '装备完好率',
        name: '93.7%'
      }, {
        date: '战备值班率',
        name: '49.9%'
      }, {
        date: '装备维修率',
        name: '12.6%'
      }, {
        date: '导弹数量',
        name: '204（个）'
      }, {
        date: '发射单元数量',
        name: '59（个）'
      }, {
        date: '基地数量',
        name: '4（个）'
      }, {
        date: '发射阵地数量',
        name: '99（个）'
      }, {
        date: '发射井数量',
        name: '63（个）'
      }], [{
        date: '战备状态',
        name: '二级战备'
      }, {
        date: '装备完好率',
        name: '94.3%'
      }, {
        date: '战备值班率',
        name: '69.1%'
      }, {
        date: '装备维修率',
        name: '26.6%'
      }, {
        date: '导弹数量',
        name: '286（个）'
      }, {
        date: '发射单元数量',
        name: '49（个）'
      }, {
        date: '基地数量',
        name: '3（个）'
      }, {
        date: '发射阵地数量',
        name: '106（个）'
      }, {
        date: '发射井数量',
        name: '52（个）'
      }], [{
        date: '战备状态',
        name: '二级战备'
      }, {
        date: '装备完好率',
        name: '96.4%'
      }, {
        date: '战备值班率',
        name: '32.9%'
      }, {
        date: '装备维修率',
        name: '21.6%'
      }, {
        date: '导弹数量',
        name: '312（个）'
      }, {
        date: '发射单元数量',
        name: '39（个）'
      }, {
        date: '基地数量',
        name: '3（个）'
      }, {
        date: '发射阵地数量',
        name: '156（个）'
      }, {
        date: '发射井数量',
        name: '62（个）'
      }], [{
        date: '战备状态',
        name: '一级战备'
      }, {
        date: '装备完好率',
        name: '91.4%'
      }, {
        date: '战备值班率',
        name: '82.9%'
      }, {
        date: '装备维修率',
        name: '22.6%'
      }, {
        date: '导弹数量',
        name: '196（个）'
      }, {
        date: '发射单元数量',
        name: '39（个）'
      }, {
        date: '基地数量',
        name: '3（个）'
      }, {
        date: '发射阵地数量',
        name: '156（个）'
      }, {
        date: '发射井数量',
        name: '62（个）'
      }]]
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
    addData() {
      if (this.lineOption.series.length > 1) {
        const dd = JSON.parse(JSON.stringify(this.lineOption))
        dd.series.pop()
        this.lineOption = dd
      } else {
        this.lineOption.series.push({
          data: [200, 400, 200, 500, 200, 500, 500],
          type: 'line'
        })
      }
    },
    zbTab(name) {
      if (name.indexOf('一') > -1) {
        return 'danger'
      } else if (name.indexOf('二') > -1) {
        return 'warning'
      } else {
        return ''
      }
    },
    mapLink(e) {
      if (e.indexOf('全部') < 0) {
        this.mapOption.geo.zoom = 3
        this.mapOption.series[1].zoom = 3
        if (e.indexOf('东') > -1) {
          this.mapOption.geo.center = [120, 30]
          this.mapOption.series[1].center = [120, 30]
        } else if (e.indexOf('南') > -1) {
          this.mapOption.geo.center = [108, 23]
          this.mapOption.series[1].center = [108, 23]
        } else if (e.indexOf('西') > -1) {
          this.mapOption.geo.center = [93, 34]
          this.mapOption.series[1].center = [93, 34]
        } else if (e.indexOf('北') > -1) {
          this.mapOption.geo.center = [126, 43]
          this.mapOption.series[1].center = [126, 43]
        } else if (e.indexOf('中') > -1) {
          this.mapOption.geo.center = [115, 36]
          this.mapOption.series[1].center = [115, 36]
        }
      } else {
        this.mapOption.geo.zoom = 1.2
        this.mapOption.series[1].zoom = 1.2
        this.mapOption.geo.center = [105, 36]
        this.mapOption.series[1].center = [105, 36]
      }
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
.peace{
  .peace_filter{
    padding: .2rem 0 0;
  }
}
</style>
