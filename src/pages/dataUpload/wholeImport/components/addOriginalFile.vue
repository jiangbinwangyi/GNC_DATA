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
    <el-form-item label="主机IP" prop="ofsIp">
      <el-input :value="temp.ofsIp + ':' + temp.ofsPort" placeholder="0.0.0.0" readonly="readonly">
        <template slot="prepend">http://</template>
      </el-input>
    </el-form-item>
    <el-form-item label="名称" prop="ofsName">
      <el-input v-model="temp.ofsName" />
    </el-form-item>
    <el-form-item label="文件源类型" prop="ofsType">
      <el-radio v-for="(item, index) in ofsTypeText" :key="index" v-model="temp.ofsType" :label="item" border>{{ item }}</el-radio>
    </el-form-item>
    <el-form-item label="密码" prop="ofsPwd">
      <el-input v-model="temp.ofsPwd" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="ofsPwdRepeat">
      <el-input v-model="temp.ofsPwdRepeat" type="password" />
    </el-form-item>
    <el-form-item label="文件源描述">
      <el-input v-model="temp.ofsDesc" :autosize="{ minRows: 4, maxRows: 6}" maxlength="80" resize="none" show-word-limit type="textarea" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="createData()">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { createArticle } from '@/api/dataUpload/originalFile'

export default {
  props: {
    value: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      ofsTypeText: ['FTP'],
      temp: {
        ofsName: '',
        ofsType: 'FTP',
        ofsUsername: '',
        ofsIp: '',
        ofsPwd: '',
        ofsPwdRepeat: '',
        ofsPort: '',
        ofsDesc: ''
      },
      rules: {
        ofsName: [{ required: true, message: '名称必填', trigger: 'blur' }],
        ofsUsername: [{ required: true, message: '文件库用户名必填', trigger: 'blur' }],
        ofsPwd: [{ required: true, message: '文件库密码必填', trigger: 'blur' }],
        ofsPort: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          const exp = new RegExp(/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/)
          if (!exp.test(value)) {
            callback(new Error('请输入正确的端口号(0-65535)'))
          } else {
            callback()
          }
        } }],
        ofsIp: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          const exp = new RegExp(/(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/g)
          if (!exp.test(value)) {
            callback(new Error('请输入正确的主机IP(0.0.0.0)'))
          } else {
            callback()
          }
        } }],
        ofsPwdRepeat: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          if (value !== this.temp.ofsPwd) {
            callback(new Error('第二次输入密码不一致'))
          } else {
            callback()
          }
        } }]
      }
    }
  },
  created() {
    this.initTemp()
  },
  methods: {
    initTemp() {
      console.log('value', this.value)
      // 按照规定顺序，ip 端口 数据库名 实例名
      this.temp.ofsIp = this.value[0]
      this.temp.ofsPort = this.value[1]
      this.temp.ofsUsername = this.value[2] || ''
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then((res) => {
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
