<template>
  <div :class="classObj" class="app-wrapper">
    <div :class="{'fixed-header':fixedHeader}">
      <navbar />
      <tags-view v-if="needTagsView" />
    </div>
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <app-main />
    </div>
    <wholeImportProgress />
  </div>
</template>

<script>
import { AppMain, Navbar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import wholeImportProgress from './components/wholeImportProgress'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    TagsView,
    wholeImportProgress
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: 100%
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
