<template>
  <!-- 编辑会员 -->
  <div class="editorVip-container">
    <!-- 是否销毁数据 destroy-on-close -->
    <el-dialog title="编辑会员" top="12vh" :visible.sync="dialogFormVisible">
      <!-- 会员信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        会员信息
      </el-divider>
      <el-form ref="editorVipForm" :model="editorVipForm" :rules="editorVipRules">
        <div class="arrangement">
          <el-form-item prop="vipID">
            <label>会员卡号:</label>
            <el-input
              v-model="editorVipForm.vipID"
              name="vipID"
              placeholder="请输入会员卡号"
              maxlength="13"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item prop="vipName">
            <label>会员名称:</label>
            <el-input
              v-model="editorVipForm.vipName"
              name="vipName"
              placeholder="请输入会员名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="contact">
            <label>联系方式:</label>
            <el-input
              v-model="editorVipForm.contact"
              name="contact"
              placeholder="请输入联系方式"
              maxlength="11"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="vipDiscount">
            <label>会员折扣:</label>
            <el-input
              v-model="editorVipForm.vipDiscount"
              name="vipDiscount"
              placeholder="请输入会员折扣"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="vipIntegral">
            <label>会员积分:</label>
            <el-input
              v-model="editorVipForm.vipIntegral"
              name="vipIntegral"
              placeholder="请输入会员积分"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item prop="gender">
            <label>会员性别:</label>
            <el-select
              v-model="editorVipForm.gender"
              name="gender"
              filterable
              placeholder="请选择会员性别"
            >
              <el-option
                v-for="gender in genders"
                :key="gender.value"
                :label="gender.label"
                :value="gender.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="vipState">
            <label>会员状态:</label>
            <el-select
              v-model="editorVipForm.vipState"
              name="vipState"
              filterable
              placeholder="请选择会员状态"
            >
              <el-option
                v-for="vipState in vipStates"
                :key="vipState.value"
                :label="vipState.label"
                :value="vipState.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="vipLevel">
            <label>会员级别:</label>
            <el-select
              v-model="editorVipForm.vipLevel"
              name="vipLevel"
              filterable
              placeholder="请选择会员级别"
            >
              <el-option
                v-for="vipLevel in vipLevels"
                :key="vipLevel.value"
                :label="vipLevel.label"
                :value="vipLevel.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="vipPassword">
            <label>会员密码:</label>
            <el-input
              placeholder="请输入会员密码"
              name="vipPassword"
              v-model="editorVipForm.vipPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="vipPasswordAgain">
            <label>确认密码:</label>
            <el-input
              placeholder="请再次输入密码"
              name="vipPasswordAgain"
              v-model="editorVipForm.vipPasswordAgain"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="registrationDate">
            <label>注册日期:</label>
            <el-date-picker
              v-model="editorVipForm.registrationDate"
              align="right"
              type="date"
              name="registrationDate"
              placeholder="请选择注册日期"
              :disabled="true"
            >></el-date-picker>
          </el-form-item>
          <el-form-item prop="note" class="textarea">
            <label>其他信息:</label>
            <el-input
              type="textarea"
              placeholder="请输入其他信息"
              name="note"
              v-model="editorVipForm.note"
              :autosize="{ minRows: 1, maxRows: 3 }"
              maxlength="100"
              show-word-limit
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
          @click.native.prevent="handleAddVip"
        >{{ btnText2 }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  validPassword,
  validPhone,
  validNotEmpty,
  validUsername
} from "@/utils/validate";
import axios from "axios";

export default {
  name: "editorVip",
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
    const validateVipName = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("会员名称不能为空，且不能包含空格"));
      } else {
        callback();
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
      if (this.editorVipForm.vipPassword != value) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error("请输入正确的手机号码（由11位数字组成）"));
      } else {
        callback();
      }
    };
    const validateEmpty = (rule, value, callback) => {
      if (!validNotEmpty(value)) {
        callback(new Error("不能为空，且不能包含空格"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      editorVipForm: {
        vipID: "",
        vipName: "",
        contact: "",
        vipDiscount: "",
        vipIntegral: "",
        gender: "",
        vipState: "",
        vipLevel: "",
        vipPassword: "",
        vipPasswordAgain: "",
        registrationDate: "",
        note: ""
      },
      genders: [
        {
          value: "男",
          lable: "男"
        },
        {
          value: "女",
          lable: "女"
        }
      ],
      vipStates: [
        {
          value: "正常",
          lable: "正常"
        },
        {
          value: "注销",
          lable: "注销"
        }
      ],
      vipLevels: [
        {
          value: "普通会员",
          lable: "普通会员"
        },
        {
          value: "中级会员",
          lable: "中级会员"
        },
        {
          value: "高级会员",
          lable: "高级会员"
        }
      ],
      editorVipRules: {
        vipName: [{ required: true, trigger: "", validator: validateVipName }],
        contact: [{ required: true, trigger: "", validator: validatePhone }],
        vipDiscount: [
          { required: true, trigger: "", validator: validateEmpty }
        ],
        vipPassword: [
          { required: true, trigger: "", validator: validatePassword }
        ],
        vipPasswordAgain: [
          { required: true, trigger: "", validator: validateConfirmPassword }
        ]
      },
      loading1: false,
      loading2: false,
      btnText1: "重 置",
      btnText2: "确 定"
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
      console.log("编辑接收");
      this.editorVipForm = newVal;
    }
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
    handleClose() {
      this.$refs.editorVipForm.resetFields();
      this.dialogFormVisible = false;
    },
    handleReset() {
      this.loading1 = true;
      this.btnText1 = "";
      setTimeout(() => {
        this.loading1 = false;
        this.btnText1 = "重 置";
        this.$refs.editorVipForm.resetFields();
      }, 300);
    },
    handleAddVip() {
      this.$refs.editorVipForm.validate(valid => {
        if (valid) {
          this.loading2 = true;
          this.btnText2 = "";
          axios
            .post("http://127.0.0.1:3000/vipManagement/editorVip", this.editorVipForm)
            .then(res => {
              console.log(res.data);
              if (res.data == true) {
                this.$message({
                  message: "会员修改成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading2 = false;
                  this.btnText2 = "确 定";
                  this.$refs.editorVipForm.resetFields();
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("ediSuccess");
                console.log("会员修改成功");
              } else {
                this.loading2 = false;
                this.btnText2 = "确 定";
                console.log("会员修改失败");
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
.editorVip-container {
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
      // margin-top: 60px !important;
      min-width: 530px;
      width: 60%;
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