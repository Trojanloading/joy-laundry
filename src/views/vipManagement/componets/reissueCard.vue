<template>
  <!-- 会员补卡 -->
  <div class="reissueCard-container">
    <el-dialog title="会员补卡" top="15vh" :visible.sync="dialogFormVisible">
      <el-form ref="reissueCardForm" :model="reissueCardForm" :rules="reissueCardRules">
        <!-- 会员信息 -->
        <el-divider content-position="left">
          <i class="el-icon-caret-bottom"></i>
          会员信息
        </el-divider>
        <div class="arrangement">
          <span>
            <label>会员卡号:</label>
            {{ customerInformation.vipID }}
          </span>
          <span>
            <label>会员名称:</label>
            {{ customerInformation.vipName }}
          </span>
          <span>
            <label>会员级别:</label>
            {{ customerInformation.vipLevel }}
          </span>
          <span>
            <label>联系方式:</label>
            {{ customerInformation.contact }}
          </span>
          <span>
            <label>卡内余额:</label>
            {{ customerInformation.balance }}
          </span>
          <span>
            <label>消费总额:</label>
            {{ customerInformation.totalConsumption }}
          </span>
        </div>
        <!-- 新卡信息 -->
        <el-divider content-position="left">
          <i class="el-icon-caret-bottom"></i>
          新卡信息
        </el-divider>
        <div class="arrangement">
          <el-form-item prop="newVipID">
            <label>新卡卡号:</label>
            <el-input
              v-model="reissueCardForm.newVipID"
              placeholder="请输入新卡卡号"
              maxlength="13"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="oldVipPassword">
            <label>旧卡密码:</label>
            <el-input
              placeholder="请输入旧卡密码"
              maxlength="16"
              v-model="reissueCardForm.oldVipPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="newVipPassword">
            <label>新卡密码:</label>
            <el-input
              placeholder="请输入新卡密码"
              maxlength="16"
              v-model="reissueCardForm.newVipPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="newVipPasswordAgain">
            <label>确认密码:</label>
            <el-input
              placeholder="请再次输入密码"
              maxlength="16"
              v-model="reissueCardForm.newVipPasswordAgain"
              show-password
              @keyup.enter.native="handleReissueCard"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="warning"
          round
          :loading="loading1"
          @click.native.stop="handleReset"
        >{{ btnText1 }}</el-button>
        <el-button
          type="primary"
          round
          :loading="loading2"
          @click.native.prevent="handleReissueCard"
        >{{ btnText2 }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { validVipID, validPassword } from "@/utils/validate";
import axios from "axios";

export default {
  name: "reissueCard",
  components: {},
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    customerInformation1: {
      type: Object
    }
  },
  data() {
    const validateVipID = (rule, value, callback) => {
      if (!validVipID(value)) {
        callback(new Error("会员卡号不能为空，且不能包含空格"));
      } else {
        axios
          .post("http://127.0.0.1:3000/vipManagement/addVip/vipIDValidate", {
            vipID: value
          })
          .then(res => {
            if (res.data == "已存在") {
              callback(new Error("该会员卡号已存在"));
              console.log("该会员卡号已存在");
            } else {
              callback();
              console.log(res.data);
            }
          })
          .catch(error => {
            this.$message({
              message: "服务器可能走神了！稍后尝试",
              type: "error",
              center: true,
              offset: "0"
            });
            console.log(error);
          });
      }
    };
    const validateOldVipPassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error("密码由6-16位（字母 数字 ! @ # * - _ .）组成"));
      } else {
        axios
          .post(
            "http://127.0.0.1:3000/vipManagement/reissueCard/oldVipPasswordValidate",
            {
              vipID: this.customerInformation.vipID
            }
          )
          .then(res => {
            if (res.data.vipPassword == value) {
              callback();
              console.log("密码正确");
            } else {
              callback(new Error("密码不正确，请重新输入"));
              console.log(res.data);
            }
          })
          .catch(error => {
            this.$message({
              message: "服务器可能走神了！稍后尝试",
              type: "error",
              center: true,
              offset: "0"
            });
            console.log(error);
          });
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error("密码由6-16位（字母 数字 ! @ # * - _ .）组成"));
      } else {
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.reissueCardForm.newVipPassword != value) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      loading1: false,
      loading2: false,
      btnText1: "重 置",
      btnText2: "确 定",
      customerInformation: {
        vipID: "",
        vipName: "",
        vipLevel: "",
        contact: "",
        balance: "",
        totalConsumption: ""
      },
      reissueCardForm: {
        oldVipID: "",
        newVipID: "",
        oldVipPassword: "",
        newVipPassword: "",
        newVipPasswordAgain: ""
      },
      reissueCardRules: {
        newVipID: [{ required: true, trigger: "", validator: validateVipID }],
        oldVipPassword: [
          { required: true, trigger: "", validator: validateOldVipPassword }
        ],
        newVipPassword: [
          { required: true, trigger: "", validator: validatePassword }
        ],
        newVipPasswordAgain: [
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
    },
    customerInformation1: function(newVal) {
      console.log("某会员传进来了");
      this.customerInformation = newVal;
    }
  },
  methods: {
    handleClose() {
      this.$refs.reissueCardForm.resetFields();
      this.dialogFormVisible = false;
    },
    handleReset() {
      this.loading1 = true;
      this.btnText1 = "";
      setTimeout(() => {
        this.loading1 = false;
        this.btnText1 = "重 置";
        this.$refs.reissueCardForm.resetFields();
      }, 300);
    },
    handleReissueCard() {
      this.$refs.reissueCardForm.validate(valid => {
        if (valid) {
          this.loading2 = true;
          this.btnText2 = "";
          this.reissueCardForm.oldVipID = this.customerInformation.vipID;
          axios
            .post(
              "http://127.0.0.1:3000/vipManagement/reissueCard",
              this.reissueCardForm
            )
            .then(res => {
              console.log(res.data);
              if (res.data == true) {
                this.$message({
                  message: "会员补卡成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading2 = false;
                  this.btnText2 = "确 定";
                  this.$refs.reissueCardForm.resetFields();
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("recSuccess");
                console.log("会员补卡成功");
              } else {
                this.loading2 = false;
                this.btnText2 = "确 定";
                console.log("会员补卡失败");
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
              this.loading2 = false;
              this.btnText2 = "确 定";
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
.reissueCard-container {
  .el-divider {
    margin: 15px 0 15px;
    border: 1px solid #ccc;
    border-radius: 0px;
    .el-divider__text {
      height: 17px;
      line-height: 17px;
      font-size: 12px;
      padding: 0 10px 0 5px;
      color: #eee;
      text-align: center;
      background-color: #78a17b;
      border-radius: 10px;
    }
  }
  .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog {
      // margin-top: 100px !important;
      min-width: 530px;
      width: 40%;
      border-radius: 10px;
      .el-dialog__header {
        font-weight: bold;
        color: #555;
        background-color: #78a17b77;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .el-dialog__body {
        padding: 0 15px 0 15px;
        .arrangement {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          & > span {
            display: inline-block;
            padding: 7px;
            width: 250px;
            .el-input {
              width: 160px;
              margin: 0;
            }
            label {
              color: #555;
              font-size: 14px;
              margin-right: 10px;
            }
          }
          & .el-form-item {
            display: inline-block;
            padding: 7px;
            width: 250px;
            margin: 0;
            .el-form-item__content {
              label {
                color: #555;
                font-size: 14px;
                margin-right: 10px;
              }
              .el-input {
                width: 160px;
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