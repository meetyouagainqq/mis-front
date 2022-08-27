<template>
  <div>
    <el-card class="box-card loginpanel">
      <div slot="header" class="clearfix">
        <span>登录</span>
      </div>
      <div>
        <el-form
          ref="loginForm"
          :model="form"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="form.username"
              clearable
              suffix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              show-password
              suffix-icon="el-icon-goods"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post("/login", this.$qs.stringify(this.form))
            .then((resp) => {
              console.log(resp.data.data);
              if (resp.data.code == 200) {
                this.$router.push("/main");
              } else if (resp.data.code == 409) {
                this.$message.error(resp.data.msg);
              }
            });

          //console.log("登陆成功");
        } else {
          console.log("错误的提交");
          return false;
        }
      });
    },
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}

div .loginpanel {
  margin: auto;
  left: 0;
  right: 0;
  top: 25%;
  position: absolute;
}
</style>