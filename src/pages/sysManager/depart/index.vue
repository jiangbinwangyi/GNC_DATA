<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item add-button" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加新部门
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
      <el-table-column label="ID" prop="departmentId" align="center" min-width="120" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.departmentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="departmentNumber" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.departmentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" prop="departmentName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门管理员" prop="departmentAdmin" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.departmentAdmin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注描述" prop="departmentDesc" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.departmentDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="!row.manager" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="temp.departmentName" />
        </el-form-item>
        <el-form-item label="序号" prop="departmentNumber">
          <el-input v-model="temp.departmentNumber" type="number" />
        </el-form-item>
        <el-form-item label="描述备注">
          <el-input v-model="temp.departmentDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请输入" />
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
import { fetchList, deleteArticle, createArticle, updateArticle } from '@/api/sysManager/depart'
import waves from '@/directive/waves' // waves directive
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
      userStatusText: [{ text: '开启', value: 1 }, { text: '禁用', value: 0 }],
      userSexText: ['男', '女'],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        departmentName: undefined,
        departmentNumber: undefined,
        userStatus: undefined,
        userType: undefined,
        sort: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        departmentId: undefined,
        departmentName: '',
        departmentNumber: '',
        parentId: '',
        departmentAdmin: '',
        departmentDesc: ''
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
        departmentName: [{ required: true, message: '部门名称必填', trigger: 'blur' }],
        departmentNumber: [{ required: true, message: '部门序号必填', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
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
        departmentId: undefined,
        departmentName: '',
        departmentNumber: '',
        parentId: '',
        departmentAdmin: '',
        departmentDesc: ''
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
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.departmentId).then(() => {
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
