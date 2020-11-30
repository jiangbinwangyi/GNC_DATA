<template>
  <div class="home">
    <el-row :gutter="10">
      <el-col v-for="(item, index) in planList" :key="index" :span="8" style="margin-bottom: .15rem;">
        <el-card class="lineBox" shadow="never">
          <div slot="header">
            <span><i class="el-icon-tickets" /> {{ item.name }}</span>
          </div>
          <div style="height: 4.45rem">
            <el-form label-width="80px">
              <el-form-item label="打击地点">
                <el-input :value="item.place" readonly />
              </el-form-item>
              <el-form-item label="任务目的">
                <el-input :value="item.result" readonly />
              </el-form-item>
              <el-form-item label="任务时间">
                <el-input :value="item.time" readonly />
              </el-form-item>
              <el-form-item label="打击数量">
                <el-input :value="item.number" readonly />
              </el-form-item>
              <el-form-item label="" style="text-align: right">
                <el-button type="primary" size="default" @click="toWarManageResult(index)">生成装备预案</el-button>
              </el-form-item>
            </el-form>
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
      planList: [{
        name: '对XXX登陆作战',
        place: 'XXX地区',
        result: '完全占领',
        time: '深夜',
        number: '12'
      },
      {
        name: '对XXX夺取作战',
        place: 'XXX岛',
        result: '完全占领',
        time: '白天',
        number: '10'
      },
      {
        name: '对XXX战略威慑',
        place: 'XXX山区',
        result: '完全占领',
        time: '寒冬',
        number: '3'
      },
      {
        name: '对XXX斩首',
        place: 'XX司令部',
        result: '特种作战',
        time: '阴天',
        number: '1'
      },
      {
        name: '对XXX摧毁',
        place: 'XXX海域',
        result: '夺取制海权',
        time: '暴雨',
        number: '2'
      },
      {
        name: '对XXX摧毁',
        place: 'XXX战舰',
        result: '彻底击沉',
        time: '台风',
        number: '1'
      }]
    }
  },
  methods: {
    toWarManageResult(index) {
      this.$router.push({ path: '/warManage/result', query: { content: JSON.stringify(this.planList[index]) }})
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
}
</style>
