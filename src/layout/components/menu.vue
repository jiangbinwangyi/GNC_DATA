<template>
  <div :class="{'has-logo':showLogo}">
    <Logo v-if="showLogo" :collapse="true" style="float:left;" />
    <el-scrollbar wrap-class="scrollbar-wrapper" style="float:left;">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
      >
        <!-- <menubar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" /> -->
        <template v-for="item in permission_routes">
          <template v-if="!item.hidden && item.isMenu && item.children">
            <router-link v-if="item.children.length < 2" :key="item.path" :to="resolvePath(item.path, item.path)">
              <el-menu-item :index="item.path">
                <template v-if="item.children.length === 1">
                  <i v-if="item.children[0].meta.icon !== ''" :class="'el-icon-' + item.children[0].meta.icon" />
                  {{ item.children[0].meta.title }}
                </template>
                <template v-else>
                  <i v-if="item.meta.icon !== ''" :class="'el-icon-' + item.meta.icon" />
                  {{ item.meta.title }}
                </template>
              </el-menu-item>
            </router-link>
            <el-submenu v-else :key="item.path" :index="item.path">
              <template slot="title">{{ item.meta.title }}</template>
              <router-link v-for="child in item.children" :key="child.path" :to="resolvePath(child.path, item.path)">
                <el-menu-item v-if="!child.hidden" :index="resolvePath(child.path, item.path)" class="nest-menu">
                  <i v-if="child.meta.icon !== ''" :class="'el-icon-' + child.meta.icon" />
                  {{ child.meta.title }}
                </el-menu-item>
              </router-link>
            </el-submenu>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import { isExternal } from '@/utils/validate'
import variables from '@/styles/variables.scss'
import Logo from './Sidebar/Logo'

export default {
  components: { Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      console.log(path)
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    resolvePath(routePath, basePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return path.resolve(basePath, routePath)
    }
  }
}
</script>
