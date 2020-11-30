<template>
  <div class="app-container" style="padding: 20px 80px 0">
    <el-steps :active="createRoleStep" finish-status="success" :align-center="true">
      <template v-for="(item, index) in stepsList">
        <el-step :key="index" :title="item.title" />
      </template>
    </el-steps>

    <el-carousel ref="formBox" v-loading="listLoading" class="formBox" height="100%" :autoplay="false" indicator-position="none" arrow="never" :loop="false" :initial-index="createRoleStep">
      <el-carousel-item>
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="temp.taskName" />
          </el-form-item>
          <el-form-item label="上传类型">
            <el-radio-group v-model="temp.taskType">
              <el-radio v-for="item in uploadTypeMap" :key="item.value" :label="item.value" border>{{ item.text }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="temp.taskType === 'table'" label="源数据源" prop="sourceId">
            <el-select v-model="temp.mapping.sourceId" placeholder="请选择" filterable @change="getDataTableList()">
              <el-option v-for="item in originalDatabaseList" :key="item.odiId" :label="item.odiName" :value="item.odiId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="temp.taskType === 'file'" label="源文件源" prop="sourceId">
            <el-select v-model="temp.mapping.sourceId" placeholder="请选择" filterable>
              <el-option v-for="item in originalFileList" :key="item.ofsId" :label="item.ofsName" :value="item.ofsId" />
            </el-select>
          </el-form-item>
          <el-form-item label="源数据源表" prop="mappingStr">
            <el-select v-model="temp.mapping.str" placeholder="请选择" multiple filterable style="width: 100%">
              <el-option v-for="(item, index) in dataTableList" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="型号" prop="sateinfoId">
                <el-select v-model="temp.sateinfoId" placeholder="请选择" filterable style="width: 100%" @change="getTestProjectList();setSateinfoName();">
                  <el-option v-for="item in modelList" :key="item.sateinfoId" :label="item.sateinfoName" :value="item.sateinfoId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="测试编号" prop="tpiId">
                <el-select v-model="temp.tpiId" placeholder="请选择" filterable style="width: 100%" @change="setTpiName()">
                  <el-option v-for="item in testList" :key="item.tpiId" :label="item.tpiName" :value="item.tpiId" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="taskDesc">
            <el-input v-model="temp.taskDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请输入" />
          </el-form-item>
        </el-form>
      </el-carousel-item>
      <el-carousel-item>
        <el-alert v-if="isBackImport" show-icon title="任务正在后台生成中,请您耐心等待……" :closable="false" type="warning" />
        <div v-else style="height: 100%">
          <el-row :gutter="20" class="taskTitle">
            <el-col :span="12">原数据源</el-col>
            <el-col :span="12">目标源</el-col>
          </el-row>
          <div v-infinite-scroll="getTableMappingByTaskId" infinite-scroll-disabled="infiniteDisabled" style="overflow-y: scroll;overflow-x: hidden;height: calc(100% - 66px);">
            <el-row v-if="secondData.sourceList && secondData.targetList" style="padding: 30px 0 10px;border-bottom:solid 1px #ddd;background-color:#fbfbfb">
              <el-col :span="12">
                <el-form label-width="120px">
                  <el-form-item label="数据源库类型">
                    <el-input :value="secondData.sourceList.odiSourceType" readonly="readonly" />
                  </el-form-item>
                  <el-form-item label="数据源库名">
                    <el-input :value="secondData.sourceList.odiName" readonly="readonly" />
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="120px">
                  <el-form-item label="目标源库类型">
                    <el-input :value="secondData.targetList.pdiSourcetype" readonly="readonly" />
                  </el-form-item>
                  <el-form-item label="目标源库名">
                    <el-input :value="secondData.targetList.pdiDbname" readonly="readonly" />
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row v-for="(tItem, index) in tableList" :key="'table' + index" :gutter="40" style="padding: 30px 0 10px;border-bottom:solid 1px #ddd">
              <el-col :span="12" style="border-right:solid 1px #ddd">
                <el-form label-width="120px">
                  <template v-if="tItem.type === 'table'">
                    <el-form-item label="源表名">
                      <el-input :value="tItem.source.tableName" readonly="readonly" />
                    </el-form-item>
                    <el-form-item label="源字段详情">
                      <el-button type="text" @click="getTableColumn(tItem.source.tableId, tItem.target.tableId)">点击查看</el-button>
                    </el-form-item>
                  </template>
                  <template v-else>
                    这里是文件数据源
                  </template>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="120px">
                  <template v-if="tItem.type === 'table'">
                    <el-form-item label="目标表名">
                      <el-input :value="tItem.target.tableName" readonly="readonly" />
                    </el-form-item>
                    <el-form-item label="目标字段详情">
                      <el-button type="text" @click="getTableColumn(tItem.source.tableId, tItem.target.tableId)">点击查看</el-button>
                    </el-form-item>
                  </template>
                  <template v-else>
                    这里是文件目标库
                  </template>
                </el-form>
              </el-col>
            </el-row>
            <div style="text-align: center;">
              <el-button v-if="!infiniteDisabled" type="text" :loading="listLoading" style="color: #ddd">加载中……</el-button>
              <el-button v-else type="text" style="color: #ddd">—— 加载完成 ——</el-button>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div class="dialog-footer" style="text-align: right">
      <el-button v-if="createRoleStep !== 3" type="text" @click="$router.push({ path: './list' })">
        {{ $t('table.cancel') }}
      </el-button>
      <template v-if="createRoleStep === 0">
        <el-button type="primary" @click="createData()">下一步</el-button>
      </template>
      <template v-if="createRoleStep === 1">
        <!-- 所有数据源添加完毕重新发起提交 -->
        <el-button type="info" @click="saveTask()">仅确认保存</el-button>
        <el-button type="primary" @click="execTask()">确认保存并执行</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { createArticle, getTableMappingByTaskId, getTableColumn, saveTaskById, execTaskById } from '@/api/dataUpload/singleImport'
import { fetchList as fetchPlatformDatabaseList } from '@/api/dataUpload/platformDatabase'
import { fetchList as fetchPlatformFileList } from '@/api/dataUpload/platformFile'
import { fetchList as fetchOriginalDatabaseList } from '@/api/dataUpload/originalDatabase'
import { viewSourceTable } from '@/api/dataUpload/originalDatabase'
import { fetchList as fetchOriginalFileList } from '@/api/dataUpload/originalFile'
import { fetchList as fetchSatelliteList } from '@/api/metaManage/satellite'
import { fetchList as fetchTestProjectList } from '@/api/metaManage/testProject'
import { mapActions } from 'vuex'

export default {
  name: 'ComplexTable',
  filters: {
    dataClassificationFilter(id, list) { return list.find(e => e.id === id) ? list.find(e => e.id === id)['name'] : id },
    sourceList(id, list) { return list.find(e => e.sourceId === id)['sourceName'] },
    platformDatabaseList(id, list) { return list[0].pdiDbname },
    platformFileList(id, list) { return list[0].pfsName }
  },
  data() {
    return {
      uploadTypeMap: [{ value: 'table', text: '数据上传' }, { value: 'file', text: '文件上传' }],
      stepsList: [{
        title: '任务基础信息',
        show: true
      }, {
        title: '确认数据表映射',
        show: true
      }],
      createRoleStep: 0,
      listLoading: true,
      temp: {
        taskId: undefined,
        taskName: '',
        taskType: 'table',
        sateinfoId: '',
        sateinfoName: '',
        tpiId: '',
        tpiName: '',
        taskDesc: '',
        mapping: {
          sourceId: '',
          platformId: '',
          str: []
        }
      },
      infiniteDisabled: true,
      rules: {
        taskName: [{ required: true, message: '任务名必填', trigger: 'blur' }],
        sateinfoId: [{ required: true, message: '型号必选', trigger: 'blur' }],
        tpiId: [{ required: true, message: '编号必选', trigger: 'blur' }]
      },
      originalDatabaseList: [],
      originalFileList: [],
      modelList: [], // 型号列表，三方接口
      testList: [], // 测试编号列表，三方接口
      dataTableList: [], // 数据信息，三方接口
      dataClassificationTree: {
        data: [],
        props: {
          id: 'id',
          label: 'label',
          children: 'children'
        },
        visibel: false
      },
      secondData: {}, // 第二步提交信息结构
      platformDatabaseList: [], // 平台数据源列表，用于展示
      platformFileList: [], // 平台文件源列表
      thirdData: { // 第三步需要提交信息
        page: 0,
        size: 3,
        tid: ''
      },
      tableList: [] // 第三步展示获取信息
    }
  },
  computed: {
    isBackImport() {
      const { wholeImportState, wholeImportBackState } = this.$store.state.upload
      if (!wholeImportState && !wholeImportBackState) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    isBackImport(n) {
      if (!n) {
        // 证明数据已经有返回了，将loading都关闭了
        this.getTableMappingByTaskId()
        this.$notify({
          title: '成功',
          message: '任务生成成功',
          type: 'success',
          duration: 2000
        })
      }
    }
  },
  created() {
    this.getOriginalDatabaseList()
    this.getOriginalFileList()
    this.getSatelliteList()
  },
  methods: {
    setSateinfoName() {
      const { sateinfoId } = this.temp
      this.temp.sateinfoName = this.modelList.find(e => e.sateinfoId === sateinfoId)['sateinfoName']
    },
    setTpiName() {
      const { tpiId } = this.temp
      this.temp.tpiName = this.testList.find(e => e.tpiId === tpiId)['tpiName']
    },
    setFormBox(i) {
      this.createRoleStep = i
      this.$refs.formBox.setActiveItem(i)
    },
    saveTask() {
      this.listLoading = true
      saveTaskById({ taskId: this.thirdData.tid }).then(res => {
        this.setFormBox(4)
        this.$notify({
          title: '成功',
          message: '任务保存成功',
          type: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.setFormBox(0)
          this.$router.push({ path: './list' })
          this.listLoading = false
        }, 500)
      })
    },
    execTask() {
      this.listLoading = true
      execTaskById({ taskId: this.thirdData.tid }).then(res => {
        this.setFormBox(4)
        this.$notify({
          title: '成功',
          message: '任务保存并成功加入任务队列，等待执行',
          type: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.setFormBox(0)
          this.$router.push({ path: './list' })
          this.listLoading = false
        }, 500)
      })
    },
    getTableColumn(sId, tId) {
      getTableColumn({ sourceTableId: sId, platformTableId: tId }).then(res => {
        console.log(res)
      })
    },
    getTableMappingByTaskId() {
      this.listLoading = true
      getTableMappingByTaskId(this.thirdData).then(res => {
        // 自动加一页
        this.thirdData.page++
        const result = []
        res.data.tableMappingVOList.forEach(e => {
          e.type = 'table'
          result.push(e)
        })
        res.data.fileMappingVOList.forEach(e => {
          e.type = 'file'
          result.push(e)
        })
        this.tableList = this.tableList.concat(result)
        this.infiniteDisabled = result.length === 0 // 开启无限滚动
        this.listLoading = false
      })
    },
    getOriginalDatabaseList() {
      this.listLoading = true
      fetchOriginalDatabaseList().then(response => {
        this.originalDatabaseList = response.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getOriginalFileList() {
      this.listLoading = true
      fetchOriginalFileList().then(response => {
        this.originalFileList = response.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getSatelliteList() {
      this.listLoading = true
      fetchSatelliteList().then(res => {
        this.modelList = res.data
        // const sateInfoId = res.data[0] ? res.data[0].sateInfoId : ''
        // this.temp.sateinfoName = sateInfoId
      }).catch(() => {
        this.listLoading = false
      })
    },
    getTestProjectList() {
      this.listLoading = true
      const sateInfoId = this.temp.sateinfoId
      fetchTestProjectList({ sateInfoId }).then(response => {
        this.testList = response.data
        this.temp.tpiId = response.data[0] ? response.data[0].tpiId : ''
        this.temp.tpiName = response.data[0] ? response.data[0].tpiName : ''
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getDataTableList() {
      this.listLoading = true
      const odiId = this.temp.mapping.sourceId
      viewSourceTable(odiId).then(response => {
        this.dataTableList = response.data
        this.temp.mapping.str = response.data[0] ? [response.data[0]] : []
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    createTask() {
      this.wholeImportLoading()
      return new Promise((resolve, reject) => {
        createArticle(this.temp).then(response => {
          resolve(response.data)
        })
      })
    },
    getPlatformDatabaseList() {
      return new Promise((resolve, reject) => {
        fetchPlatformDatabaseList().then(res => [
          resolve(res.data)
        ])
      })
    },
    getPlatformFileList() {
      return new Promise((resolve, reject) => {
        fetchPlatformFileList().then(res => [
          resolve(res.data)
        ])
      })
    },
    resetTemp() {
      this.temp = {
        taskId: undefined,
        taskName: '',
        sateinfoName: '',
        tpiName: true,
        taskDesc: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          // 获取平台信息
          let getPlatform = ''
          if (this.temp.taskType === 'table') {
            getPlatform = 'getPlatformDatabaseList'
            this.secondData.sourceList = this.originalDatabaseList.find(e => e.odiId === this.temp.mapping.sourceId)
          } else {
            getPlatform = 'getPlatformFileList'
            this.secondData.sourceList = this.originalDatabaseList.find(e => e.odiId === this.temp.mapping.sourceId)
          }
          this[getPlatform]().then(res => {
            this.temp.mapping.platformId = res[0].pdiId
            this.secondData.targetList = res[0]
            return this.createTask()
          }).then(res => {
            this.setFormBox(1)
            this.thirdData.tid = res
            // 等待ws完成，由watch监听，触发获取表映射
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },
    createDataSource() {
      // 填写完相关数据源后点击下一步,先校验是否都填写完毕了
      const isTrue = (type) => {
        for (const i in this.noneSource[type]) {
          if (!this.noneSource[type][i].state) {
            return false
          }
        }
        return true
      }
      if (isTrue('data') && isTrue('file')) {
        this.createTask()
      } else {
        this.$message({
          message: '您还有未填写完成的源信息',
          type: 'error'
        })
      }
    },
    ...mapActions('upload', ['wholeImportLoading'])
  }
}
</script>

<style>
  .formBox{
    margin:20px 0 20px;
    padding: 10px 0 0 0;
    height:480px;
    overflow: hidden;
  }
  .taskTitle{
    text-align: center;
    border-bottom:solid 1px #ddd;
    height: 60px;
    line-height: 60px;
    box-shadow: 0 1px 5px 0 rgba(0,0,0,0.1);
  }
</style>
