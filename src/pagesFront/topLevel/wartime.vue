<template>
  <div class="panel form">
    <h2>发布作战任务</h2>
    <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="100px" class="demo-dynamic">
      <el-form-item
        prop="email"
        label="任务名"
      >
        <el-input v-model="dynamicValidateForm.email" />
      </el-form-item>
      <el-form-item
        label="集结时间"
      >
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker v-model="dynamicValidateForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker v-model="dynamicValidateForm.date2" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        prop="address"
        label="集结地点"
      >
        <el-input v-model="dynamicValidateForm.address" />
      </el-form-item>
      <el-row v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">
        <el-col :span="12">
          <el-form-item
            :label="'装备需求' + index"
            :prop="'domains.' + index + '.value1'"
          >
            <el-input v-model="domain.value1" placeholder="装备种类" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="'装备数量' + index"
            :prop="'domains.' + index + '.value2'"
          >
            <el-input v-model="domain.value2" placeholder="装备数量">
              <el-button slot="append" icon="el-icon-close" @click.prevent="removeDomain(domain)" />
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button icon="el-icon-plus" @click="addDomain">新增装备需求</el-button>
      </el-form-item>
      <el-form-item class="submit">
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">立即规划</el-button>
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
      this.$router.push({ path: '/topLevel/wartime2' })
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
<style scoped lang="scss">
.form {
  width: 60%;
  margin: .6rem auto;
  .el-form{
    .el-form-item.el-form-item--medium{
      label.el-form-item__label {
        color: #ffffff !important;
      }
    }
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
}
</style>
