<template>
  <el-container>
    <el-header height="100px">
      <div style="float: left; margin-left: -20px">
        <img src="../assets/logo2.jpg" />
      </div>
      <el-row type="flex" justify="end">
        <el-col :span="18" style="font-weight: 900; font-size: 30px"
          >金融管理系统</el-col
        >
        <el-col :span="6">
          <el-button-group>
            <el-button type="primary">{{ username }}</el-button>
            <el-button type="primary" icon="el-icon-s-data"></el-button>
            <el-button type="primary" icon="el-icon-s-grid"></el-button>
            <el-button type="primary" icon="el-icon-switch-button" @click="logout()"></el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              router
            >
              <el-submenu
                v-for="(menu, index) in menuList"
                :key="index"
                :index="menu.mid + ''"
              >
                <template slot="title">
                  <i :class="menu.glyphicon"></i>
                  <span>{{ menu.menuname }}</span>
                </template>
                <el-menu-item
                  v-for="(subMenu, index) in menu.subMenu"
                  :key="subMenu.mid"
                  :index="subMenu.url"
                  >{{ subMenu.menuname }}</el-menu-item
                >
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <!-- 组件内路由切换，搭配子组件路由 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      menuList: [],
      username: "",
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logout(){
      this.$axios.post("/logout")
      .then(response=>{
        if(response.data.code==320){
          this.$router.push("/login");
        }
      })
    }
  },
  mounted() {
    this.$axios.get("/getUserMenu").then((response) => {
      this.menuList = response.data.data.menuList;
      this.username = response.data.data.loginUser.username;
    });
  },
};
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
}
#app {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.el-container {
  height: 100%;
}

.el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>