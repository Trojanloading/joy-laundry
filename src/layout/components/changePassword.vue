<template>
  <!-- 注销 -->
  <div class="changePassword-container">
    <el-dialog title="修改密码" top="25vh" :visible.sync="dialogFormVisible">
      <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="changePasswordRules">
        <div class="arrangement">
          <el-form-item prop="oldPassword">
            <label>原始密码:</label>
            <el-input
              placeholder="请输入原始密码"
              name="oldPassword"
              v-model="changePasswordForm.oldPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="newPassword">
            <label>新的密码:</label>
            <el-input
              placeholder="请输入新的密码"
              name="newPassword"
              v-model="changePasswordForm.newPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="newPasswordAgain">
            <label>确认密码:</label>
            <el-input
              placeholder="请再次输入密码"
              name="newPasswordAgain"
              v-model="changePasswordForm.newPasswordAgain"
              @keyup.enter.native="handleChangePassword"
              show-password
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleChangePassword"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import * as cookieUtils from "@/utils/cookie";
import { validPassword } from "@/utils/validate";

export default {
  name: "changePassword",
  components: {},
  props: {
    isdialogFormVisible: {
      type: Boolean
    }
  },
  data() {
    const validateOldPassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error("密码由6-16位（字母 数字 ! @ # * - _ .）组成"));
      } else {
        callback();
      }
    };
    const validateNewPassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error("密码由6-16位（字母 数字 ! @ # * - _ .）组成"));
      } else if (this.changePasswordForm.oldPassword == value) {
        callback(new Error("新密码不能与旧密码相同"));
      } else {
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.changePasswordForm.newPassword != value) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      btnText: "确 定",
      loading: false,
      changePasswordForm: {
        oldPassword: "",
        newPassword: "",
        newPasswordAgain: "",
        user_id: ""
      },
      changePasswordRules: {
        oldPassword: [
          { required: true, trigger: "", validator: validateOldPassword }
        ],
        newPassword: [
          { required: true, trigger: "", validator: validateNewPassword }
        ],
        newPasswordAgain: [
          { required: true, trigger: "", validator: validateConfirmPassword }
        ]
      }
    };
  },
  watch: {
    isdialogFormVisible: function(newVal) {
      this.dialogFormVisible = newVal;
    },
    dialogFormVisible: function() {
      if (!this.dialogFormVisible) this.$emit("change");
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
      this.$refs.changePasswordForm.resetFields();
    },
    handleChangePassword() {
      this.$refs.changePasswordForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.btnText = "";
          let user_id =
            cookieUtils.getCookie("adminid") || cookieUtils.getCookie("userid");
          this.changePasswordForm.user_id = user_id;
          axios
            .post(
              "http://127.0.0.1:3000/layout/changePassword",
              this.changePasswordForm
            )
            .then(res => {
              console.log(res.data);
              if (res.data == true) {
                this.$message({
                  message: "密码修改成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                  this.$refs.changePasswordForm.resetFields();
                  this.dialogFormVisible = false;
                }, 500);
                console.log("密码修改成功");
              } else {
                this.$message({
                  message: "密码不正确",
                  type: "warning",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                  // this.$refs.changePasswordForm.resetFields();
                }, 500);
                console.log("密码修改失败");
                return false;
              }
            })
            .catch(error => {
              this.$message({
                message: "服务器可能走神了！稍后尝试",
                type: "error",
                center: true,
                offset: "0"
              });
              this.loading = false;
              this.btnText = "确 定";
              console.log(error);
              return false;
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
.changePassword-container {
  .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog {
      // margin-top: 200px !important;
      min-width: 350px;
      width: 30%;
      border-radius: 10px;
      .el-dialog__header {
        font-weight: bold;
        color: #555;
        background-color: #78a17b77;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .el-dialog__body {
        padding: 15px;
        font-size: 16px;
        .arrangement {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          & .el-form-item {
            display: inline-block;
            padding: 7px;
            width: 100%;
            margin: 0;
            .el-form-item__content {
              label {
                color: #555;
                font-size: 14px;
                margin-right: 10px;
              }
              .el-input {
                width: 200px;
                margin: 0;
                .el-input__inner {
                }
              }
              .el-form-item__error {
                font-size: 12px;
                padding: 0;
              }
            }
          }
          .textarea {
            width: 100%;
            .el-textarea__inner {
              margin-top: 10px;
            }
          }
        }
      }
      .el-dialog__footer {
        .el-icon-loading {
          margin-left: 6.5px;
          margin-right: 6.5px;
        }
      }
    }
  }
}
.v-modal {
  z-index: -1 !important;
}
</style>