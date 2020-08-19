<template>
  <div class="userInfo-container">
    <divider title="个人信息" />
    <el-card class="box-card">
      <div class="arrangement">
        <el-divider content-position="left">
          <i class="el-icon-caret-bottom"></i>基本信息
        </el-divider>
        <span class="compensationNumber">
          <label>用户名称:</label>
          {{ userInformation.username }}
        </span>
        <span class="compensationNumber">
          <label>用户密码:</label>
          {{ userInformation.password }}
        </span>
        <el-divider content-position="left">
          <i class="el-icon-caret-bottom"></i>会员信息
        </el-divider>
        <el-form ref="vipInformation" :model="vipInformation">
          <div class="arrangement">
            <el-form-item prop="vipID">
              <label>会员卡号:</label>
              <el-input
                v-model="vipInformation.vipID"
                name="vipID"
                placeholder
                maxlength="13"
                :disabled="true"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="vipName">
              <label>会员名称:</label>
              <el-input
                v-model="vipInformation.vipName"
                name="vipName"
                placeholder
                :disabled="true"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="contact">
              <label>联系方式:</label>
              <el-input
                v-model="vipInformation.contact"
                name="contact"
                placeholder
                maxlength="11"
                :disabled="true"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="vipDiscount">
              <label>会员折扣:</label>
              <el-input
                v-model="vipInformation.vipDiscount"
                name="vipDiscount"
                placeholder
                :disabled="true"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="vipIntegral">
              <label>会员积分:</label>
              <el-input
                v-model="vipInformation.vipIntegral"
                name="vipIntegral"
                placeholder
                :disabled="true"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="gender">
              <label>会员性别:</label>
              <el-select
                v-model="vipInformation.gender"
                name="gender"
                filterable
                placeholder
                :disabled="true"
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
                v-model="vipInformation.vipState"
                name="vipState"
                filterable
                placeholder
                :disabled="true"
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
                v-model="vipInformation.vipLevel"
                name="vipLevel"
                filterable
                placeholder
                :disabled="true"
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
                placeholder
                name="vipPassword"
                v-model="vipInformation.vipPassword"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item prop="balance">
              <label>卡内余额:</label>
              <el-input
                v-model="vipInformation.balance"
                name="balance"
                placeholder
                :disabled="true"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="totalConsumption">
              <label>消费总额:</label>
              <el-input
                v-model="vipInformation.totalConsumption"
                name="totalConsumption"
                placeholder
                :disabled="true"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="numberOfConsumption">
              <label>消费次数:</label>
              <el-input
                v-model="vipInformation.numberOfConsumption"
                name="numberOfConsumption"
                placeholder
                :disabled="true"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="registrationDate">
              <label>注册日期:</label>
              <el-date-picker
                v-model="vipInformation.registrationDate"
                align="right"
                type="date"
                name="registrationDate"
                placeholder
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                :disabled="true"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <!-- <el-button
          type="primary"
          round
          :loading="loading2"
          @click.native.prevent="handleAddVip"
        >{{ btnText2 }}</el-button>-->
        <div class="button">
          <el-button type="primary" round @click.native.stop="handleClik1" :disabled="isVip">申请会员</el-button>
        </div>
      </div>
    </el-card>
    <applyVip
      :isdialogFormVisible="isopen1"
      :userInformation1="userInformation"
      @change="handleChange"
      @addSuccess="handleSuccess"
    />
  </div>
</template>

<script>
import divider from "../componets/divider";
import applyVip from "./applyVip";
import axios from "axios";
import * as cookieUtils from "@/utils/cookie";

export default {
  name: "userInfo",
  components: {
    divider,
    applyVip
  },
  data() {
    return {
      userInformation: {
        username: "",
        password: ""
      },
      vipInformation: {
        vipID: "",
        vipName: "",
        vipState: "",
        vipLevel: "",
        vipDiscount: "",
        balance: "",
        totalConsumption: "",
        numberOfConsumption: "",
        contact: "",
        vipIntegral: "",
        gender: "",
        vipPassword: "",
        registrationDate: "",
        note: ""
      },
      isopen1: false,
      isVip: false,
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
      }
    };
  },
  methods: {
    handleChange() {
      this.isopen1 = false;
    },
    handleClik1() {
      this.isopen1 = true;
    },
    handleSuccess() {
      // setTimeout(() => {
      //   this.loadAll();
      // }, 500);
    },
    findVipInfo() {
      axios
        .post("http://127.0.0.1:3000/getVipInfo", {
          vipID: this.userInformation.vipID
        })
        .then(res => {
          console.log(res.data);
          if (res.data == false) {
            console.log("没有该会员信息");
          } else {
            this.vipInformation = res.data;
            this.isVip = true;
            console.log("查找会员信息成功");
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
          return false;
        });
    }
  },
  mounted() {
    let user_id = cookieUtils.getCookie("userid");
    axios
      .post("http://127.0.0.1:3000/getUserInfo", {
        user_id: user_id
      })
      .then(res => {
        console.log(res.data);
        if (res.data == false) {
          console.log("查找用户信息失败");
        } else {
          this.userInformation = res.data;
          if (res.data.vipID == "HY00000000000") {
            this.$message({
              message: "您还不是会员，可以去申请会员，享有一定的折扣",
              type: "warning",
              center: true,
              offset: "0"
            });
          }
          this.findVipInfo();
          console.log("查找用户信息成功");
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
        return false;
      });
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.userInfo-container {
  .arrangement {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
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
    & > span {
      display: inline-block;
      padding: 7px;
      width: 250px;
      .el-input {
        width: 200px;
        margin: 0;
      }
      label {
        color: #555;
        font-size: 14px;
        margin-right: 10px;
      }
    }
    .compensationNumber {
      font-size: 14px;
      line-height: 30px;
    }
    & .el-form-item {
      display: inline-block;
      padding: 7px;
      width: 350px;
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
        .el-select {
        }
        .el-color-picker {
          display: inline-block;
          vertical-align: -12px;
          .el-color-picker__trigger {
            width: 160px;
            height: 35px;
          }
        }
        .el-checkbox-group {
          display: inline-block;
          // vertical-align: 5px;
          height: 30px;

          .el-checkbox-button {
            margin: 0;
            height: 30px;
            line-height: 40px;
            .el-checkbox-button__inner {
              height: 30px;
            }
          }
        }
        .el-input-group {
          .el-input-group__prepend {
          }
          .el-input__inner {
            width: 130px;
          }
        }
        .el-form-item__error {
          font-size: 12px;
          padding: 0;
        }
      }
    }
    .el-table {
      td {
        text-align: center !important;
      }
      .cell {
        display: inline-block;
        white-space: nowrap !important;
        min-width: 50px;
        text-align: center;
      }
      .el-table__body-wrapper {
        @include scrollBar(9px);
        white-space: nowrap;
      }
      .el-button {
        padding: 7px;
      }
    }
    .textarea {
      width: 100%;
      .el-textarea__inner {
        margin-top: 10px;
      }
    }
    .button {
      width: 100%;
      margin: 5px 0 0 0;
      text-align: center;
      .el-icon-loading {
        margin-left: 6.5px;
        margin-right: 6.5px;
      }
    }
  }
}
</style>