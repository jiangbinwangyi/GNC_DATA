<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item add-button" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加新角色
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
      <el-table-column label="创建时间" prop="createTime" align="center" width="230">
        <template slot-scope="{row}">
          <span>{{ row.createTime | $moment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc" align="center" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.roleDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色状态" prop="roleStatus" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag v-if="row.roleStatus" size="mini" type="success">{{ roleStatusText[0].text }}</el-tag>
          <el-tag v-else type="danger" size="mini">{{ roleStatusText[1].text }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" @click="handleUpdate(row)">
            编辑角色
          </el-button>
          <el-button size="mini" @click="handleEditMenu(row)">
            分配权限
          </el-button>
          <el-dropdown trigger="click" style="padding-left:10px" @command="handleMore($event, row, $index)">
            <el-button size="mini">更多操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleEditModel">分配型号</el-dropdown-item>
              <el-dropdown-item command="handleEditUser">分配用户</el-dropdown-item>
              <el-dropdown-item command="handleDelete" divided>删除用户</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-steps v-if="dialogStatus==='create'" :active="createRoleStep" finish-status="success" align-center>
        <el-step title="创建角色" />
        <el-step title="配置菜单" />
        <el-step title="配置型号" />
        <el-step title="选择用户" />
      </el-steps>
      <el-carousel ref="formBox" height="400px" :autoplay="false" indicator-position="none" arrow="never" :loop="false" :initial-index="createRoleStep">
        <el-carousel-item>
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin:30px 0 0 50px;">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="temp.roleName" />
            </el-form-item>
            <el-form-item label="初始状态" prop="roleStatus">
              <el-switch
                v-model="temp.roleStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="roleStatusText[0].text"
                :inactive-text="roleStatusText[1].text"
              />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="temp.roleDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-form>
        </el-carousel-item>
        <el-carousel-item>
          <el-form style="margin:30px 0 0 50px;">
            <div v-for="(item, index) in navbarList" :key="index" class="editMenuBox">
              <el-checkbox v-model="isCheckAll[index]" :indeterminate="isIndeterminate[index]" :disabled="item.navbarDefault" @change="handleCheckAllChange($event, index, item.navbarId)">{{ item.name }}</el-checkbox>
              <el-checkbox-group v-model="checkedMenu[index]" @change="handleCheckedMenuChange($event, index, item.navbarId)">
                <span v-for="(citem, cindex) in menuList" :key="cindex">
                  <el-checkbox v-if="citem.navbarId === item.navbarId" :label="citem.id">{{ citem.name }}</el-checkbox>
                </span>
              </el-checkbox-group>
            </div>
          </el-form>
        </el-carousel-item>
        <el-carousel-item>
          <el-form style="margin:30px 0 0 50px;">
            <div class="editMenuBox">
              <el-checkbox-group v-model="checkedModel">
                <span v-for="(item, index) in modelList" :key="index">
                  <el-checkbox :label="item.satelliteId">{{ item.satelliteName }}</el-checkbox>
                </span>
              </el-checkbox-group>
            </div>
          </el-form>
        </el-carousel-item>
        <el-carousel-item>
          <el-form style="margin:30px 0 0 0;">
            <div class="editMenuBox">
              <div>普通用户</div>
              <el-checkbox-group v-model="checkedUser">
                <span v-for="(item, index) in userList" :key="index">
                  <el-checkbox :label="item.userId">{{ item.userName }}</el-checkbox>
                </span>
              </el-checkbox-group>
              <div>免登录用户</div>
              <el-checkbox-group v-model="checkedGuest">
                <span v-for="(item, index) in guestList" :key="index">
                  <el-checkbox :label="item.guestId">{{ item.guestIp }}</el-checkbox>
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
          <el-button v-if="dialogStatus==='create'" type="text" @click="setFormBox(2)">
            跳过
          </el-button>
          <el-button v-if="dialogStatus==='create'" type="text" @click="setFormBox(0)">
            上一步
          </el-button>
          <el-button type="primary" @click="editMenu();">
            {{ dialogStatus==='create'?'下一步':'确认' }}
          </el-button>
        </template>
        <template v-if="createRoleStep === 2">
          <el-button v-if="dialogStatus==='create'" type="text" @click="setFormBox(3)">
            跳过
          </el-button>
          <el-button v-if="dialogStatus==='create'" type="text" @click="etFormBox(1)">
            上一步
          </el-button>
          <el-button type="primary" @click="editModel()">
            {{ dialogStatus==='create'?'下一步':'确认' }}
          </el-button>
        </template>
        <template v-if="createRoleStep === 3">
          <el-button v-if="dialogStatus==='create'" type="text" @click="dialogFormVisible = false;setFormBox(0)">
            取消
          </el-button>
          <el-button v-if="dialogStatus==='create'" type="text" @click="setFormBox(2)">
            上一步
          </el-button>
          <el-button type="primary" @click="editUser()">
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
import { fetchList, deleteArticle, createArticle, updateArticle, editMenuByRoleId, fetchMenuByRoleId, editSatelliteByRoleId, fetchSatelliteByRoleId, editUserByRoleId, fetchUserListByRoleId, fetchGuestListByRoleId } from '@/api/sysManager/role'
import { fetchList as fetchMenuList } from '@/api/sysManager/menu'
import { fetchList as fetchNavbarList } from '@/api/sysManager/navbar'
import { fetchList as fetchModelList } from '@/api/sysManager/model'
import { fetchList as fetchUserlList } from '@/api/sysManager/user'
import { fetchList as fetchGuestlList } from '@/api/sysManager/guest'
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
      createRoleStep: 0,
      roleStatusText: [{ text: '开启', value: 1 }, { text: '禁用', value: 0 }],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        name: undefined,
        roleDesc: undefined,
        roleStatus: undefined,
        userType: undefined,
        sort: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        roleId: undefined,
        roleName: '',
        roleStatus: true,
        roleDesc: ''
      },
      checkedMenu: [],
      checkedNavbar: [],
      isIndeterminate: [],
      isCheckAll: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改角色',
        create: '添加角色',
        editMenu: '分配权限',
        editModel: '分配型号',
        editUser: '分配用户'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        roleName: [{ required: true, message: '角色名称必填', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '角色描述必填', trigger: 'blur' }]
      },
      downloadLoading: false,
      menuList: [],
      navbarList: [],
      modelList: [],
      checkedModel: [],
      userList: [],
      guestList: [],
      checkedUser: [],
      checkedGuest: []
    }
  },
  created() {
    this.getList()
    this.getMenuList()
    this.getNavbarList()
    this.getModelList()
    this.getUsetList()
    this.getGuestList()
  },
  methods: {
    handleCheckAllChange(val, i, navbarId) {
      // 全选
      this.$set(this.isIndeterminate, i, false)
      if (val) {
        const res = ['']
        this.menuList.forEach((e, i) => {
          if (e.navbarId === navbarId) {
            res[i] = e.id
          }
        })
        this.$set(this.checkedNavbar, i, navbarId)
        this.$set(this.checkedMenu, i, res)
      } else {
        this.$set(this.checkedNavbar, i, undefined)
        this.$set(this.checkedMenu, i, [])
      }
      this.$set(this.isCheckAll, i, val)
    },
    handleCheckedMenuChange(value, i, navbarId) {
      this.$set(this.checkedNavbar, i, navbarId)
      const checkedCount = value.length
      const allCount = this.menuList.filter(e => {
        return e.navbarId === navbarId
      })
      this.$set(this.isIndeterminate, i, checkedCount > 0 && checkedCount < allCount.length)
      this.$set(this.isCheckAll, i, checkedCount === allCount.length)
    },
    setFormBox(i) {
      this.createRoleStep = i
      this.$refs.formBox.setActiveItem(i)
    },
    getMenuList() {
      this.listLoading = true
      fetchMenuList().then(response => {
        this.menuList = response.data
        this.listLoading = false
      })
    },
    getNavbarList() {
      this.listLoading = true
      fetchNavbarList().then(response => {
        // 初始化
        this.navbarList = response.data
        this.resetMenu()
        this.listLoading = false
      })
    },
    getMenuByRoleId(id) {
      this.listLoading = true
      return new Promise((resolve, reject) => {
        fetchMenuByRoleId(id).then(response => {
          this.resetMenu(response.data)
          this.listLoading = false
          resolve(true)
        })
      })
    },
    getModelList() {
      this.listLoading = true
      fetchModelList().then(response => {
        this.modelList = response.data
        this.listLoading = false
      })
    },
    getSatelliteByRoleId(id) {
      this.listLoading = true
      return new Promise((resolve, reject) => {
        fetchSatelliteByRoleId(id).then(response => {
          // 初始化checkedModel
          const data = response.data
          this.checkedModel = []
          data.forEach(e => {
            this.checkedModel.push(e.satelliteId)
          })
          this.listLoading = false
          resolve(true)
        })
      })
    },
    getUsetList() {
      this.listLoading = true
      fetchUserlList().then(response => {
        this.userList = response.data
        this.listLoading = false
      })
    },
    getUserByRoleId(id) {
      this.listLoading = true
      return new Promise((resolve, reject) => {
        fetchUserListByRoleId(id).then(response => {
          // 初始化checkedModel
          const data = response.data
          this.checkedUser = []
          data.forEach(e => {
            this.checkedUser.push(e.userId)
          })
          this.listLoading = false
          resolve(true)
        })
      })
    },
    getGuestList() {
      this.listLoading = true
      fetchGuestlList().then(response => {
        this.guestList = response.data
        this.listLoading = false
      })
    },
    getGuestByRoleId(id) {
      this.listLoading = true
      return new Promise((resolve, reject) => {
        fetchGuestListByRoleId(id).then(response => {
          // 初始化checkedModel
          const data = response.data
          this.checkedGuest = []
          data.forEach(e => {
            this.checkedGuest.push(e.guestId)
          })
          this.listLoading = false
          resolve(true)
        })
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        // this.total = response.data.totalElements || 0

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
        roleId: undefined,
        roleName: '',
        roleStatus: true,
        roleDesc: ''
      }
    },
    resetMenu(list) {
      this.navbarList.forEach((e, i) => {
        this.isIndeterminate[i] = false
        if (e.navbarDefault) {
          this.checkedMenu[i] = ['']
          this.isCheckAll[i] = true
          this.checkedNavbar[i] = e.navbarId
        } else {
          this.checkedMenu[i] = []
          this.isCheckAll[i] = false
          this.checkedNavbar[i] = undefined
          if (list) {
            list.forEach((ce, ci) => {
              if (e.navbarId === ce.navbarId) {
                const ceMenu = ce.menu.map(me => me.menuId)
                this.checkedMenu[i] = ceMenu.length > 0 ? ceMenu : ['']

                const thisMenuList = this.menuList.filter(ze => ze.navbarId === ce.navbarId)

                this.isCheckAll[i] = ceMenu.length === thisMenuList.length
                this.isIndeterminate[i] = ceMenu.length > 0 && ceMenu.length < thisMenuList.length
                this.checkedNavbar[i] = e.navbarId
              }
            })
          }
        }
      })
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
            this.temp.roleId = res.data.roleId
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
    handleMore(e, row, index) {
      this[e](row, index)
    },
    handleDelete(row, index, mustDel = false) {
      if (row.manager) {
        this.$message({
          message: '系统管理员不允许被删除',
          type: 'error'
        })
        return false
      }
      const msg = mustDel ? '是否继续强制删除该角色，不考虑其关联关系？' : '此操作将永久删除该角色, 是否继续?'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.roleId, mustDel).then(() => {
          this.list.splice(index, 1)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch((err) => {
          if (err.toString().indexOf('9001') > -1) {
            this.handleDelete(row, index, true)
          }
        })
      }).catch(() => {})
    },
    handleEditModel(row) {
      this.getSatelliteByRoleId(row.roleId).then(res => {
        this.temp.roleId = row.roleId
        this.dialogStatus = 'editModel'
        this.createRoleStep = 2
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.setFormBox(2)
        })
      })
    },
    editModel() {
      const roleId = this.temp.roleId
      const modelList = JSON.parse(JSON.stringify(this.checkedModel))
      const properties = []
      modelList.forEach(e => {
        properties.push({ satelliteId: e, permissionType: '1' })
      })

      editSatelliteByRoleId({ roleId, properties }).then((res) => {
        if (this.dialogStatus !== 'create') {
          this.dialogFormVisible = false
        } else {
          this.setFormBox(3)
        }
        this.$notify({
          title: '成功',
          message: '分配型号成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleEditUser(row) {
      Promise.all([this.getUserByRoleId(row.roleId), this.getGuestByRoleId(row.roleId)]).then(res => {
        this.temp.roleId = row.roleId
        this.dialogStatus = 'editUser'
        this.createRoleStep = 3
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.setFormBox(3)
        })
      })
    },
    editUser() {
      const roleId = this.temp.roleId
      const userList = JSON.parse(JSON.stringify(this.checkedUser))
      const guestList = JSON.parse(JSON.stringify(this.checkedGuest))

      const userIds = userList.concat(guestList)

      editUserByRoleId({ roleId, userIds }).then((res) => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '分配权限成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleEditMenu(row) {
      // 初始化当前角色权限
      this.getMenuByRoleId(row.roleId).then((res) => {
        this.temp.roleId = row.roleId
        this.dialogStatus = 'editMenu'
        this.createRoleStep = 1
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.setFormBox(1)
        })
      })
    },
    editMenu() {
      const roleId = this.temp.roleId
      let navbarIds = JSON.parse(JSON.stringify(this.checkedNavbar))
      const menuIds = JSON.parse(JSON.stringify(this.checkedMenu))
      const rmrsType = 'all'

      navbarIds = navbarIds.filter(e => {
        return e
      })

      const newArr = []
      menuIds.forEach(e => {
        if (e.length > 0) newArr.push(e.toString())
      })

      editMenuByRoleId({ roleId, navbarIds, menuIds: newArr, rmrsType }).then((res) => {
        if (this.dialogStatus !== 'create') {
          this.dialogFormVisible = false
        } else {
          this.setFormBox(2)
        }
        this.$notify({
          title: '成功',
          message: '分配权限成功',
          type: 'success',
          duration: 2000
        })
      })
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
    margin: 0 0 0 40px;
    .el-checkbox-group{
      padding: 10px 0 30px 30px;
      .el-checkbox{
        margin: 5px 0;
        min-width: 140px;
      }
    }
  }
</style>
