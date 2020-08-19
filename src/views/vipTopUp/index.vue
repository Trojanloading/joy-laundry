<template>
  <div class="vipTopUp-container">
    <divider title="会员充值" />
    <el-card class="box-card">
      <el-form ref="vipTopUpForm" :model="vipTopUpForm" :rules="vipTopUpRules">
        <div class="arrangement">
          <el-divider content-position="left">
            <i class="el-icon-caret-bottom"></i>
            请输入会员卡号
          </el-divider>
          <el-form-item prop="vipID">
            <label>会员卡号:</label>
            <el-input
              v-model="vipTopUpForm.vipID"
              name="vipID"
              placeholder="请输入会员卡号"
              maxlength="13"
              clearable
            ></el-input>
          </el-form-item>
          <el-divider content-position="left">
            <i class="el-icon-caret-bottom"></i>
            会员卡信息
          </el-divider>
          <span class="compensationNumber">
            <label>会员名称:</label>
            {{ vipTopUpForm.vipName }}
          </span>
          <span class="compensationNumber">
            <label>会员级别:</label>
            {{ vipTopUpForm.vipLevel }}
          </span>
          <span class="compensationNumber">
            <label>联系方式:</label>
            {{ vipTopUpForm.contact }}
          </span>
          <span class="compensationNumber">
            <label>消费次数:</label>
            {{ vipTopUpForm.numberOfConsumption }}
          </span>
          <span class="compensationNumber">
            <label>卡内余额:</label>
            {{ vipTopUpForm.balance }}
          </span>
          <span class="compensationNumber">
            <label>消费总额:</label>
            {{ vipTopUpForm.totalConsumption }}
          </span>
          <el-divider content-position="left">
            <i class="el-icon-caret-bottom"></i>
            充值信息
          </el-divider>
          <el-form-item prop="paidInAmount">
            <label>实收金额:</label>
            <el-input
              v-model="vipTopUpForm.paidInAmount"
              name="paidInAmount"
              placeholder="请输入实收金额"
              maxlength="13"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="paidInActual">
            <label>实际充值:</label>
            <el-input
              v-model="vipTopUpForm.paidInActual"
              name="paidInActual"
              placeholder="请输入实际充值"
              maxlength="13"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="topUpDate">
            <label>充值日期:</label>
            <el-date-picker
              v-model="vipTopUpForm.topUpDate"
              align="right"
              type="date"
              name="topUpDate"
              placeholder="请选择充值日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="paymentMethod">
            <label>付款方式:</label>
            <el-select
              v-model="vipTopUpForm.paymentMethod"
              name="paymentMethod"
              filterable
              placeholder="请选择付款方式"
            >
              <el-option
                v-for="paymentMethod in paymentMethods"
                :key="paymentMethod.value"
                :label="paymentMethod.label"
                :value="paymentMethod.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="textarea" prop="note">
            <label>备注:</label>
            <el-input
              type="textarea"
              placeholder="请输入备注"
              v-model="vipTopUpForm.note"
              :autosize="{ minRows: 1, maxRows: 3 }"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <div class="button">
          <el-button
            type="warning"
            round
            @click.native.stop="handleReset"
            :loading="loading1"
          >{{ btnText1 }}</el-button>
          <el-button
            type="primary"
            round
            @click.native.stop="handleVipTopUp"
            :loading="loading2"
          >{{ btnText2 }}</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import divider from "../componets/divider";
import { validVipID, validNotEmpty } from "@/utils/validate";
import axios from "axios";

