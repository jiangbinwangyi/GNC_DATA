<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" clearable placeholder="用户姓名" style="width: 200px;" class="filter-item" @input="handleFilter" />
      <el-input v-model="listQuery.phone" clearable placeholder="用户手机号" style="width: 200px;" class="filter-item" @input="handleFilter" />
      <el-button class="filter-item add-button" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加新用户
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
      <el-table-column label="用户姓名" prop="userName" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" prop="phone" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" align="center" min-width="60">
        <template slot-scope="{row}">
          <span>{{ userSexText[row.sex] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户状态" prop="userStatus" align="center" min-width="80">
        <template slot-scope="{row}">
          <el-tag v-if="row.userStatus" size="mini" type="success">{{ userStatusText[0].text }}</el-tag>
          <el-tag v-else type="danger" size="mini">{{ userStatusText[1].text }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="所属部门" prop="departmentId" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{
            departmentName(row.departmentId)
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" @click="handleUpdate(row)">
            编辑用户
          </el-button>
          <el-button size="mini" @click="handleEditRole(row)">
            分配角色
          </el-button>
          <el-dropdown trigger="click" style="padding-left:10px" @command="handleMore($event, row, $index)">
            <el-button size="mini">更多操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleResetPasswd">重置密码</el-dropdown-item>
              <el-dropdown-item command="handleDelete">删除用户</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-steps v-if="dialogStatus==='create'" :active="createRoleStep" finish-status="success" align-center>
        <el-step title="创建用户" />
        <el-step title="分配角色" />
      </el-steps>
      <el-carousel ref="formBox" height="400px" :autoplay="false" indicator-position="none" arrow="never" :loop="false" :initial-index="createRoleStep">
        <el-carousel-item>
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin:30px 0 0 110px;">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="temp.userName" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="temp.phone" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio v-for="(item, index) in userSexText" :key="index" v-model="temp.sex" :label="index + ''" border>{{ item }}</el-radio>
            </el-form-item>
            <el-form-item label="用户状态" prop="sex">
              <el-switch
                v-model="temp.userStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="userStatusText[0].text"
                :inactive-text="userStatusText[1].text"
              />
            </el-form-item>
            <el-form-item label="用户描述">
              <el-input v-model="temp.userDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请输入" />
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
import { fetchList, deleteArticle, createArticle, updateArticle, resetPasswd, editRoleList } from '@/api/sysManager/user'
import { fetchRoleGetByGuestId } from '@/api/sysManager/guest'
import { fetchList as fetchRoleList } from '@/api/sysManager/role'
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
      userStatusText: [{ text: '开启', value: 1 }, { text: '禁用', value: 0 }],
      userSexText: ['男', '女'],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        userName: undefined,
        phone: undefined,
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
        userId: undefined,
        userName: '',
        phone: '',
        sex: '0',
        userStatus: true,
        userDesc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改导航',
        editRole: '分配权限',
        create: '添加导航'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        userName: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号必填', trigger: 'blur' }]
      },
      downloadLoading: false,
      departList: [],
      checkedRole: [],
      roleList: []
    }
  },
  created() {
    // 先请求部门列表，再请求用户列表
    this.getDepartList()
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
    getRoleByUserId(id) {
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
        userId: undefined,
        userName: '',
        phone: '',
        sex: '0',
        userStatus: true,
        userDesc: ''
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
            this.temp.userId = res.data.userId
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
      this.getRoleByUserId(row.userId).then(res => {
        this.temp.userId = row.userId
        this.dialogStatus = 'editRole'
        this.createRoleStep = 1
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.setFormBox(1)
        })
      })
    },
    editRole() {
      const userId = this.temp.userId
      const roleIds = this.checkedRole

      editRoleList({ userId, roleIds }).then((res) => {
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
        deleteArticle(row.userId).then(() => {
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
    handleResetPasswd(row, index) {
      this.$confirm('确认是否重置该用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPasswd(row.userId).then(() => {
          this.$notify({
            title: '成功',
            message: '重置密码成功',
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
