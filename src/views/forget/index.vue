<template>
  <div class="forget-container">
    <el-form
      ref="forgetForm"
      :model="forgetForm"
      :rules="forgetRules"
      class="forget-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">找回密码</h3>
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
          v-model="forgetForm.username"
          placeholder="请输入用户名称"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          maxlength="20"
        />
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
          v-model.number="forgetForm.phone"
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
          v-model="forgetForm.verificationCode"
          placeholder="请输入验证码"
          name="verificationCode"
          type="text"
          tabindex="5"
          auto-complete="on"
          maxlength="6"
          @keyup.enter.native="handleForget"
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
        @click.native.prevent="handleForget"
      >立即找回</el-button>
    </el-form>
  </div>
</template>

<script>
import {
  validUsername,
  validPhone,
  validVerificationCode
} from "@/utils/validate";
import axios from "axios";

export default {
  name: "forget",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("用户名称不能为空且不能包含空格"));
      } else {
        axios
          .post("http://127.0.0.1:3000/user/forget/usernameValidate", {
            username: value
          })
          .then(res => {
            if (res.data == "已注册") {
              callback();
              console.log("已注册");
            } else {
              callback(new Error("该用户不存在"));
              console.log(res.data);
            }
          })
          .catch(error => {
            this.messageOfForget("error", "服务器错误！请稍后重试", 4000, true);
            console.log(error);
          });
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error("请输入正确的手机号码（必须由11位数字组成）"));
      } else {
        axios
          .post("http://127.0.0.1:3000/user/forget/phoneValidate", {
            username: this.forgetForm.username,
            phone: value
          })
          .then(res => {
            if (res.data == false) {
              callback(new Error("手机号码不正确"));
              console.log("手机号码不正确");
            } else {
              callback();
              console.log("手机号码正确");
            }
          })
          .catch(error => {
            this.messageOfForget("error", "服务器错误！请稍后重试", 4000, true);
            console.log(error);
          });
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
      forgetRules: {
        username: [
          { required: true, trigger: "", validator: validateUsername }
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
      forgetForm: {
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
    messageOfForget(type, title, time, showClose) {
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
      if (this.forgetForm.phone == "") {
        this.messageOfForget("warning", "请输入手机号码！", 4000, true);
      } else {
        axios
          .post("http://127.0.0.1:3000/sms_send", {
            phoneNumber: `${this.forgetForm.phone}`
          })
          .then(res => {
            if (res.data.toString() == "500,服务器错误！") {
              this.messageOfForget(
                "error",
                "服务器错误！请稍后重试！1",
                4000,
                true
              );
            } else if (res.data.toString() == "手机号码不正确") {
              this.messageOfForget("error", "手机号码不正确!", 4000, true);
            } else {
              this.code = res.data.toString();
              console.log(this.code);
            }
          })
          .catch(error => {
            this.messageOfForget(
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
                  this.messageOfForget(
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
    handleForget() {
      this.$refs.forgetForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.forgetForm.verificationCode == this.code) {
            axios
              .post("http://127.0.0.1:3000/user/forget", this.forgetForm)
              .then(res => {
                if (res.data == false) {
                  this.messageOfForget(
                    "error",
                    "找回失败",
                    4000,
                    false
                  );
                  this.loading = false;
                } else {
                  this.messageOfForget(
                    "success",
                    "找回成功，您的密码为："+res.data.password,
                    8000,
                    true
                  );
                  this.$router.push({ path: this.redirect || "/login" });
                  this.loading = false;
                }
              })
              .catch(error => {
                this.messageOfForget(
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
            this.messageOfForget("error", "验证码错误！6", 4000, true);
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
                this.messageOfForget(
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
        this.messageOfForget("error", "服务器错误！请稍后重试！7", 4000, true);
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
  .forget-container .el-input input {
    color: $cursor;
    font-size: 15px;
  }
}

.forget-container {
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

.forget-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .forget-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
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
