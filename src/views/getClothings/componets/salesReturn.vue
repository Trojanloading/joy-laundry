<template>
  <!-- 退赔衣物窗口 -->
  <div class="salesReturn-container">
    <el-dialog title="退赔衣物" top="7vh" :visible.sync="dialogFormVisible">
      <!-- 退赔交易单信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        退赔交易单信息
      </el-divider>
      <div class="arrangement">
        <span>
          <label>交易单号:</label>
          {{ orderInformation.transactionNumber }}
        </span>
        <span>
          <label>交易日期:</label>
          {{ orderInformation.addedDate }}
        </span>
        <span>
          <label>应收金额:</label>
          {{ orderInformation.amountReceivable }}
        </span>
        <span>
          <label>实收金额:</label>
          {{ orderInformation.paidInAmount }}
        </span>
        <span>
          <label>支付费用:</label>
          {{ payFee }}
        </span>
      </div>
      <!-- 洗衣清单 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        洗衣清单
      </el-divider>
      <el-table :data="[orderInformation]" border style="width: 100%">
        <el-table-column prop="clothesName" label="衣服名称"></el-table-column>
        <el-table-column prop="laundryType" label="类型"></el-table-column>
        <el-table-column prop="clothingBrand" label="衣服品牌"></el-table-column>
        <el-table-column prop="clothingAccessories" label="衣服附件"></el-table-column>
        <el-table-column prop="clothingBlemishes" label="衣服瑕疵"></el-table-column>
        <el-table-column prop="clothingColor" label="衣服颜色" min-width="140px"></el-table-column>
        <el-table-column prop="discount" label="折扣"></el-table-column>
        <el-table-column prop="discountPrice" label="折后价"></el-table-column>
        <el-table-column prop="ispaid" label="是否付费"></el-table-column>
        <el-table-column prop="whetherTake" label="是否取走"></el-table-column>
        <el-table-column prop="rewashes" label="是否重洗"></el-table-column>
        <el-table-column prop="salesReturn" label="是否退赔"></el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
      </el-table>
      <!-- 退赔衣物信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        退赔衣物信息
      </el-divider>
      <el-form
        ref="salesReturnInformation"
        :model="salesReturnInformation"
        :rules="salesReturnRules"
      >
        <div class="arrangement">
          <el-form-item prop="compensationNumber">
            <label>退赔单号:</label>
            <el-input
              v-model="salesReturnInformation.compensationNumber"
              placeholder="请输入退赔单号"
              maxlength="13"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="amount">
            <label>退赔金额:</label>
            <el-input
              v-model="salesReturnInformation.amount"
              placeholder="请输入赔偿金额"
              maxlength="5"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="date">
            <label>退赔日期:</label>
            <el-date-picker
              v-model="salesReturnInformation.date"
              align="right"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="textarea">
            <label>退赔原因:</label>
            <el-input
              type="textarea"
              placeholder="请输入退赔原因"
              v-model="salesReturnInformation.why"
              :autosize="{ minRows: 1, maxRows: 3 }"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item>
            <label>操作人员:</label>
            <el-input
              v-model="salesReturnInformation.operator"
              name="operator"
              placeholder="请选择操作人员"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <label>密码:</label>
            <el-input
              placeholder="请输入密码"
              v-model="salesReturnInformation.password"
              @keyup.enter.native="handleSalesReturn"
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
          @click.native.prevent="handleSalesReturn"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import * as cookieUtils from "@/utils/cookie";
import {
  validVipID,
  validNotEmpty,
  validNumber,
  validPassword
} from "@/utils/validate";

