<template>
  <div class="panel relationBox">
    <model-obj src="/static/3d/file.obj" mtl="/static/3d/file.mtl" style="width: 100%;height:100%;" :background-alpha="0" :width="1000" :hight="500" />
  </div>
</template>

<script>
import 'three'
import { ModelObj } from 'vue-3d-model'
export default {
  components: {
    ModelObj
  },
  data() {
    return {}
  }
}
</script>

<style lang='scss' scoped>
@import 'style/index.scss';

.mainbox {
  .panel.relationBox {
    width: 100%;
    height: 11rem;
  }
}
</style>
