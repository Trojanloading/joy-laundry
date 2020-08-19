<template>
  <!-- 订单付费窗口 -->
  <div class="paid-container">
    <el-dialog title="订单付费" top="40vh" :visible.sync="dialogFormVisible">
      <div class="arrangement">
        <span>
          <label>应收金额:</label>
          {{ orderInformation.amountReceivable }}
        </span>
        <span>
          <label>支付方式:</label>
          <el-select
            v-model="orderInformation.paymentMethod"
            name="paymentMethod"
            filterable
            placeholder="请选择衣物名称"
          >
            <el-option
              v-for="paymentMethod in paymentMethods"
              :key="paymentMethod.value"
              :label="paymentMethod.label"
              :value="paymentMethod.value"
            ></el-option>
          </el-select>
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handlePaid"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "paid",
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
    return {
      dialogFormVisible: false,
      loading: false,
      btnText: "确 定",
      orderInformation: {
        transactionNumber: "",
        paymentMethod: "",
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
      paymentMethods: []
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
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handlePaid() {
      this.loading = true;
      this.btnText = "";
      axios
        .post("http://127.0.0.1:3000/getClothings/paid", this.orderInformation)
        .then(res => {
          console.log(res.data);
          if (res.data == false) {
            this.$message({
              message: "订单信息更新成功",
              type: "success",
              center: true,
              offset: "0"
            });
            setTimeout(() => {
              this.loading = false;
              this.btnText = "确 定";
              this.dialogFormVisible = false;
            }, 500);
            setTimeout(() => {
              this.$message({
                message: "会员信息更新失败",
                type: "error",
                center: true,
                offset: "0"
              });
            }, 4000);
            this.$emit("recSuccess");
            console.log("订单信息更新成功");
          } else {
            this.$message({
              message: "订单信息更新成功",
              type: "success",
              center: true,
              offset: "0"
            });
            setTimeout(() => {
              this.loading = false;
              this.btnText = "确 定";
              this.dialogFormVisible = false;
            }, 500);
            setTimeout(() => {
              this.$message({
                message: "会员信息更新成功，余额为：" + res.data,
                type: "success",
                center: true,
                offset: "0"
              });
            }, 4000);
            this.$emit("recSuccess");
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
    }
  },
  mounted() {
    // 获取付款方式信息
    axios
      .post("http://127.0.0.1:3000/paymentMethods/loadAll")
      .then(res => {
        if (res.data == false) {
          this.$message({
            message: "获取付款方式信息失败",
            type: "error",
            center: true,
            offset: "0"
          });
        } else {
          this.paymentMethods = res.data;
          for (let item in res.data) {
            this.paymentMethods[item].value = res.data[item].type;
            this.paymentMethods[item].label = res.data[item].type;
          }
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
.paid-container {
  .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog {
      // margin-top: 100px !important;
      min-width: 300px;
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