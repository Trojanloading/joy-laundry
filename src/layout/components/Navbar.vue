<template>
  <div class="navbar">
    <!-- logo -->
    <div class="logo-container">
      <img src="@/assets/logo.svg" style="width: 30px;margin-right: 5px" />
      <span>Joy Laundry</span>
    </div>
    <!-- 伸缩 -->
    <div class="sidebar-scaling" @click.stop="isHideSidebar">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconshousuo" />
      </svg>
    </div>
    <!-- 刷新 -->
    <!-- <div class="refresh" @click.stop="dogo">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconshuaxin1" />
      </svg>
    </div>-->
    <!-- breadcrumb面包屑 -->
    <!-- <div class="breadcrumb-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>收取衣物</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <!-- 右边 -->
    <div class="nav-right">
      <el-dropdown
        trigger="hover"
        @command="handleCommand"
        @mouseenter.native="enter"
        @mouseleave.native="leave"
      >
        <span class="el-dropdown-link">
          <img class="pikaqiuImg" src="@/assets/1.gif" alt="账号" />
          {{ username }}
          <i ref="icon" class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <logout :isdialogFormVisible="isopen1" @change="handleChange" />
    <changePassword :isdialogFormVisible="isopen2" @change="handleChange" />
  </div>
</template>

<script>
import logout from "./logout";
import changePassword from "./changePassword"
import axios from "axios";
import * as cookieUtils from "@/utils/cookie";

export default {
  name: "Navbar",
  data() {
    return {
      username: "",
      isopen1: false,
      isopen2: false
    };
  },
  components: { logout,changePassword },
  computed: {},
  methods: {
    isHideSidebar() {
      const appbox = document.getElementsByClassName("app-wrapper");
      if (appbox[0].className == "app-wrapper") {
        appbox[0].className = "app-wrapper hideSidebar";
        this.$store.commit("user/SET_ISHIDESIDEBAR", true);
        console.log(this.$store.state.user.ishideSidebar);
      } else {
        appbox[0].className = "app-wrapper";
        this.$store.commit("user/SET_ISHIDESIDEBAR", false);
      }
      // appbox[0].className == "app-wrapper"
      //   ? "app-wrapper hideSidebar"
      //   : "app-wrapper";
    },
    dogo() {
      console.log(this.$router);
    },
    reload() {
      alert(this.$route);
      // 移除组件
      this.update = false;
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
      this.$nextTick(() => {
        this.update = true;
      });
    },
    handleCommand(command) {
      if (command == "logout") {
        this.isopen1 = true;
      } else if(command =="changePassword") {
        this.isopen2 = true;
      }
    },
    handleChange(){
      this.isopen1= false;
      this.isopen2 = false;
    },
    enter() {
      this.$refs.icon.className = "el-icon-caret-top el-icon--right";
    },
    leave() {
      this.$refs.icon.className = "el-icon-caret-bottom el-icon--right";
    }
  },
  mounted() {
    let user_id =
      cookieUtils.getCookie("adminid") || cookieUtils.getCookie("userid");
    axios
      .post("http://127.0.0.1:3000/layout/navbar/getUsername", {
        user_id: user_id
      })
      .then(res => {
        console.log(res.data);
        if (res.data == false) {
          console.log("查找username失败");
        } else {
          this.username = res.data.username;
          console.log("查找username成功");
        }
      })
      .catch(error => {
        this.$message({
          message: "服务器可能走神了！稍后尝试1321",
          type: "error",
          center: true,
          offset: "0"
        });
        console.log(error);
        return false;
      });
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  width: 100%;
  .logo-container {
    width: 230px;
    height: 50px;
    font-size: 18px;
    line-height: 50px;
    text-align: center;
    float: left;
    transition: all 0.3s ease;
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .sidebar-scaling,
  .refresh,
  .nav-right {
    display: inline-block;
    text-align: center;
    width: 45px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: #88af7f;
    }
  }
  .breadcrumb-container {
    display: inline-block;
    line-height: 50px;
    margin-left: 10px;
  }
  .nav-right {
    float: right;
    width: auto;
    padding: 0 15px;
    .el-dropdown-link {
      color: #eee;
      height: 50px;
      line-height: 50px;
      display: inline-block;
      width: 100%;
      .pikaqiuImg {
        width: 35px;
        height: 35px;
        border-radius: 100px;
        margin-right: 5px;
      }
    }
  }
}
</style>
