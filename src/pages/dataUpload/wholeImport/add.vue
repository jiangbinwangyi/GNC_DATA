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
          <el-form-item label="任务名称" prop="witName">
            <el-input v-model="temp.witName" />
          </el-form-item>
          <el-form-item label="源链接">
            <el-select v-if="interfaceList.length > 0" placeholder="请选择">
              <el-option v-for="item in interfaceList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-else value="用户唯一接口" readonly="readonly" style="width: 60%" />
            <el-button type="info" style="margin-left:10px;" @click="getModel">测试链接接口</el-button>
          </el-form-item>
          <el-form-item label="型号" prop="sateinfoName">
            <el-select v-model="temp.sateinfoName" placeholder="请选择" @change="getTestByModel">
              <template v-if="modelList.length > 0">
                <el-option v-for="item in modelList" :key="item.modulId" :label="item.modelName" :value="item.modulId" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="测试编号" prop="tpiName">
            <el-select v-model="temp.tpiName" placeholder="请选择">
              <template v-if="testList.length > 0">
                <el-option v-for="item in testList" :key="item.testCodeId" :label="item.name" :value="item.testCodeId" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="taskDesc">
            <el-input v-model="temp.taskDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请输入" />
          </el-form-item>
        </el-form>
      </el-carousel-item>
      <el-carousel-item v-show="stepsList[1].show" style="overflow-y: scroll">
        <el-tabs tab-position="left" type="border-card">
          <el-tab-pane v-if="noneSource.data.length > 0" label="源数据源">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in noneSource.data" :key="index" :label="item.value[0]">
                <el-alert v-if="item.state" title="该源信息提交成功" description="请查看其他源信息，如都显示提交成功，可点击下一步继续操作！" show-icon type="success" />
                <addOriginalDatabase v-else :value="item.value" @success="noneSourceSave('data', item.value)" />
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane v-if="noneSource.file.length > 0" label="源文件源">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in noneSource.file" :key="index" :label="item.value[0]">
                <el-alert v-if="item.state" title="该源信息提交成功" description="请查看其他源信息，如都显示提交成功，可点击下一步继续操作！" show-icon type="success" />
                <addOriginalFile v-else :value="item.value" @success="noneSourceSave('file', item.value)" />
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </el-carousel-item>
      <el-carousel-item style="overflow-y: scroll;">
        <el-row :gutter="20" class="taskTitle">
          <el-col :span="12">数据源</el-col>
          <el-col :span="12">目标库</el-col>
        </el-row>
        <el-row v-for="(item, index) in secondData.sourceList" :key="'data'+index" :gutter="40" style="padding: 30px 0 10px;border-bottom:solid 1px #ddd">
          <el-col :span="12" style="border-right:solid 1px #ddd">
            <el-form label-width="120px">
              <el-form-item label="导入类型">
                <el-input value="数据库表导入" readonly="readonly" />
              </el-form-item>
              <el-form-item label="源数据源连接">
                <el-input :value="item.sourceId | sourceList(dataList.data)" readonly="readonly" />
              </el-form-item>
              <el-form-item label="数据分类">
                <el-input :value="item.dataClassification | dataClassificationFilter(dataList.dataClassification)" readonly="readonly">
                  <el-popover
                    slot="append"
                    placement="bottom-end"
                    width="200"
                    trigger="click"
                  >
                    <el-tree :data="dataClassificationTree.data" :default-expand-all="true" node-key="id" :highlight-current="true" :current-node-key="item.dataClassification" />
                    <el-button slot="reference" type="primary">详细结构<i class="el-icon-arrow-down" /></el-button>
                  </el-popover>
                </el-input>
              </el-form-item>
              <el-form-item label="表明细">
                <el-input :value="item.tables.toString()" readonly="readonly" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form label-width="120px">
              <el-form-item label="平台数据源连接">
                <el-input :value="item.platformId | platformDatabaseList(platformDatabaseList)" readonly="readonly" />
              </el-form-item>
              <el-form-item label="导入类型">
                <el-select value="all" readonly="readonly">
                  <el-option label="全量导入" value="all" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row v-for="(item, index) in secondData.fileList" :key="'file'+index" :gutter="40" style="padding: 30px 0 10px;border-bottom:solid 1px #ddd">
          <el-col :span="12" style="border-right:solid 1px #ddd">
            <el-form label-width="120px">
              <el-form-item label="导入类型1">
                <el-input value="文件导入" readonly="readonly" />
              </el-form-item>
              <el-form-item label="源数据源连接">
                <el-input :value="item.sourceId | sourceList(dataList.file)" readonly="readonly" />
              </el-form-item>
              <el-form-item label="数据分类">
                <el-input :value="item.dataClassification | dataClassificationFilter(dataList.dataClassification)" readonly="readonly" />
              </el-form-item>
              <el-form-item label="文件路径">
                <el-input :value="item.path.toString()" readonly="readonly" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form label-width="120px">
              <el-form-item label="平台文件库">
                <el-input :value="item.platformId | platformFileList(platformFileList)" readonly="readonly" />
              </el-form-item>
              <el-form-item label="导入类型">
                <el-select value="all" readonly="readonly">
                  <el-option label="全量导入" value="all" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item>
        <el-alert v-if="isBackImport" show-icon title="任务正在后台生成中,请您耐心等待……" :closable="false" type="warning" />
        <div v-else style="height: 100%">
          <el-row :gutter="20" class="taskTitle">
            <el-col :span="12">数据源</el-col>
            <el-col :span="12">目标库</el-col>
          </el-row>
          <div v-infinite-scroll="getTableMappingByTaskId" infinite-scroll-disabled="infiniteDisabled" style="overflow-y: scroll;overflow-x: hidden;height: calc(100% - 60px);">
            <el-row v-for="(tItem, index) in tableList" :key="'table' + index" :gutter="40" style="padding: 30px 0 10px;border-bottom:solid 1px #ddd">
              <el-col :span="12" style="border-right:solid 1px #ddd">
                <el-form label-width="120px">
                  <template v-if="tItem.type === 'table'">
                    <el-form-item label="源数据库类型">
                      <el-input :value="tItem.source.dbType" readonly="readonly" />
                    </el-form-item>
                    <el-form-item label="源数据库名">
                      <el-input :value="tItem.source.dbName" readonly="readonly" />
                    </el-form-item>
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
                    <el-form-item label="目标数据库类型">
                      <el-input :value="tItem.target.saveType" readonly="readonly" />
                    </el-form-item>
                    <el-form-item label="目标数据库名">
                      <el-input :value="tItem.target.dbName" readonly="readonly" />
                    </el-form-item>
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
              <el-button v-else type="text" :loading="listLoading" style="color: #ddd">—— 加载完成 ——</el-button>
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
        <el-button type="primary" @click="createDataSource()">下一步</el-button>
      </template>
      <template v-if="createRoleStep === 2">
        <!-- 所有数据源添加完毕重新发起提交 -->
        <el-button type="primary" @click="wholeImport()">下一步</el-button>
      </template>
      <template v-if="createRoleStep === 3">
        <!-- 所有数据源添加完毕重新发起提交 -->
        <el-button type="info" @click="saveTask()">仅确认保存</el-button>
        <el-button type="primary" @click="execTask()">确认保存并执行</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { createArticle, wholeImport, validateSource, getTableMappingByTaskId, getTableColumn, saveTaskById, execTaskById } from '@/api/dataUpload/wholeImport'
