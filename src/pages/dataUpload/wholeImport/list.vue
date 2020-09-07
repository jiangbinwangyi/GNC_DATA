<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.witName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.sateinfoName" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item add-button" size="default" type="primary" icon="el-icon-plus" @click="enterImport">
        新建任务
      </el-button>
    </div>

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
      <el-table-column label="任务名称" prop="witName" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.witName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属型号" prop="sateinfoName" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.sateinfoName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试编号" prop="tpiName" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.tpiName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="witStatus" align="center" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.witStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleDelete(row,$index)">
            复制任务
          </el-button>
          <el-button size="mini" @click="handleUpdate(row)">
            查看任务
          </el-button>
          <el-dropdown trigger="click" style="padding-left:10px" @command="handleMore($event, row, $index)">
            <el-button size="mini">更多操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleDelete">设置定时</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="witName">
          <el-input v-model="temp.witName" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="temp.ip" placeholder="0.0.0.0">
            <template slot="prepend">http://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="temp.port" type="number" placeholder="0-65535" />
        </el-form-item>
        <el-form-item label="数据库名" prop="sateinfoName">
          <el-input v-model="temp.sateinfoName" />
        </el-form-item>
        <el-form-item label="用户名" prop="sateinfoName">
          <el-input v-model="temp.sateinfoName" />
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
import { fetchList } from '@/api/dataUpload/wholeImport'
import { fetchList as fetchDepartList } from '@/api/sysManager/depart'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      userStatusText: [{ text: '开启', value: 1 }, { text: '禁用', value: 0 }],
      usertpiNameText: ['男', '女'],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        witName: undefined,
        sateinfoName: undefined,
        sort: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        userId: undefined,
        witName: '',
        sateinfoName: '',
        ip: '',
        port: ''
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
        witName: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        sateinfoName: [{ required: true, message: '手机号必填', trigger: 'blur' }],
        port: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          const exp = new RegExp(/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/)
          if (!exp.test(value)) {
            callback(new Error('请输入正确的端口号(0-65535)'))
          } else {
            callback()
          }
        } }],
        ip: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          const exp = new RegExp(/(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/g)
          if (!exp.test(value)) {
            callback(new Error('请输入正确的IP(0.0.0.0)'))
          } else {
            callback()
          }
        } }]
      },
      downloadLoading: false,
      departList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    enterImport() {
      this.$router.push({ path: './create' })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content || []
        this.total = response.data.totalElements || 0

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    getDepartList() {
      this.listLoading = true
      fetchDepartList().then(response => {
        this.getList()
        this.departList = response.data
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
        userId: undefined,
        witName: '',
        sateinfoName: '',
        tpiName: '0',
        userStatus: true,
        userDesc: ''
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
    handleMore(e, row, index) {
      this[e](row, index)
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
