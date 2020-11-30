<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.guestIp" clearable placeholder="IP范围" style="width: 200px;" class="filter-item" @input="handleFilter" />
      <el-input v-model="listQuery.guestCode" clearable placeholder="系统代号" style="width: 200px;" class="filter-item" @input="handleFilter" />
      <el-button class="filter-item add-button" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加新临时用户
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
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="160">
        <template slot-scope="{row}">
          <span>{{ row.createTime | $moment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP限制范围" prop="guestIp" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.guestIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统代号" prop="guestCode" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.guestCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注描述" prop="guestDesc" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.guestDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            编辑信息
          </el-button>
          <el-button size="mini" @click="handleEditRole(row)">
            分配角色
          </el-button>
          <el-dropdown trigger="click" style="padding-left:10px" @command="handleMore($event, row, $index)">
            <el-button size="mini">更多操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleDelete">删除用户</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-steps v-if="dialogStatus==='create'" :active="createRoleStep" finish-status="success" align-center>
        <el-step title="创建临时用户" />
        <el-step title="分配角色" />
      </el-steps>
      <el-carousel ref="formBox" height="400px" :autoplay="false" indicator-position="none" arrow="never" :loop="false" :initial-index="createRoleStep">
        <el-carousel-item>
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin:30px 0 0 110px;">
            <el-form-item label="IP限制范围" prop="guestIp">
              <el-input v-model="temp.guestIp" />
            </el-form-item>
            <el-form-item label="系统代号" prop="guestCode">
              <el-input v-model="temp.guestCode" />
            </el-form-item>
            <el-form-item label="备注描述">
              <el-input v-model="temp.guestDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-form>
        </el-carousel-item>
        <el-carousel-item>
          <el-form>
            <div class="editMenuBox">
              <el-checkbox-group v-model="checkedRole">
                <span v-for="(item, index) in roleList" :key="index">
                  <el-checkbox :label="item.roleId">{{ item.roleName }}</el-checkbox>
                </span>
              </el-checkbox-group>
            </div>
          </el-form>
        </el-carousel-item>
      </el-carousel>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus !== 'create'" @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <template v-if="createRoleStep === 0">
          <el-button v-if="dialogStatus==='create'" type="text" @click="dialogFormVisible = false;">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            {{ dialogStatus==='create'?'下一步':'确认' }}
          </el-button>
        </template>
        <template v-if="createRoleStep === 1">
          <el-button v-if="dialogStatus==='create'" type="text" @click="dialogFormVisible = false;setFormBox(0)">
            取消
          </el-button>
          <el-button v-if="dialogStatus==='create'" type="text" @click="setFormBox(0)">
            上一步
          </el-button>
          <el-button type="primary" @click="editRole()">
            确认
          </el-button>
        </template>
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
import { fetchList, deleteArticle, createArticle, updateArticle, editRoleList, fetchRoleGetByGuestId } from '@/api/sysManager/guest'
import { fetchList as fetchRoleList } from '@/api/sysManager/role'
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
      createRoleStep: 0,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        guestIp: undefined,
        guestCode: undefined,
        sort: 'createTime'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        guestId: undefined,
        guestIp: '',
        guestCode: '',
        guestDesc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改临时用户',
        editRole: '分配权限',
        create: '添加临时用户'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        guestIp: [{ required: true, message: 'ip必填', trigger: 'blur' }],
        guestCode: [{ required: true, message: '系统代号必填', trigger: 'blur' }]
      },
      checkedRole: [],
      roleList: [],
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getRoleList()
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
    getRoleList() {
      this.listLoading = true
      fetchRoleList().then(response => {
        this.roleList = response.data
        this.listLoading = false
      })
    },
    getRoleByGuestId(id) {
      this.listLoading = true
      return new Promise((resolve, reject) => {
        fetchRoleGetByGuestId(id).then(response => {
          // 初始化checkedModel
          const data = response.data
          this.checkedRole = []
          data.forEach(e => {
            this.checkedRole.push(e.roleId)
          })
          this.listLoading = false
          resolve(true)
        })
      })
    },
    setFormBox(i) {
      this.createRoleStep = i
      this.$refs.formBox.setActiveItem(i)
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
        guestId: undefined,
        guestIp: '',
        guestCode: '',
        guestDesc: ''
      }
      this.checkedRole = []
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.setFormBox(0)
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then((res) => {
            this.getList()
            this.temp.guestId = res.data.guestId
            if (this.dialogStatus !== 'create') {
              this.dialogFormVisible = false
            } else {
              this.setFormBox(1)
            }
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
        this.setFormBox(0)
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
    handleEditRole(row) {
      // 初始化
      this.getRoleByGuestId(row.guestId).then(res => {
        this.temp.guestId = row.guestId
        this.dialogStatus = 'editRole'
        this.createRoleStep = 1
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.setFormBox(1)
        })
      })
    },
    editRole() {
      const guestId = this.temp.guestId
      const roleIds = this.checkedRole

      editRoleList({ guestId, roleIds }).then((res) => {
        this.dialogFormVisible = false

        this.$notify({
          title: '成功',
          message: '分配型号成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleMore(e, row, index) {
      this[e](row, index)
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.guestId).then(() => {
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
<style scoped lang="scss">
  .editMenuBox{
    margin: 40px 0 0 40px;
    .el-checkbox-group{
      padding: 10px 0 30px 30px;
      .el-checkbox{
        margin: 0 5px 30px;
        min-width: 140px;
      }
    }
  }
</style>
