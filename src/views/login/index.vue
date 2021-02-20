<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Joy Laundry</h3>
      </div>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <span class="icon-container">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconyonghu" />
          </svg>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名称"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          maxlength="20"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="icon-container">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconmima" />
          </svg>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入用户密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          maxlength="16"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg class="icon" aria-hidden="true">
            <use
              :xlink:href="passwordType === 'password' ? '#iconyincangmima' : '#iconxianshimima2'"
            />
          </svg>
        </span>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item
        tabindex="3"
        prop="clickValidation"
        class="clickValidation"
        @mousedown.stop.native="validationOpen"
        @mouseup.stop.native="validationClose"
        @keydown.enter.stop.native="validationOpen"
        @keyup.enter.stop.native="validationClose"
        @keyup.enter.native="handleLogin"
      >
        <el-button type="primary" class="validationBtn" :style="{ width:start+'px' }">
          <i class="el-icon-success"></i>长按验证
        </el-button>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
      <div class="register">
        <router-link to="/forget">忘记密码？</router-link>
      </div>
      <div class="register">
        <router-link to="/register">注册</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import axios from "axios";
import * as cookieUtils from "@/utils/cookie";

export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("用户名称不能为空，且不能包含空格"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!/^[\w]{6,16}$/.test(value)) {
        callback(new Error("密码必须为 6~16 位，且不能有空格"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (!this.end) {
        callback(new Error("请长按鼠标或者Enter验证"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "", validator: validatePassword }
        ],
        clickValidation: [
          { required: true, trigger: "", validator: validateCode }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      start: 0,
      end: false,
      timer: null,
      userid: ""
    };
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     this.redirect = route.query && route.query.redirect;
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    this.$refs.username.focus();
  },
  methods: {
    messageOfRegister(type, title, time, showClose) {
      this.$notify({
        title: title,
        message: "",
        type: type,
        duration: time,
        showClose: showClose
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    validationOpen() {
      // 按下鼠标触发
      let validationBtn = document.getElementsByClassName("validationBtn")[0];
      validationBtn.style.opacity = "1";
      this.start = 448;
      document.getElementsByClassName("clickValidation")[0].style.border =
        "1px solid #78a17b";
      // 鼠标按住时长触发
      this.timer = setTimeout(() => {
        this.end = true;
        validationBtn.getElementsByTagName("span")[0].style.color = "#78a17b";
        validationBtn.style.backgroundColor = "#2d3a4b";
        // 改变文字内容
        validationBtn.getElementsByTagName("span")[0].innerHTML =
          '<i class="el-icon-success"></i>验证成功';
        // 边框变色
        document.getElementsByClassName("clickValidation")[0].style.border =
          "1px solid #78a17b";
        // 隐藏验证码未验证提示
        let dd = document.getElementsByClassName("clickValidation")[0];
        if (dd.getElementsByClassName("el-form-item__error")[0]) {
          dd.getElementsByClassName("el-form-item__error")[0].style.opacity =
            "0";
        }
      }, 550);
    },
    validationClose() {
      // 松开鼠标触发
      let validationBtn = document.getElementsByClassName("validationBtn")[0];
      if (!this.end) {
        // 清掉定时器，回归初始
        clearTimeout(this.timer);
        this.start = 0;
        document.getElementsByClassName("clickValidation")[0].style.border =
          "1px solid rgba(255, 255, 255, 0.1)";
        validationBtn.style.opacity = "0.5";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          axios
            .post("http://127.0.0.1:3000/user/login", this.loginForm)
            .then(res => {
              // console.log(res.data._id);
              if (res.data._id) {
                // this.$store.commit("user/SET_USERID", res.data._id);
                // console.log(this.$store.state.user.userid);
                if (res.data.username == "admin" || res.data.username == "luoshuo") {
                  cookieUtils.setCookie("adminid", res.data._id, 15);
                  cookieUtils.delCookie("userid");
                } else {
                  cookieUtils.setCookie("userid", res.data._id, 15);
                  cookieUtils.delCookie("adminid");
                }
                this.$router.push({ path: this.redirect || "/homepage" });
                this.messageOfRegister(
                  "success",
                  "登录成功,正在为你跳转...",
                  1500,
                  false
                );
              } else {
                this.loading = false;
                this.messageOfRegister(
                  "error",
                  "登录失败,用户名或密码错误！！！",
                  4000,
                  true
                );
              }
            })
            .catch(error => {
              this.messageOfRegister(
                "error",
                "服务器错误,请稍后尝试！！！",
                4000,
                true
              );
              this.loading = false;
              console.log(error + "500");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #ccc;
$cursor: #ccc;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    font-size: 15px;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    font-size: 15px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
      &::placeholder {
        color: #666;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    height: 52px;
    svg {
      margin: 0;
    }
  }
  .clickValidation {
    cursor: pointer;
    transition: all 0.6s ease-in-out;
    .el-form-item__content {
      display: flex;
      justify-content: center;
      border-radius: 5px;
      width: 100%;
      height: 100%;
      .validationBtn {
        height: 100%;
        width: 0px;
        opacity: 0.5;
        padding: 0;
        border: none;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        transition: all 0.6s ease-in-out;
        span {
          // color: #78a17b;
          margin: 15px;
          color: #eee;
          margin: 15px;
        }
        i {
          font-size: 20px;
          vertical-align: -2px;
          margin-right: 5px;
        }
      }
      .el-form-item__error {
        transition: all 0.3s ease;
      }
    }
    &:hover {
      background-color: #2d3a4b;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    .register {
      // text-align: right;
      float: right;
      margin-left: 20px;
      // display: inline;
      cursor: pointer;
      @include user-select-none;
      a {
        color: #78a17b;
        &:hover {
          color: rgb(147, 180, 149);
        }
      }
    }
    .el-button {
      font-size: 15px;
      margin: 0 0 10px 0 !important;
    }
    .icon-container {
      padding: 5px 0px 5px 15px;
      color: $dark_gray;
      vertical-align: top;
      width: 40px;
      display: inline-block;
    }
    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
        @include user-select-none;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
