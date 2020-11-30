<template>
  <div class="container">
    <el-header>
      <h1>| {{ activeName }}</h1>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :router="true">
        <el-menu-item index="1" :route="{ path: 'peacetime' }">
          <i class="el-icon-location" />
          <span>平时监控</span>
        </el-menu-item>
        <el-menu-item index="2" :route="{ path: 'wartime' }">
          <i class="el-icon-setting" />
          <span>战时决策</span>
        </el-menu-item>
      </el-menu>
    </el-header>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1'
    }
  },
  computed: {
    activeName() {
      return this.$route.matched[1].meta.name
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
.container{
  width: calc(100% - 0.36rem);
  .el-header{
    border-bottom: solid 3px #415c29;
    margin-top: -.71rem;
  }
  h1{
    display: inline-block;
    width: auto;
    text-align: left;
    font-size: .4rem;
    line-height: 60px;
    vertical-align: middle;
  }
  .el-menu-demo{
    vertical-align: middle;
    display: inline-block;
    background: none;
    border: none;
    overflow: hidden;
    .el-menu-item{
      background: none;
      color: #fff;
      border: none;
      i{
        color: #fff;
      }
      &:hover{
        background: #4b6b2f;
      }
      &.is-active{
        background: #415c29;
      }
    }
  }
}
</style>
