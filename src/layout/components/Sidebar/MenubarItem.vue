<template>
  <div v-if="!item.hidden && item.isMenu && item.children" class="myMenu">
    <app-link v-if="item.children.length < 2" :to="resolvePath(item.path)">
      <el-menu-item :index="item.path">
        <template v-if="item.children.length === 1">
          <i :class="item.children[0].meta.icon"></i>
          {{ item.children[0].meta.title }}
        </template>
        <template v-else>
          <i :class="item.meta.icon"></i>
          {{ item.meta.title }}
        </template>
      </el-menu-item>
    </app-link>
    <el-submenu v-else :index="item.path">
      <template slot="title">{{ item.meta.title }}</template>
      <app-link v-for="child in item.children" :key="child.path" :to="resolvePath(child.path)">
        <el-menu-item :index="resolvePath(child.path)" class="nest-menu">
          {{ child.meta.title }}
        </el-menu-item>
      </app-link>
    </el-submenu>
  </div>
  <!-- <div v-if="!item.hidden" class="myMenu">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div> -->
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
// import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { AppLink },
  mixins: [FixiOSBug],
  props: {
    // item object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },

    generateTitle
  }
}
</script>

<style lang="scss">
.myMenu{
  display: inline-block;
  .el-submenu__title, .el-menu-item{
    height: 66px;
    line-height: 66px;
    &.is-active{
      background-color: #e6ecf3;
    }
  }
  &.nest-menu{
    display: block;
    .el-menu-item span{
      padding-left: 10px;
    }
  }
}
.el-submenu__title{
  padding-right: 40px;
}
</style>
