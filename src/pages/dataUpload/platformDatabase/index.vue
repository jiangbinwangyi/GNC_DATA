<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.pdiName" placeholder="名称" style="width: 200px;" class="filter-item" @input="handleFilter" /> -->
      <!-- <el-input v-model="listQuery.pdiDbname" placeholder="数据库名" style="width: 200px;" class="filter-item" @input="handleFilter" /> -->
      <el-button class="filter-item add-button" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加平台数据源
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
      <el-table-column label="名称" prop="pdiName" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.pdiName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据源类型" prop="pdiSourcetype" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ pdiSourcetypeText[row.pdiSourcetype] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机IP" prop="pdiIp" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.pdiIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口" prop="pdiPort" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.pdiPort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库名称" prop="pdiDbname" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.pdiDbname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="pdiUsername" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.pdiUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="pdiDesc" align="center" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.pdiDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handlTest(row,$index)">
            测试链接
          </el-button>
          <el-button size="mini" @click="handleUpdate(row)">
            编辑链接
          </el-button>
          <el-dropdown trigger="click" style="padding-left:10px" @command="handleMore($event, row, $index)">
            <el-button size="mini">更多操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleViewSourceTable">查看表</el-dropdown-item>
              <el-dropdown-item command="handleDelete" divided>删除源</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="1vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="pdiName">
          <el-input v-model="temp.pdiName" />
        </el-form-item>
        <el-form-item label="主机IP" prop="pdiIp">
          <el-input v-model="temp.pdiIp" placeholder="0.0.0.0">
            <template slot="prepend">http://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="端口" prop="pdiPort">
          <el-input v-model="temp.pdiPort" type="number" placeholder="0-65535" />
        </el-form-item>
        <el-form-item label="数据源类型" prop="pdiSourcetype">
          <el-radio v-for="(item, index) in pdiSourcetypeText" :key="index" v-model="temp.pdiSourcetype" :label="index + ''" border>{{ item }}</el-radio>
        </el-form-item>
        <el-form-item label="数据库名" prop="pdiDbname">
          <el-input v-model="temp.pdiDbname" />
        </el-form-item>
        <el-form-item v-show="temp.pdiSourcetype === '1'" label="实例名称" prop="odiInstance">
          <el-input v-model="temp.odiInstance" />
        </el-form-item>
        <el-form-item label="用户名" prop="pdiUsername">
          <el-input v-model="temp.pdiUsername" />
        </el-form-item>
        <el-form-item label="密码" prop="pdiPassword">
          <el-input v-model="temp.pdiPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="pdiPasswordRepeat">
          <el-input v-model="temp.pdiPasswordRepeat" type="password" />
        </el-form-item>
        <el-form-item label="默认数据源" prop="sex">
          <el-switch
            v-model="temp.pdiIsdefault"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="pdiIsdefaultText[0].text"
            :inactive-text="pdiIsdefaultText[1].text"
          />
        </el-form-item>
        <el-form-item label="数据源描述">
          <el-input v-model="temp.pdiDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请输入" />
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
import { fetchList, deleteArticle, createArticle, updateArticle, testSource, viewSourceTable } from '@/api/dataUpload/platformDatabase'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
    }
  },
  data() {
    return {
      pdiIsdefaultText: [{ text: '是', value: 1 }, { text: '否', value: 0 }],
      pdiSourcetypeText: ['Hive', 'HBase'],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        pdiName: undefined,
        pdiDbname: undefined,
        sort: ''
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        pdiId: undefined,
        pdiName: '',
        pdiSourcetype: '0',
        pdiDbname: '',
        pdiIp: '',
        odiInstance: '',
        pdiUsername: '',
        pdiPassword: '',
        pdiPasswordRepeat: '',
        pdiPort: '',
        pdiIsdefault: 1,
        pdiIsedit: 1,
        pdiDesc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改源数据源',
        create: '添加源数据源'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        pdiName: [{ required: true, message: '名称必填', trigger: 'blur' }],
        pdiDbname: [{ required: true, message: '数据库名必填', trigger: 'blur' }],
        odiInstance: [{ trigger: 'blur', validator: (rule, value, callback) => {
          if (value !== '' && this.temp.pdiSourcetype === '1') { // 必须是oraclo的时候再判断是否为空
            callback(new Error('实例名称必填'))
          } else {
            callback()
          }
        } }],
        pdiUsername: [{ required: true, message: '数据库用户名必填', trigger: 'blur' }],
        pdiPassword: [{ required: true, message: '数据库密码必填', trigger: 'blur' }],
        pdiPort: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          const exp = new RegExp(/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/)
          if (!exp.test(value)) {
            callback(new Error('请输入正确的端口号(0-65535)'))
          } else {
            callback()
          }
        } }],
        pdiIp: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          const exp = new RegExp(/(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/g)
          if (!exp.test(value)) {
            callback(new Error('请输入正确的主机IP(0.0.0.0)'))
          } else {
            callback()
          }
        } }],
        pdiPasswordRepeat: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          if (value !== this.temp.pdiPassword) {
            callback(new Error('第二次输入密码不一致'))
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
    // 先请求部门列表，再请求用户列表
    this.getList()
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
        pdiId: undefined,
        pdiName: '',
        pdiSourcetype: '0',
        pdiDbname: '',
        pdiIp: '',
        odiInstance: '',
        pdiUsername: '',
        pdiPassword: '',
        pdiPasswordRepeat: '',
        pdiPort: '',
        pdiDesc: ''
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
      this.temp.pdiPasswordRepeat = this.temp.pdiPassword
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
    handlTest(row) {
      testSource(row.pdiId).then((res) => {
        console.log(res)
        if (res.data === '成功') {
          this.$notify({
            title: '成功',
            message: '数据源连接测试成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '数据源连接测试失败',
            type: 'danger',
            duration: 2000
          })
        }
      })
    },
    handleMore(e, row, index) {
      this[e](row, index)
    },
    handleViewSourceTable(row) {
      viewSourceTable(row.pdiId).then(res => {
        console.log(res)
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该数据源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.pdiId).then(() => {
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
