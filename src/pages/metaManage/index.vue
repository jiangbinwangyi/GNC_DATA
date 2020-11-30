<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="型号">
          <el-select placeholder="选择型号" :value="metaFilter.sateInfoId" :filterable="true" @change="toTestProjectList($event)">
            <el-option v-for="(item) in satelliteList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="测试编号">
          <el-select placeholder="选择测试编号" :value="metaFilter.tpiId" :filterable="true" @change="toTableList($event)">
            <el-option v-for="(item) in testProjectList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据分类">
          <el-cascader
            ref="dataClassificationSelect"
            :value="metaFilter.dcId"
            :options="dataclassificationList"
            :props="{ checkStrictly: true, value: 'id', label: 'label', emitPath: false }"
            clearable
            :filterable="true"
            @visible-change="toTableList(metaFilter.tpiId, $event)"
          />
        </el-form-item>
      </el-form>
    </div>
    <router-view :key="key" />
    <!-- <el-row>
      <el-col :span="5">
        <div class="dataManageLeft">
          <el-tree :load="loadNode" lazy :props="defaultProps" accordion :highlight-current="true" @node-click="getTable" />
        </div>
      </el-col>
      <el-col :span="19">
        <div class="dataManageMain">
          <router-view :key="key" />
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      defaultProps: {
        children: 'zones',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    ...mapState('manage', ['metaFilter', 'satelliteList', 'testProjectList', 'dataclassificationList'])
  },
  methods: {
    toTestProjectList(sateInfoId) {
      // 请求test，并且跳到test列表页
      this.getTestProjectList(sateInfoId)
      this.$router.push({ path: '/metaManage/index/test/' + sateInfoId })
    },
    toTableList(tpiId, dcIdArr) {
      let id = tpiId
      let type = 'tpi'
      if (dcIdArr !== undefined) {
        // 菜单关闭时触发请求，如果用change触发的话会有bug，element让人无语了
        if (dcIdArr === false) {
          const dcId = this.$refs.dataClassificationSelect.getCheckedNodes()[0].data['id']
          // 如果选项没变不提交
          if (this.metaFilter.dcId === dcId) return
          this.setMetaFilterDcId(dcId)
          id = dcId
          type = 'dc'
        } else {
          return
        }
      } else {
        this.getDataclassificationList(tpiId)
      }
      this.$router.push({ path: '/metaManage/index/table/' + id, query: { type }})
    },
    // getTableList(data, node) {
    //   if (node.level > 1) {
    //     this.$router.push({ path: '/metaManage/index/table/', query: { tpiId: data.id }})
    //   }
    // },
    loadNode(node, resolve) {
      console.log(node)
      if (node.level === 0) {
        this.getSatelliteList().then(res => {
          const result = res.data.map(e => {
            return {
              id: e.sateinfoId,
              name: e.sateinfoName
            }
          })
          return resolve(result)
        })
        return resolve([])
      }
      if (node.level === 1) {
        this.getTestProjectList(node.data.id).then((res) => {
          const result = res.data.map(e => {
            return {
              name: e.tpiName,
              id: e.tpiId,
              isLeaf: 'leaf'
            }
          })

          resolve(result)
        })
      }
      if (node.level === 2) {
        this.getDataClassificationList(node.data.id).then((res) => {
          console.log(res)
          const result = res.data.map(e => {
            return {
              name: e.dcName,
              id: e.dcId,
              leaf: true
            }
          })

          resolve(result)
        })
      }
    },
    ...mapMutations('manage', ['setMetaFilterDcId']),
    ...mapActions('manage', ['getSatelliteList', 'getTestProjectList', 'getDataclassificationList'])
  }
}
</script>

<style lang="scss">
.dataManageLeft{
    padding: 10px;
    background: #F5F7FA;
    height: calc(100vh - 160px);
    border: 1px solid #dfe6ec;
    overflow: auto;
    .el-tree{
        background: none;
        &.el-tree--highlight-current{
          .el-tree-node.is-current > .el-tree-node__content{
            background: #005eac;
            color: #fff;
          }
        }
    }
}
</style>
