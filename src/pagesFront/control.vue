<template>
  <div>
    <el-button v-for="item in menu" :key="item.src" @click="fetchMenuActive(item.src)">{{ item.name }}</el-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('first', ['menu'])
  },
  created() {
    this.createWebsocket()
  },
  methods: {
    ...mapActions('first', ['createWebsocket', 'fetchMenuActive'])
  }
}
</script>

<style>

</style>
