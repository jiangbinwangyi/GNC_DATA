<template>
  <div class="home">
    <el-row :gutter="10" style="margin-bottom: .15rem;">
      <el-col :span="8">
        <el-card class="lineBox" shadow="never">
          <div slot="header">
            <span><i class="el-icon-tickets" /> 战备预案模板</span>
          </div>
          <div style="height: 5.4rem">
            <el-form label-width="80px">
              <el-form-item label="任务名称">
                <el-input :value="activePlan.name || ''" readonly />
              </el-form-item>
              <el-form-item label="打击地点">
                <el-input :value="activePlan.place || ''" readonly />
              </el-form-item>
              <el-form-item label="任务目的">
                <el-input :value="activePlan.result || ''" readonly />
              </el-form-item>
              <el-form-item label="任务时间">
                <el-input :value="activePlan.time || ''" readonly />
              </el-form-item>
              <el-form-item label="打击数量">
                <el-input :value="activePlan.number || ''" readonly />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="lineBox" shadow="never">
          <div slot="header">
            <span><i class="el-icon-tickets" /> 所需装备清单</span>
          </div>
          <div style="height: 5.4rem">
            <el-table
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="装备名称"
                width="180"
              />
              <el-table-column
                prop="number"
                label="装备数量"
              />
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="lineBox" shadow="never">
          <div slot="header">
            <span><i class="el-icon-tickets" /> 所需伴保物资清单</span>
          </div>
          <div style="height: 5.4rem">
            <el-table
              :data="tableData2"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="物资名称"
                width="180"
              />
              <el-table-column
                prop="number"
                label="物资数量"
              />
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="lineBox" shadow="never">
          <div slot="header">
            <span><i class="el-icon-s-data" /> 打击任务与装备吻合度</span>
          </div>
          <div style="height: 4.5rem">
            <v-chart :options="option11" autoresize class="echartBox" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="lineBox" shadow="never">
          <div slot="header">
            <span><i class="el-icon-s-data" /> 打击任务与伴保物资吻合度</span>
          </div>
          <div style="height: 4.5rem">
            <v-chart :options="option11" autoresize class="echartBox" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        name: 'XXX-XX1型',
        number: '2'
      }, {
        name: 'XXX-XX2型',
        number: '1'
      }, {
        name: 'XXX-XX3型',
        number: '1'
      }, {
        name: 'XXX-XX4型',
        number: '1'
      }],
      tableData2: [{
        name: 'XX油-XX号',
        number: '330L'
      }, {
        name: 'XXX链-1型',
        number: '200'
      }, {
        name: 'XX部件-4型',
        number: '150'
      }, {
        name: 'XX部件-5型',
        number: '120'
      }],
      activePlan: {},
      option12: {
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
            { name: '目标距离', max: 100 },
            { name: '目标数量', max: 100 },
            { name: '目标气候', max: 100 },
            { name: '摧毁程度', max: 100 }
          ]
        },
        series: [{
          name: '打击目标与装备吻合程度',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [76, 85, 78, 96, 44],
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
            { name: '目标距离', max: 100 },
            { name: '目标数量', max: 100 },
            { name: '目标气候', max: 100 },
            { name: '摧毁程度', max: 100 }
          ]
        },
        series: [{
          name: '打击目标与装备吻合程度',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [96, 92, 88, 76, 84],
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
      }
    }
  },
  created() {
    this.activePlan = JSON.parse(this.$route.query.content) || {}
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
}
</style>
