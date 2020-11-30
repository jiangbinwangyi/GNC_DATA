<template>
  <el-form
    ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="right"
    label-width="110px"
    style="width: 530px margin-left:50px"
    :disabled="false"
  >
    <el-form-item label="名称" prop="odiName">
      <el-input v-model="temp.odiName" placeholder="您自定义的连接标识" />
    </el-form-item>
    <el-form-item label="数据源类型" prop="odiSourceType">
      <el-radio
        v-for="(item, index) in odiSourceTypeText"
        :key="index"
        v-model="temp.odiSourceType"
        :label="item.value"
        border
        size="small"
      >{{ item.text }}</el-radio>
    </el-form-item>
    <el-form-item label="用户名" prop="odiUsername">
      <el-input v-model="temp.odiUsername" placeholder="您登录据库时使用的用户名" />
    </el-form-item>
    <el-form-item label="密码" prop="odiPwd">
      <el-input v-model="temp.odiPwd" type="password" placeholder="您登录据库时使用的密码" />
    </el-form-item>
    <el-form-item label="确认密码" prop="odiPwdRepeat">
      <el-input v-model="temp.odiPwdRepeat" type="password" placeholder="请在此确认密码" />
    </el-form-item>
    <el-form-item label="数据源描述">
      <el-input
        v-model="temp.odiDesc"
        :autosize="{ minRows: 4, maxRows: 6}"
        maxlength="80"
        resize="none"
        show-word-limit
        type="textarea"
        placeholder="请自定义您的描述"
      />
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="createData()">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { createArticle } from '@/api/dataUpload/originalDatabase'
import { mapGetters } from 'vuex'

export default {
  props: {
    value: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      temp: {
        odiName: '',
        odiSourceType: '',
        odiIp: '',
        odiPort: '',
        odiDbname: '',
        odiInstance: '',
        odiUsername: '',
        odiPwd: '',
        odiPwdRepeat: '',
        odiDesc: ''
      },
      rules: {
        odiName: [{ required: true, message: '名称必填', trigger: 'blur' }],
        odiUsername: [
          { required: true, message: '数据库用户名必填', trigger: 'blur' }
        ],
        odiPwd: [
          { required: true, message: '数据库密码必填', trigger: 'blur' }
        ],
        odiPwdRepeat: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value !== this.temp.odiPwd) {
                callback(new Error('第二次输入密码不一致'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['odiSourceTypeText'])
  },
  watch: {
    odiSourceTypeText: {
      handler(n) {
        if (n.length) {
          this.temp.odiSourceType = n[0].value
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initTemp()
  },
  methods: {
    initTemp() {
      console.log('value', this.value)
      // 按照规定顺序，ip 端口 数据库名 实例名
      this.temp.odiIp = this.value[0]
      this.temp.odiPort = this.value[1]
      this.temp.odiDbname = this.value[2] || ''
      this.temp.odiInstance = this.value[3] || ''
    },
    resetTemp() {
      this.temp = {
        odiName: '',
        odiSourceType: '0',
        odiDbname: '',
        odiIp: '',
        odiInstance: '',
        odiUsername: '',
        odiPwd: '',
        odiPwdRepeat: '',
        odiPort: '',
        odiDesc: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then((res) => {
            // 这里应该拿到sourceId，传回上一级
            const sourceId = res.data
            this.$emit('success', sourceId)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
