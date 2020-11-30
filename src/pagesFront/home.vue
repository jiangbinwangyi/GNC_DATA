<template>
  <div class="home">
    <router-link to="/topLevel/peacetime">
      <el-button><img src="../assets/front/images/home1.png">顶层决策应用</el-button>
    </router-link>
    <router-link to="/brigade/peacetime">
      <el-button><img src="../assets/front/images/home2.png">旅级执行应用</el-button>
    </router-link>
    <router-link to="/rocket">
      <el-button><img src="../assets/front/images/home3.png">火箭军装备管理</el-button>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import 'style/index.scss';

.home {
  width: 100%;
  .el-button{
    display: block;
    margin: .6rem auto;
    width: 6rem;
    font-size: .4rem;
    color: #fff;
    background: #415c29;
    padding: .2rem 0;
    border: solid 1px #2b3c1b;
    img {
      width: .8rem;
      vertical-align: middle;
      margin-right: .4rem;
    }
    &:hover{
      background: #4b6b2f;
    }
    &:active{
      background: #415c29;
    }
  }
}
</style>
