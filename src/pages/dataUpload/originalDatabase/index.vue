<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.odiName" placeholder="名称" style="width: 200px;" class="filter-item" @input="handleFilter" /> -->
      <!-- <el-input v-model="listQuery.odiDbname" placeholder="数据库名" style="width: 200px;" class="filter-item" @input="handleFilter" /> -->
      <el-button class="filter-item add-button" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加源数据源
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
      <el-table-column label="名称" prop="odiName" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.odiName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据源类型" prop="odiSourceType" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ odiSourceTypeText[row.odiSourceType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机IP" prop="odiIp" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.odiIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口" prop="odiPort" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.odiPort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库名称" prop="odiDbname" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.odiDbname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="odiUsername" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.odiUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="odiDesc" align="center" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.odiDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            编辑链接
          </el-button>
          <el-dropdown trigger="click" style="padding-left:10px" @command="handleMore($event, row, $index)">
            <el-button size="mini">更多操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handlTest">测试链接</el-dropdown-item>
              <el-dropdown-item command="handleViewSourceTable">查看表</el-dropdown-item>
              <el-dropdown-item command="handleDelete" divided>删除源</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog v-loading="listLoading" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="1vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 530px; margin-left:50px;">
        <el-form-item label="名称" prop="odiName">
          <el-input v-model="temp.odiName" placeholder="您自定义的链接标识" />
        </el-form-item>
        <el-form-item label="主机IP" prop="odiIp">
          <el-input v-model="temp.odiIp" placeholder="格式为0.0.0.0">
            <template slot="prepend">http://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="端口" prop="odiPort">
          <el-input v-model="temp.odiPort" type="number" placeholder="数据库所用服务器端口，范围为0-65535" />
        </el-form-item>
        <el-form-item label="数据源类型" prop="odiSourceType">
          <el-radio v-for="(item, index) in odiSourceTypeText" :key="index" v-model="temp.odiSourceType" :label="item.value" border size="small">{{ item.text }}</el-radio>
        </el-form-item>
        <el-form-item label="数据库名" prop="odiDbname">
          <el-input v-model="temp.odiDbname" placeholder="您所链接的数据库名称" />
        </el-form-item>
        <el-form-item v-show="temp.odiSourceType === '0'" label="实例名称" prop="odiInstance">
          <el-input v-model="temp.odiInstance" placeholder="您所链接的数据库实例名称" />
        </el-form-item>
        <el-form-item label="用户名" prop="odiUsername">
          <el-input v-model="temp.odiUsername" placeholder="您登录据库时使用的用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="odiPwd">
          <el-input v-model="temp.odiPwd" type="password" placeholder="您登录据库时使用的密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="odiPwdRepeat">
          <el-input v-model="temp.odiPwdRepeat" type="password" placeholder="请在此确认密码" />
        </el-form-item>
        <el-form-item label="数据源描述">
          <el-input v-model="temp.odiDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请自定义您的描述" />
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
import { fetchList, deleteArticle, createArticle, updateArticle, testSource, viewSourceTable } from '@/api/dataUpload/originalDatabase'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

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
      userStatusText: [{ text: '开启', value: 1 }, { text: '禁用', value: 0 }],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        odiName: undefined,
        odiDbname: undefined,
        sort: ''
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        odiId: undefined,
        odiName: '',
        odiSourceType: '0',
        odiDbname: '',
        odiIp: '',
        odiInstance: '',
        odiUsername: '',
        odiPwd: '',
        odiPwdRepeat: '',
        odiPort: '',
        odiDesc: ''
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
        odiName: [{ required: true, message: '名称必填', trigger: 'blur' }],
        odiDbname: [{ required: true, message: '数据库名必填', trigger: 'blur' }],
        odiInstance: [{ trigger: 'blur', validator: (rule, value, callback) => {
          if (value !== '' && this.temp.odiSourceType === '1') { // 必须是oraclo的时候再判断是否为空
            callback(new Error('实例名称必填'))
          } else {
            callback()
          }
        } }],
        odiUsername: [{ required: true, message: '数据库用户名必填', trigger: 'blur' }],
        odiPwd: [{ required: true, message: '数据库密码必填', trigger: 'blur' }],
        odiPort: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          const exp = new RegExp(/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/)
          if (!exp.test(value)) {
            callback(new Error('请输入正确的端口号(0-65535)'))
          } else {
            callback()
          }
        } }],
        odiIp: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          const exp = new RegExp(/(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/g)
          if (!exp.test(value)) {
            callback(new Error('请输入正确的主机IP(0.0.0.0)'))
          } else {
            callback()
          }
        } }],
        odiPwdRepeat: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          if (value !== this.temp.odiPwd) {
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
  computed: {
    ...mapGetters(['odiSourceTypeText'])
  },
  watch: {
    odiSourceTypeText: {
      handler(n) {
        if (n.length) {
          this.temp.odiSourceType = n[0].value
        }
      },
      deep: true,
      immediate: true
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
        odiId: undefined,
        odiName: '',
        odiSourceType: '0',
        odiDbname: '',
        odiIp: '',
        odiInstance: '',
        odiUsername: '',
        odiPwd: '',
        odiPwdRepeat: '',
        odiPort: '',
        odiDesc: ''
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
      this.listLoading = true
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
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },
    handleUpdate(row) {
      for (const key in this.temp) {
        this.temp[key] = row[key]
      }
      this.temp.odiPwdRepeat = this.temp.odiPwd
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.listLoading = true
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
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
          })
        }
      })
    },
    handlTest(row) {
      this.listLoading = true
      testSource(row.odiId).then((res) => {
        console.log(res)
        if (res.data) {
          this.$notify({
            title: '成功',
            message: '数据源【' + row.odiName + '】连接测试成功',
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
        this.listLoading = false
      })
    },
    handleMore(e, row, index) {
      this[e](row, index)
    },
    handleViewSourceTable(row) {
      viewSourceTable(row.odiId).then(res => {
        console.log(res)
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该数据源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.odiId).then(() => {
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