import { fetchList as fetchPlatformDatabaseList } from '@/api/dataUpload/platformDatabase'
import { fetchList as fetchPlatformFileList } from '@/api/dataUpload/platformFile'
import { fetchList as fetchInterfaceList } from '@/api/sysManager/interface'
import { getModel, getTestByModel, getData } from '@/api/testApi/'
import addOriginalDatabase from './components/addOriginalDatabase'
import addOriginalFile from './components/addOriginalFile'
import formatDcList from '@/utils/dataClassification'
import { mapActions } from 'vuex'

export default {
  name: 'ComplexTable',
  components: {
    addOriginalDatabase,
    addOriginalFile
  },
  filters: {
    dataClassificationFilter(id, list) { return list.find(e => e.id === id) ? list.find(e => e.id === id)['name'] : id },
    sourceList(id, list) { return list.find(e => e.sourceId === id)['sourceName'] },
    platformDatabaseList(id, list) { return list[0].pdiDbname },
    platformFileList(id, list) { return list[0].pfsName }
  },
  data() {
    return {
      stepsList: [{
        title: '任务基础信息',
        show: true
      }, {
        title: '校验源信息',
        show: false
      }, {
        title: '确认数据库映射',
        show: true
      }, {
        title: '确认数据表映射',
        show: true
      }],
      createRoleStep: 0,
      listLoading: true,
      temp: {
        taskId: undefined,
        witName: '',
        sateinfoName: '',
        tpiName: '',
        taskDesc: ''
      },
      infiniteDisabled: true,
      rules: {
        witName: [{ required: true, message: '任务名必填', trigger: 'blur' }],
        sateinfoName: [{ required: true, message: '型号必选', trigger: 'blur' }]
      },
      interfaceList: [],
      modelList: [], // 型号列表，三方接口
      testList: [], // 测试编号列表，三方接口
      dataList: {}, // 数据信息，三方接口
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
      noneSource: { // 数据源校验不通过信息
        data: [],
        file: []
      },
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
        this.thirdData.tid = this.secondData.taskId
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
    // 先请求接口列表，根据接口列表请求型号，如果是guset用户，不用选择，只有一个。
    this.getInterfaceList()
  },
  methods: {
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
    wholeImport() {
      this.wholeImportLoading()
      wholeImport(this.secondData).then(res => {
        // 执行全局（vuex）ws协议，并弹出虚拟进度条
        this.setFormBox(3)
      })
    },
    getInterfaceList() {
      this.listLoading = true
      fetchInterfaceList().then(response => {
        this.interfaceList = response.data
        this.listLoading = false
      })
    },
    getModel() {
      this.listLoading = true
      Promise.all([getModel(), getTestByModel()]).then(response => {
        this.modelList = response[0].data
        this.temp.sateinfoName = response[0].data[0].modulId
        this.testList = response[1].data
        this.temp.tpiName = response[1].data[0].testCodeId
        this.listLoading = false
      })
    },
    getTestByModel() {
      this.listLoading = true
      getTestByModel().then(response => {
        this.testList = response.data
        this.temp.tpiName = response.data[0].testCodeId
        this.listLoading = false
      })
    },
    validateSource(validateData) {
      return new Promise((resolve, reject) => {
        validateSource(validateData).then(response => {
          const data = response.data
          if (data.noneData.length > 0 || data.noneFile.length > 0) {
            reject({
              type: 'noneSource',
              data
            })
          } else {
            resolve(data)
          }
        })
      })
    },
    createTask() {
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
    getData() {
      return new Promise((resolve, reject) => {
        getData().then(response => {
          resolve(response.data)
        })
      })
    },
    resetTemp() {
      this.temp = {
        taskId: undefined,
        witName: '',
        sateinfoName: '',
        tpiName: true,
        taskDesc: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          // 1. 获取data，用data中dataSource 和 fileSource去校验
          this.getData().then(res => {
            this.dataList = res
            // 生成结构树(两层)
            this.dataClassificationTree.data = formatDcList(res.dataClassification)
            // 生成校验数据
            const validateData = {
              dataSources: [],
              fileSources: []
            }
            res.data && res.data.forEach(e => {
              validateData.dataSources.push(e.dataSource)
            })
            res.file && res.file.forEach(e => {
              validateData.fileSources.push(e.fileSource)
            })
            return this.validateSource(validateData)
          }).then(res => {
            // 如果校验通过，先拼接校验过的datasourceid 和 filesourceid，执行task创建提交
            this.dataList.data.forEach(e => {
              const result = res.dataValidateList.find(c => c.dataSourceCode === e.dataSource)
              if (result) {
                e.sourceId = result.dataSourceId
                e.sourceName = result.dataSourceName
              }
            })
            this.dataList.file.forEach(e => {
              const result = res.fileValidateList.find(c => c.fileSourceCode === e.fileSource)
              if (result) {
                e.sourceId = result.fileSourceId
                e.sourceName = result.fileSourceName
              }
            })
            return Promise.all([this.getPlatformDatabaseList(), this.getPlatformFileList()])
          }).then(res => {
            this.platformDatabaseList = res[0]
            this.platformFileList = res[1]
            // 默认使用第一个平台源，后期可选择修改
            const { pdiId } = res[0][0]
            const { pfsId } = res[1][0]

            this.secondData.dataClassification = this.dataList.dataClassification

            this.secondData.sourceList = []
            this.dataList.data.forEach(e => {
              e.dataInfo.forEach(c => {
                const res = {
                  sourceId: e.sourceId,
                  platformId: pdiId,
                  dataClassification: c.classificationId,
                  tables: c.tables
                }
                this.secondData.sourceList.push(res)
              })
            })

            this.secondData.fileList = []
            this.dataList.file.forEach(e => {
              e.fileInfo.forEach(c => {
                const res = {
                  sourceId: e.sourceId,
                  platformId: pfsId,
                  dataClassification: c.classificationId,
                  path: c.pwd
                }
                this.secondData.fileList.push(res)
              })
            })

            return this.createTask()
          }).then(res => {
            this.secondData.taskId = res
            this.$nextTick(() => {
              this.setFormBox(2)
              this.listLoading = false
            })
          }).catch(err => {
            console.log('校验失败', err)
            this.noneSource.data = err.data.noneData.map(e => {
              const res = {}
              res.value = e.split(':')
              res.state = false
              return res
            })
            this.noneSource.file = err.data.noneFile.map(e => {
              const res = {}
              res.value = e.split(':')
              res.state = false
              return res
            })
            // 新增一步
            this.stepsList[1].show = true
            // 跳至下一步
            this.$nextTick(() => {
              this.setFormBox(1)
            })
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
    noneSourceSave(type, value) {
      // 在这里将获取到sourceId 拼接到相应的second数据中
      this.noneSource[type].forEach(e => {
        if (e.value === value) e.state = true
      })
    },
    ...mapActions('upload', ['wholeImportLoading'])
  }
}
</script>

<style scoped>
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