export default {
  name: "salesReturn",
  components: {},
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    orderInformation1: {
      type: Object
    }
  },
  data() {
    const validateCompensationNumber = (rule, value, callback) => {
      if (!validVipID(value)) {
        callback(new Error("交易单号不能为空，且不能包含空格"));
      } else {
        axios
          .post(
            "http://127.0.0.1:3000/getClothings/salesReturn/validationOrder",
            {
              compensationNumber: value
            }
          )
          .then(res => {
            if (res.data == false) {
              callback(new Error("该退赔单号已存在"));
              console.log("该退赔单号已存在");
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
    const validateEmpty = (rule, value, callback) => {
      if (!validNotEmpty(value)) {
        callback(new Error("不能为空，且不能包含空格"));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      if (!validNumber(value)) {
        callback(new Error("只能是整数或者小数（请保留两位小数）"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error("密码由6-16位（字母 数字 ! @ # * - _ .）组成"));
      } else {
        axios
          .post(
            "http://127.0.0.1:3000/getClothings/salesReturn/validPassword",
            {
              username: this.salesReturnInformation.operator,
              password: value
            }
          )
          .then(res => {
            if (res.data == false) {
              callback(new Error("密码不正确"));
              console.log("密码不正确");
            } else {
              callback();
            }
          })
          .catch(error => {
            this.messageOfRegister(
              "error",
              "服务器错误,请稍后尝试！！！",
              4000,
              true
            );
            console.log(error);
          });
      }
    };
    return {
      dialogFormVisible: false,
      loading: false,
      btnText: "确 定",
      orderInformation: {
        transactionNumber: "",
        addedDate: "",
        amountReceivable: "",
        paidInAmount: ""
      },
      vipInformation: {
        vipID: "",
        vipName: "",
        contact: "",
        balance: "",
        totalConsumption: "",
        vipState: ""
      },
      salesReturnInformation: {
        compensationNumber: "",
        amount: "",
        date: "",
        why: "",
        operator: "",
        password: "",
        transactionNumber: "",
        vipID: "",
        vipName: ""
      },
      salesReturnRules: {
        compensationNumber: [
          { required: true, trigger: "", validator: validateCompensationNumber }
        ],
        amount: [{ required: true, trigger: "", validator: validateNumber }],
        date: [{ required: true, trigger: "", validator: validateEmpty }],
        password: [{ required: true, trigger: "", validator: validatePassword }]
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
    orderInformation1: function(newVal) {
      console.log("某会员某订单传进来了");
      this.orderInformation = newVal;
      this.salesReturnInformation.transactionNumber = this.orderInformation.transactionNumber;
      this.salesReturnInformation.vipID = this.orderInformation.vipID;
      this.salesReturnInformation.vipName = this.orderInformation.vipName;
      axios
        .post("http://127.0.0.1:3000/getClothings/takeStatements/loadVip", {
          vipID: this.orderInformation.vipID
        })
        .then(res => {
          if (res.data == "数据库查找错误") {
            console.log("数据库查找错误");
          } else {
            console.log(res.data);
            this.vipInformation = res.data;
          }
        })
        .catch(error => {
          this.messageOfRegister(
            "error",
            "服务器错误,请稍后尝试！！！",
            4000,
            true
          );
          console.log(error);
        });
    }
  },
  computed: {
    payFee: function() {
      if (this.orderInformation.ispaid == "是") {
        return this.orderInformation.amountReceivable;
      } else {
        return "0.00";
      }
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handleSalesReturn() {
      this.$refs.salesReturnInformation.validate(valid => {
        if (valid) {
          this.loading = true;
          this.btnText = "";
          axios
            .post(
              "http://127.0.0.1:3000/getClothings/salesReturn",
              this.salesReturnInformation
            )
            .then(res => {
              console.log(res.data);
              if (res.data == "success") {
                this.$message({
                  message: "退赔成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("recSuccess");
                console.log("退赔成功");
              } else {
                this.loading = false;
                this.btnText = "确 定";
                console.log("退赔失败");
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
  },
  mounted() {
    var operator_id = cookieUtils.getCookie("adminid");
    axios
      .post("http://127.0.0.1:3000/getClothings/salesReturn/getOperator", {
        operator_id: operator_id
      })
      .then(res => {
        console.log(res.data);
        if (res.data == false) {
          console.log("查找操作员失败");
        } else {
          this.salesReturnInformation.operator = res.data.username;
          console.log("查找操作员成功");
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

<style lang="scss">
.salesReturn-container {
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
      // margin-top: 40px !important;
      min-width: 500px;
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
        .el-form-item {
          margin-bottom: 5px;
        }
        .arrangement {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          & > span {
            display: inline-block;
            padding: 7px;
            width: 230px;
            // line-height: 30px;
            .el-input {
              width: 150px;
              margin: 0;
            }
          }
          & .el-form-item {
            display: inline-block;
            padding: 7px 7px;
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
            width: 31%;
            .el-textarea__inner {
              margin-top: 10px;
            }
          }
          .compensationNumber {
            line-height: 30px;
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