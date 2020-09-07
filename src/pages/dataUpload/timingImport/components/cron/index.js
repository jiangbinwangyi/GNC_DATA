import vueCron from './index.vue'

export const cron = vueCron

export default {
  install(Vue) {
    Vue.component(vueCron.name, vueCron)
  }
}
