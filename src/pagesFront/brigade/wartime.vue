<template>
  <div class="panel form">
    <h2>作战任务详情</h2>
    <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="100px" class="demo-dynamic">
      <el-form-item
        prop="email"
        label="任务名"
      >
        <el-input value="XXXX任务" readonly />
      </el-form-item>
      <el-form-item
        prop="address"
        label="集结地点"
      >
        <el-input value="福建省厦门市" readonly />
      </el-form-item>
      <el-form-item
        prop="address"
        label="环境条件"
      >
        <el-input value="多潮湿、温度高" readonly />
      </el-form-item>
      <el-form-item
        prop="address"
        label="里程"
      >
        <el-input value="1700公里" readonly />
      </el-form-item>
      <el-form-item
        label="集结时间"
      >
        <el-col :span="11">
          <el-date-picker v-model="dynamicValidateForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="dynamicValidateForm.date2" placeholder="选择时间" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-row v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">
        <el-form-item
          :label="'装备需求' + index"
          :prop="'domains.' + index + '.value1'"
          class="item2"
        >
          <el-input v-model="domain.value1" class="input1" placeholder="装备种类" />
        </el-form-item>
        <el-form-item
          :label="'装备数量' + index"
          :prop="'domains.' + index + '.value2'"
          class="item2"
        >
          <el-input v-model="domain.value2" class="input2" placeholder="装备数量" />
          <el-button class="button1" @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
      </el-row>
      <el-form-item class="submit">
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">生成战时规划</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dynamicValidateForm: {
        domains: [{
          value1: '',
          value2: ''
        }],
        email: '',
        date1: '',
        date2: '',
        address: ''
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$router.push({ path: '/brigade/wartime2' })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value1: '',
        value2: '',
        key: Date.now()
      })
    }
  }
}
</script>
<style scoped>
.form {
  width: 60%;
  margin: .6rem auto;
}
#label {
  color: #ccc;
}
.submit {
  float: right;
  margin-top: 1.25rem;
}
.input1, .input2 {
  width: 7.45rem;
}
.input1 {
  margin-right: 0.3rem;
}
.item2 {
  float: left;
}
.el-form-item__label {
  color: #ccc !important;
}
</style>
