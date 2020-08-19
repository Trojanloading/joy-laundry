<template>
  <!-- 取衣结单窗口 -->
  <div class="takeStatements-container">
    <el-dialog title="取衣结单" :visible.sync="dialogFormVisible">
      <!-- 取衣单子信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        取衣单子信息
      </el-divider>

      <div class="transactionNumber">
        <label>当前取衣单号:</label>
        {{ orderInformation.transactionNumber }}
      </div>

      <div class="arrangement">
        <span>
          <label>取衣日期:</label>
          {{ orderInformation.collectionDate }}
        </span>
        <span>
          <label>优惠金额:</label>
          {{ discounts }}
        </span>
        <span>
          <label>应收金额:</label>
          {{ orderInformation.amountReceivable }}
        </span>
        <span>
          <label>支付费用:</label>
          {{ payFee }}
        </span>
        <span>
          <label>是否付费:</label>
          {{ orderInformation.ispaid }}
        </span>
        <span>
          <label>是否重洗:</label>
          {{ orderInformation.rewashes }}
        </span>
        <span>
          <label>是否退赔:</label>
          {{ orderInformation.salesReturn }}
        </span>
        <span>
          <label>是否取走:</label>
          {{ orderInformation.whetherTake }}
        </span>
      </div>
      <!-- 客户信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        客户信息
      </el-divider>

      <div class="arrangement">
        <span>
          <label>会员卡号:</label>
          {{ vipInformation.vipID }}
        </span>
        <span>
          <label>会员名称:</label>
          {{ vipInformation.vipName }}
        </span>
        <span>
          <label>联系方式:</label>
          {{ vipInformation.contact }}
        </span>
        <span>
          <label>卡内余额:</label>
          {{ vipInformation.balance }}
        </span>
        <span>
          <label>消费总额:</label>
          {{ vipInformation.totalConsumption }}
        </span>
        <span>
          <label>卡的状态:</label>
          {{ vipInformation.vipState }}
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

      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleTakeStatements"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { number_format } from "@/utils/number_format";
import axios from "axios";

export default {
  name: "takeStatements",
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
        collectionDate: "",
        discount: "",
        amountReceivable: "",
        paidInAmount: "",
        rewashes: "",
        ispaid: ""
      },
      vipInformation: {
        vipID: "",
        vipName: "",
        contact: "",
        balance: "",
        totalConsumption: "",
        vipState: ""
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
    discounts: function() {
      return number_format(
        this.orderInformation.originalPrice -
          this.orderInformation.amountReceivable,
        2,
        ".",
        ",",
        "round"
      );
    },
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
    handleTakeStatements() {
      this.loading = true;
      this.btnText = "";
      if (this.orderInformation.ispaid == "否") {
        setTimeout(() => {
          this.loading = false;
          this.btnText = "确 定";
        }, 500);
        this.$message({
          message: "该订单还未付费，请先付费",
          type: "warning",
          center: true,
          offset: "0"
        });
        return false;
      } else if (this.orderInformation.whetherTake == "是") {
        setTimeout(() => {
          this.loading = false;
          this.btnText = "确 定";
        }, 500);
        this.$message({
          message: "该订单项已取走，请勿重复操作",
          type: "warning",
          center: true,
          offset: "0"
        });
        return false;
      } else {
        axios
          .post("http://127.0.0.1:3000/getClothings/takeStatements", {
            transactionNumber: this.orderInformation.transactionNumber
          })
          .then(res => {
            console.log(res.data);
            if (res.data == true) {
              this.$message({
                message: "取走成功",
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
              console.log("会员补卡成功");
            } else {
              this.loading = false;
              this.btnText = "确 定";
              console.log("取走失败");
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
      }
    }
  }
};
</script>

<style lang="scss">
.takeStatements-container {
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
      margin-top: 55px !important;
      min-width: 430px;
      width: 50%;
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
        & > div > span {
          display: inline-block;
          padding: 7px;
          width: 200px;
        }
        .el-form-item {
          margin-bottom: 5px;
        }
        .transactionNumber {
          text-align: center;
        }
        .arrangement {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
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