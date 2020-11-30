<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.witName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.sateinfoName" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item add-button" size="default" type="primary" icon="el-icon-plus" @click="enterImport">
        新建单次导入任务
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
      <el-table-column label="任务名称" prop="sitTaskName" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.sitTaskName }}</span>
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
      <el-table-column label="状态" prop="sitStatus" align="center" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.sitStatus }}</span>
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
  </div>
</template>

<script>
import { fetchList } from '@/api/dataUpload/singleImport'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        witName: undefined,
        sateinfoName: undefined,
        sort: 'createTime',
        direction: 'desc'
      }
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    }
  }
}
</script>

<style>

</style>
