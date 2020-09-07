<template>
  <div>
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.satelliteName" placeholder="用户姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.launchTime" placeholder="用户手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item add-button" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加新测试编号
      </el-button>
    </div> -->

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="创建时间" prop="createTime" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据表名" prop="tiName" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.tiName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行时间" prop="launchTime" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.launchTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" prop="runStatus" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ runStatusText[row.runStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否常驻故障" prop="faultStatus" align="center" width="120">
        <template slot-scope="{row}">
          {{ row.faultStatus ? faultStatusText[0].text : faultStatusText[1].text }}
        </template>
      </el-table-column>
      <el-table-column label="所属部门" prop="departmentId" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{
            departmentName(row.departmentId)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="toTable(row)">
            查看数据表
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="测试编号名称" prop="satelliteName">
          <el-input v-model="temp.satelliteName" />
        </el-form-item>
        <el-form-item label="运行时间" prop="launchTime">
          <el-date-picker
            v-model="temp.launchTime"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="运行状态" prop="runStatus">
          <el-radio v-for="(item, index) in runStatusText" :key="index" v-model="temp.runStatus" :label="index + ''" border>{{ item }}</el-radio>
        </el-form-item>
        <el-form-item label="是否常驻故障" prop="faultStatus">
          <el-switch
            v-model="temp.faultStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="faultStatusText[0].text"
            :inactive-text="faultStatusText[1].text"
          />
        </el-form-item>
        <el-form-item label="控制负责人" prop="controllerDirector">
          <el-input v-model="temp.controllerDirector" />
        </el-form-item>
        <el-form-item label="测试编号描述">
          <el-input v-model="temp.satelliteDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteArticle, createArticle, updateArticle } from '@/api/metaManage/table'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      faultStatusText: [{ text: '是', value: 1 }, { text: '否', value: 0 }],
      runStatusText: ['开始', '停止'],
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        tpiId: undefined,
        dcId: undefined,
        sort: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        satelliteId: undefined,
        satelliteName: '',
        // launchTime: '',
        runStatus: '0',
        faultStatus: true,
        controllerDirector: '',
        satelliteDesc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改导航',
        create: '添加导航'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        satelliteName: [{ required: true, message: '测试编号名称必填', trigger: 'blur' }]
      },
      downloadLoading: false,
      departList: []
    }
  },
  created() {
    const { id } = this.$route.params
    const { type } = this.$route.query
    if (type) {
      if (type === 'tpi') {
        this.listQuery.tpiId = id
      } else if (type === 'dc') {
        this.listQuery.dcId = id
      }
      this.getList()
    } else {
      this.$router.push('/metaManage/index/')
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content || []
        this.total = response.data.totalElements || 0

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    departmentName(dId) {
      const depart = this.departList.find(e => e.departmentId === dId)
      return depart ? depart.departmentName : '无'
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        satelliteId: undefined,
        satelliteName: '',
        launchTime: '',
        runStatus: '0',
        faultStatus: true,
        controllerDirector: '',
        satelliteDesc: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      for (const key in this.temp) {
        this.temp[key] = row[key]
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateArticle(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      if (row.manager) {
        this.$message({
          message: '系统管理员不允许被删除',
          type: 'error'
        })
        return false
      }
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.satelliteId).then(() => {
          this.list.splice(index, 1)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {})
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