export default {
  name: "vipTop-up",
  components: {
    divider
  },
  data() {
    const validateVipID = (rule, value, callback) => {
      if (!validVipID(value)) {
        callback(new Error("会员卡号不能为空，且不能包含空格"));
      } else {
        axios
          .post("http://127.0.0.1:3000/vipTopUp/vipIDValidate", {
            vipID: value
          })
          .then(res => {
            if (res.data == false) {
              callback(new Error("会员卡号还未正确"));
              console.log("会员卡号还未正确");
            } else {
              this.vipTopUpForm.vipName = res.data.vipName;
              this.vipTopUpForm.vipLevel = res.data.vipLevel;
              this.vipTopUpForm.contact = res.data.contact;
              this.vipTopUpForm.numberOfConsumption =
                res.data.numberOfConsumption;
              this.vipTopUpForm.totalConsumption = res.data.totalConsumption;
              this.vipTopUpForm.balance = res.data.balance;
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
    const validateEmpty = (rule, value, callback) => {
      if (!validNotEmpty(value)) {
        callback(new Error("不能为空，且不能包含空格"));
      } else {
        callback();
      }
    };
    return {
      loading1: false,
      loading2: false,
      btnText1: "重 置",
      btnText2: "确 定",
      vipTopUpForm: {
        vipID: "",
        vipName: "",
        vipLevel: "",
        contact: "",
        numberOfConsumption: "",
        totalConsumption: "",
        balance: "",
        paidInAmount: "",
        paidInActual: "",
        topUpDate: "",
        paymentMethod: "微信",
        note: ""
      },
      paymentMethods: [
        {
          value: "微信",
          lable: "微信"
        },
        {
          value: "现金",
          lable: "现金"
        },
        {
          value: "支付宝",
          lable: "支付宝"
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
      vipTopUpRules: {
        vipID: [{ required: true, trigger: "", validator: validateVipID }],
        paidInAmount: [
          { required: true, trigger: "", validator: validateEmpty }
        ],
        paidInActual: [
          { required: true, trigger: "", validator: validateEmpty }
        ]
      }
    };
  },
  methods: {
    handleReset() {
      this.loading1 = true;
      this.btnText1 = "";
      setTimeout(() => {
        this.loading1 = false;
        this.btnText1 = "重 置";
        this.$refs.vipTopUpForm.resetFields();
      }, 300);
    },
    handleVipTopUp() {
      this.$refs.vipTopUpForm.validate(valid => {
        if (valid) {
          this.loading2 = true;
          this.btnText2 = "";
          axios
            .post("http://127.0.0.1:3000/vipTopUp", this.vipTopUpForm)
            .then(res => {
              console.log(res.data);
              if (res.data == false) {
                this.$message({
                  message: "会员卡充值成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading2 = false;
                  this.btnText2 = "确 定";
                  this.$refs.vipTopUpForm.resetFields();
                }, 500);
                setTimeout(() => {
                  this.$message({
                    message: "会员卡余额更新失败",
                    type: "error",
                    center: true,
                    offset: "0"
                  });
                }, 4000);
              } else if (res.data == "no") {
                this.$message({
                  message: "会员卡充值失败！稍后尝试",
                  type: "error",
                  center: true,
                  offset: "0"
                });
                this.loading2 = false;
                this.btnText2 = "确 定";
                console.log("会员卡充值失败");
                return false;
              } else {
                this.$message({
                  message: "会员卡充值成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading2 = false;
                  this.btnText2 = "确 定";
                  this.$refs.vipTopUpForm.resetFields();
                }, 500);
                setTimeout(() => {
                  this.$message({
                    message: "会员卡余额更新成功,余额为：" + res.data,
                    type: "success",
                    center: true,
                    offset: "0"
                  });
                  this.vipTopUpForm.balance = res.data;
                }, 4000);
                console.log("会员卡充值成功");
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
.vipTopUp-container {
  .arrangement {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
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
    .compensationNumber {
      font-size: 14px;
      line-height: 30px;
    }
  }
  .button {
    margin: 10px 0 0 0;
    text-align: center;
    .el-icon-loading {
      margin-left: 6.5px;
      margin-right: 6.5px;
    }
    .el-button {
      box-shadow: 1px 1px 6px 2px #999;
      &:hover {
        box-shadow: 2px 2px 7px 3px #777;
      }
    }
  }
}
</style>