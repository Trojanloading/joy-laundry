<template>
  <!-- 申请会员 -->
  <div class="applyVip-container">
    <el-dialog title="申请会员" top="25vh" :visible.sync="dialogFormVisible">
      <!-- 会员信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        请填写基本会员信息
      </el-divider>
      <el-form ref="applyVipForm" :model="applyVipForm" :rules="applyVipFormRules">
        <div class="arrangement">
          <el-form-item prop="vipName">
            <label>会员名称:</label>
            <el-input v-model="applyVipForm.vipName" name="vipName" placeholder="请输入会员名称" clearable></el-input>
          </el-form-item>
          <el-form-item prop="contact">
            <label>联系方式:</label>
            <el-input
              v-model="applyVipForm.contact"
              name="contact"
              placeholder="请输入联系方式"
              maxlength="11"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="gender">
            <label>会员性别:</label>
            <el-select v-model="applyVipForm.gender" name="gender" filterable placeholder="请选择会员性别">
              <el-option
                v-for="gender in genders"
                :key="gender.value"
                :label="gender.label"
                :value="gender.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="registrationDate">
            <label>注册日期:</label>
            <el-date-picker
              v-model="applyVipForm.registrationDate"
              align="right"
              type="date"
              name="registrationDate"
              placeholder="请选择注册日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="vipPassword">
            <label>会员密码:</label>
            <el-input
              placeholder="请输入会员密码"
              name="vipPassword"
              v-model="applyVipForm.vipPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="vipPasswordAgain">
            <label>确认密码:</label>
            <el-input
              placeholder="请再次输入密码"
              name="vipPasswordAgain"
              v-model="applyVipForm.vipPasswordAgain"
              show-password
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
          @click.native.prevent="handleApplyVip"
        >{{ btnText2 }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { validPassword, validPhone, validUsername } from "@/utils/validate";
import axios from "axios";

export default {
  name: "addVip",
  components: {},
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    userInformation1: {
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
      if (this.applyVipForm.vipPassword != value) {
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
    return {
      dialogFormVisible: false,
      applyVipForm: {
        username: "",
        vipName: "",
        contact: "",
        gender: "",
        vipPassword: "",
        vipPasswordAgain: "",
        registrationDate: "",
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      },
      applyVipFormRules: {
        vipName: [{ required: true, trigger: "", validator: validateVipName }],
        contact: [{ required: true, trigger: "", validator: validatePhone }],
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
      btnText2: "确 定",
      userInformation: null
    };
  },
  watch: {
    isdialogFormVisible: function(newVal) {
      this.dialogFormVisible = newVal;
    },
    dialogFormVisible: function() {
      if (!this.dialogFormVisible) this.$emit("change");
    },
    userInformation1: function(newVal) {
      this.userInformation = newVal;
      this.applyVipForm.username = newVal.username;
      console.log("会员信息传进来了");
    }
  },
  methods: {
    handleClose() {
      this.$refs.applyVipForm.resetFields();
      this.dialogFormVisible = false;
    },
    handleReset() {
      this.loading1 = true;
      this.btnText1 = "";
      setTimeout(() => {
        this.loading1 = false;
        this.btnText1 = "重 置";
        this.$refs.applyVipForm.resetFields();
      }, 300);
    },
    handleApplyVip() {
      this.$refs.applyVipForm.validate(valid => {
        if (valid) {
          this.loading2 = true;
          this.btnText2 = "";
          axios
            .post("http://127.0.0.1:3000/userInfo/applyVip", this.applyVipForm)
            .then(res => {
              console.log(res.data);
              if (res.data == true) {
                this.$message({
                  message: "会员申请成功，请耐心等待",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading2 = false;
                  this.btnText2 = "确 定";
                  this.$refs.applyVipForm.resetFields();
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("addSuccess");
                console.log("会员申请成功，请耐心等待");
              } else {
                this.loading2 = false;
                this.btnText2 = "确 定";
                console.log("会员申请失败，请稍后重试");
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
  },
  mounted() {}
};
</script>

<style lang="scss">
.applyVip-container {
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 530px;
      width: 40%;
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