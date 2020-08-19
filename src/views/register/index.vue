<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <!-- 用户名称 -->
      <el-form-item prop="username">
        <span class="icon-container">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconyonghu" />
          </svg>
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="请输入用户名称"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          maxlength="20"
        />
      </el-form-item>

      <!-- 用户密码 -->
      <el-form-item prop="password">
        <span class="icon-container">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconmima" />
          </svg>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="请输入用户密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          maxlength="16"
        />
        <span class="show-pwd" @click="showPwd">
          <svg class="icon" aria-hidden="true">
            <use
              :xlink:href="passwordType === 'password' ? '#iconyincangmima' : '#iconxianshimima2'"
            />
          </svg>
        </span>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item prop="confirmPassword">
        <span class="icon-container">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconmima" />
          </svg>
        </span>
        <el-input
          :key="passwordType"
          ref="confirmPassword"
          v-model="registerForm.confirmPassword"
          :type="passwordType"
          placeholder="请再次输入密码"
          name="confirmPassword"
          tabindex="3"
          auto-complete="on"
          maxlength="16"
        />
        <span class="show-pwd" @click="showPwd">
          <svg class="icon" aria-hidden="true">
            <use
              :xlink:href="passwordType === 'password' ? '#iconyincangmima' : '#iconxianshimima2'"
            />
          </svg>
        </span>
      </el-form-item>

      <!-- 手机号码 -->
      <el-form-item prop="phone">
        <span class="icon-container">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconshouji3" />
          </svg>
        </span>
        <el-input
          ref="phone"
          v-model.number="registerForm.phone"
          placeholder="请输入手机号码"
          name="phone"
          type="text"
          tabindex="4"
          auto-complete="on"
          maxlength="11"
        />
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item prop="verificationCode" class="verificationCode">
        <span class="icon-container">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconyanzhengma" />
          </svg>
        </span>
        <el-input
          ref="verificationCode"
          v-model="registerForm.verificationCode"
          placeholder="请输入验证码"
          name="verificationCode"
          type="text"
          tabindex="5"
          auto-complete="on"
          maxlength="6"
          @keyup.enter.native="handleRegister"
        />
        <el-button
          :disabled="isdisabled"
          type="info"
          @click.stop="handleSendVerificationCode"
        >{{ btnText }}</el-button>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleRegister"
      >立即注册</el-button>
    </el-form>
  </div>
</template>

<script>
import {
  validUsername,
  validPassword,
  validPhone,
  validVerificationCode
} from "@/utils/validate";
import axios from "axios";

