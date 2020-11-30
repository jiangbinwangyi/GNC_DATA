<template>
  <div>
    <el-dialog :visible.sync="loading" title="任务生成中" width="30%" :show-close="false">
      <div>
        <el-progress :text-inside="true" :stroke-width="24" :percentage="percentage" status="success" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="backImport">后台运行</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      loading: (state) => state.upload.wholeImportState,
      percentage: (state) => state.upload.wholeImportPercentage
    })
  },
  methods: {
    backImport() {
      this.wholeImportBack({ percentage: this.percentage, isBack: true })
      const that = this
      this.$notify.info({
        duration: 2000,
        position: 'bottom-right',
        dangerouslyUseHTMLString: true,
        title: '导入任务通知',
        message: '<span>任务后台自动导入中，可在任务列表页随时查看任务状态！</span> <a href="javascript:void(0);">点击查看></a>',
        onClick() {
          this.close()
          that.wholeImportSetState(true)
        }
      })
    },
    ...mapMutations('upload', ['wholeImportSetState', 'wholeImportBack'])
  }
}
</script>

<style>
</style>
