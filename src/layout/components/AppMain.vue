<template>
  <section class="app-main">
    <el-breadcrumb separator="/" style="padding: 0 0 0 20px;line-height: 40px;background: #e6ecf3; margin-bottom: 10px;">
      <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-home" style="color: #555" /> 首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadUrl" v-show="item.path !== '' && item.meta.title !== '首页'" :key="index"><a :href="item.path" style="color: #666">{{ item.meta.title }}</a></el-breadcrumb-item>
    </el-breadcrumb>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    breadUrl() {
      return this.$route.matched
    }
  },
  mounted() {
    console.log(this.$route)
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - #{$navBarHeight});
  width: 100%;
  position: relative;
  overflow: hidden;
  padding-top: 66px;
}

// .fixed-header+.app-main {
//   padding-top: 50px;
// }

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 100px);
    padding-top: 100px;
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 0;
  }
}
</style>
