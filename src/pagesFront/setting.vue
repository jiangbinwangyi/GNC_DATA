<template>
  <div>
    <div class="settingTop settingBorder" :gutter="10" style="margin-bottom: .2rem;">
      <router-link to="/basic" class="settingbox">
        <img src="@/assets/images/set1.png" alt="">
        <p><i class="el-icon-video-camera-solid" /> 实时监测</p>
      </router-link>
      <router-link to="/3Dmodel" class="settingbox">
        <img src="@/assets/images/set2.png" alt="">
        <p><i class="el-icon-message-solid" /> 故障诊断</p>
      </router-link>
      <router-link to="/relation" class="settingbox">
        <img src="@/assets/images/set3.png" alt="">
        <p><i class="el-icon-s-marketing" /> 检测分析</p>
      </router-link>
      <router-link to="/track" class="settingbox">
        <img src="@/assets/images/set4.png" alt="">
        <p><i class="el-icon-s-opportunity" /> 实时预测</p>
      </router-link>
    </div>
    <el-row class="settingBottom" :gutter="10">
      <el-col :span="12">
        <div class="settingBorder">
          <el-carousel indicator-position="none" :autoplay="false" height="2rem">
            <el-carousel-item v-for="car in 3" :key="car + 'k'">
              <el-row :gutter="10">
                <el-col v-for="item in 3" :key="item + car * 3 - 3" :span="8">
                  <div class="settingbox" @click="setActiveImg(item + car * 3 - 3, 'gnc')">
                    <img :src="'/static/GNC/gnc' + (item + car * 3 - 3) + '.png'" style="width: 100%; height: auto;" alt="">
                    <p style="margin-bottom: 0">{{ item + car * 3 - 3 }}</p>
                  </div>
                </el-col>
              </el-row>
            </el-carousel-item>
          </el-carousel>
          <div class="settingTitle">基于数据故障诊断</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="settingBorder">
          <el-carousel indicator-position="none" :autoplay="false" height="2rem">
            <el-carousel-item v-for="car in 3" :key="car + 'k'">
              <el-row :gutter="10">
                <el-col v-for="item in 3" :key="item + car * 3 - 3" :span="8">
                  <div class="settingbox" @click="setActiveImg(item + car * 3 - 3, 'phm')">
                    <img :src="'/static/phm/phm' + (item + car * 3 - 3) + '.png'" style="width: 100%; height: auto;" alt="">
                    <p style="margin-bottom: 0">{{ imgTitle[item + car * 3 - 4] }}</p>
                  </div>
                </el-col>
              </el-row>
            </el-carousel-item>
          </el-carousel>
          <div class="settingTitle">基于规则故障诊断</div>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" custom-class="setDialog" width="99.6%" top="0">
      <div class="dialogMain">
        <el-carousel ref="diabox" :autoplay="false" height="100vh">
          <el-carousel-item v-for="item in 9" :key="item + 'j'">
            <img :src="'/static/' + activeType + '/' + activeType + item + '.png'" style="width: 100%; height: auto;" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      activeImg: 1,
      activeType: 'phm',
      imgTitle: [
        '1.型号规则绑定-门限规则',
        '2.型号规则绑定-判读规则',
        '3.型号规则绑定-诊断规则',
        '4.规则库管理-脚本规则编辑',
        '5.规则库管理-图形化规则编辑',
        '6.规则库管理-共享算法编辑',
        '7.监视诊断-快速监视',
        '8.监视诊断-全部监视',
        '9.监视诊断-重点监视'
      ]
    }
  },
  methods: {
    setActiveImg(i, type) {
      this.activeType = type
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['diabox'].setActiveItem(i - 1)
      })
    }
  }
}
</script>

<style lang="scss">
.settingBorder {
  border: solid 1px #11224e;
  padding: .1rem;
  font-size: 0;
  position: relative;
}
.settingbox{
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 0;
  position: relative;
  cursor: pointer;
  img{
    width: 100%;
  }
  p{
    font-size: .2rem;
    color: #16aef1;
    line-height: 2.5;
    margin: 0 0 0 0;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background: rgba($color: #000, $alpha: .5);
    display: none;
  }
}
.settingTop{
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow:row wrap;
  .settingbox {
    width: 36%;
    &:nth-child(even) {
      margin-left: 1.8rem
    }
  }
}
.settingBottom {
  .settingBorder{
    overflow: hidden;
    &:hover{
      .settingTitle{
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
  .settingTitle{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background: rgba($color: #666, $alpha: .6);
    line-height: 2;
    font-size: .15rem;
    color: #fff;
    z-index: 2;
    transform: translateY(100%);
    opacity: 0;
    transition: all .2s ease-in;
  }
}
.el-dialog.setDialog{
  .el-dialog__header{
    padding: 0;
    .el-dialog__headerbtn{
      top: 0;
      z-index: 3;
      opacity: 0;
      right: 0;
      font-size: .4rem;
    }
  }
  .el-dialog__body{
    padding: 0;
  }
}
</style>
