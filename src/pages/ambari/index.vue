<template>
  <!-- <iframe v-once id="dialogFrame" src="http://172.16.1.81:8080/#/main" seamless frameborder="0" scrolling="no" /> -->
  <div />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      ambariInfo: {
        name: 'jiangbin',
        passworde: 'jiangbin'
      }
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ])
  },
  watch: {
    permission_routes: {
      handler(n) {
        if (n.length > 0) {
          const url = n.filter(e => e.isMenu)
          window.location.href = 'http://172.16.1.81:8080/newHeader.html?url=' + encodeURI(JSON.stringify(url)) + '&user=' + encodeURI(JSON.stringify(this.ambariInfo))
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>
  #dialogFrame{
    margin-top: -50px;
    width: 100%;
    height: calc(100vh - 70px);
  }
</style>