export default {
  name: "register",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("用户名称不能为空且不能包含空格"));
      } else {
        axios
          .post("http://127.0.0.1:3000/user/register/usernameValidate", {
            username: value
          })
          .then(res => {
            if (res.data == "已注册") {
              callback(new Error("该用户已注册"));
              console.log("已注册");
            } else {
              callback();
              console.log(res.data);
            }
          })
          .catch(error => {
            this.messageOfRegister(
              "error",
              "服务器错误！请稍后重试",
              4000,
              true
            );
            console.log(error);
          });
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(
          new Error("密码必须由6-16位（字母、数字、! @ # * - _ .）组成")
        );
      } else {
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.registerForm.password != value) {
        callback(new Error("密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error("请输入正确的手机号码（必须由11位数字组成）"));
      } else {
        callback();
      }
    };
    const validateVerificationCode = (rule, value, callback) => {
      if (!validVerificationCode(value)) {
        callback(new Error("验证码不能为空且不能包含空格"));
      } else {
        callback();
      }
    };
    return {
      registerRules: {
        username: [
          { required: true, trigger: "", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "", validator: validatePassword }
        ],
        confirmPassword: [
          {
            required: true,
            trigger: "blur",
            validator: validateConfirmPassword
          }
        ],
        phone: [{ required: true, trigger: "", validator: validatePhone }],
        verificationCode: [
          {
            required: true,
            trigger: "",
            validator: validateVerificationCode
          }
        ]
      },
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        phone: "",
        verificationCode: ""
      },
      passwordType: "password",
      loading: false,
      code: "",
      isdisabled: false,
      btnText: "发送验证码"
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "text";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.confirmPassword.focus();
      });
    },
    messageOfRegister(type, title, time, showClose) {
      this.$notify({
        title: title,
        message: "",
        type: type,
        duration: time,
        showClose: showClose
      });
    },
    handleSendVerificationCode() {
      this.$refs.verificationCode.focus();
      if (this.registerForm.phone == "") {
        this.messageOfRegister("warning", "请输入手机号码！", 4000, true);
      } else {
        axios
          .post("http://127.0.0.1:3000/sms_send", {
            phoneNumber: `${this.registerForm.phone}`
          })
          .then(res => {
            if (res.data.toString() == "500,服务器错误！") {
              this.messageOfRegister(
                "error",
                "服务器错误！请稍后重试！1",
                4000,
                true
              );
            } else if (res.data.toString() == "手机号码不正确") {
              this.messageOfRegister("error", "手机号码不正确!", 4000, true);
            } else {
              this.code = res.data.toString();
              console.log(this.code);
            }
          })
          .catch(error => {
            this.messageOfRegister(
              "error",
              "服务器错误！请稍后重试！2",
              4000,
              true
            );
            console.log(error);
          });
        this.isdisabled = true;
        this.btnText = "发送中";
        let timer1 = setInterval(() => {
          this.btnText += ".";
          if (this.btnText.length == 6) {
            clearInterval(timer1);
            let timer2 = setInterval(() => {
              axios
                .post("http://127.0.0.1:3000/timer")
                .then(res => {
                  console.log(res.data);
                  if (res.data == 0) {
                    this.isdisabled = false;
                    this.btnText = "发送验证码";
                    clearInterval(timer2);
                  } else {
                    this.btnText = "重新获取(" + res.data + "s)";
                  }
                })
                .catch(error => {
                  this.messageOfRegister(
                    "error",
                    "服务器错误！请稍后重试！3",
                    4000,
                    true
                  );
                  console.log(error);
                });
            }, 1000);
          }
        }, 500);
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.registerForm.verificationCode == this.code) {
            axios
              .post("http://127.0.0.1:3000/user/register", this.registerForm)
              .then(res => {
                if (res.data == "success") {
                  this.messageOfRegister(
                    "success",
                    "注册成功,正在为你跳转...",
                    1500,
                    false
                  );
                  this.$router.push({ path: this.redirect || "/login" });
                } else {
                  this.messageOfRegister(
                    "error",
                    "注册失败,请稍后尝试！！！4",
                    4000,
                    true
                  );
                  this.loading = false;
                }
              })
              .catch(error => {
                this.messageOfRegister(
                  "error",
                  "服务器错误！请稍后重试！5",
                  4000,
                  true
                );
                this.loading = false;
                console.log(error + "500");
              });
          } else {
            this.loading = false;
            this.messageOfRegister("error", "验证码错误！6", 4000, true);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    axios
      .post("http://127.0.0.1:3000/timer")
      .then(res => {
        console.log(res.data);
        if (res.data > 0 && res.data < 30) {
          this.isdisabled = true;
          let aa = setInterval(() => {
            axios
              .post("http://127.0.0.1:3000/timer")
              .then(res => {
                console.log(res.data);
                if (res.data == 0) {
                  this.isdisabled = false;
                  this.btnText = "发送验证码";
                  clearInterval(aa);
                } else {
                  this.btnText = "重新获取(" + res.data + "s)";
                }
              })
              .catch(error => {
                this.messageOfRegister(
                  "error",
                  "服务器错误！请稍后重试！6",
                  4000,
                  true
                );
                console.log(error);
              });
          }, 1000);
        }
      })
      .catch(error => {
        this.messageOfRegister(
          "error",
          "服务器错误！请稍后重试！7",
          4000,
          true
        );
        console.log(error);
      });
  },
  mounted() {
    this.$refs.username.focus();
  }
};
</script>


<style lang="scss">
$bg: #283443;
$light_gray: #ccc;
$cursor: #ccc;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
    font-size: 15px;
  }
}

.register-container {
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
  .verificationCode {
    .el-form-item__content {
      display: flex;
      span {
        width: 47.5px;
      }
      .el-button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border: none;
        color: #78a17b;
        background-color: transparent;
        &:hover {
          background-color: #2d3a4b;
          color: #78c17b;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 60px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .el-button {
    font-size: 15px;
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
</style>
