<template>
<div class="login" >
  <Form ref="userForm" :model="userForm" :rules="ruleInline">
      <h3 style="color: red;">{{caution}}</h3>
      <FormItem prop="user">
          <i-input type="text" v-model="userForm.username" size="large" placeholder="Username">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-input>
      </FormItem>
      <FormItem prop="password">
          <i-input type="password" v-model="userForm.password" size="large" placeholder="Password">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-input>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('userForm')">登入</Button>
      </FormItem>
  </Form>
</div>
</template>
<script>
export default {
  data () {
    return {
      userForm: {
        username: 'admin',
        password: '123456'
      },
      ruleInline: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
        ]
      },
      caution: ''
    }
  },
  beforeCreate () {
    this.$cookie.remove('token')
    window.sessionStorage.clear()
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        this.caution = ''
        if (valid) {
          this.$ajax({
            method: 'POST',
            url: '/login',
            params: {
              username: this.userForm.username,
              password: this.userForm.password
            }
          }).then((res) => {
            if (res.code === 200) {
              this.$cookie.set('token', res.token, { expires: 10000 })
              this.$Message.success(res.msg)
              // 登入成功跳转
              this.$router.push({ name: 'mainpath' })
            } else if (res.code === 201) {
              this.caution = '*  ' + res.msg
            } else {
              this.$Message.error(res.msg)
            }
          }).catch((res) => {
            this.$Message.error(res.msg)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
.login {
  background-image:url('./back.jpg');
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  .ivu-form {
    position: fixed;
    bottom: 20em;
    right: 12em;
    width: 400px;
    margin-right: 0em;
    .ivu-input-wrapper {
      width: 260px;
    }
    .ivu-form-item-content {
      width: 260px;
    }
}
}
</style>
