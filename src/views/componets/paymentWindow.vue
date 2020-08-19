<template>
  <!-- 支付窗口 -->
  <div class="paymentWindow-container">
    <el-dialog title="订单支付" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="应收金额" :label-width="formLabelWidth">
          <el-input
            v-model="form.amountReceivable "
            placeholder="应收金额"
            autocomplete="off"
            suffix-icon="el-icon-coin"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="付款方式" :label-width="formLabelWidth">
          <el-select v-model="form.paymentMethod" placeholder="请选择付款方式">
            <el-option label="微信" value="WeChat"></el-option>
            <el-option label="会员卡" value="vipCard"></el-option>
            <el-option label="支付宝" value="Alipay"></el-option>
            <el-option label="现金" value="cash"></el-option>
            <el-option label="储值卡" value="petCard"></el-option>
            <el-option label="信用卡" value="creditCard"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实收金额" :label-width="formLabelWidth">
          <el-input
            v-model="form.paidInAmount"
            placeholder="实收金额"
            autocomplete="off"
            suffix-icon="el-icon-coin"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="找零金额" :label-width="formLabelWidth">
          <el-input
            v-model="form.change"
            placeholder="找零金额"
            autocomplete="off"
            suffix-icon="el-icon-coin"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "paymentWindow",
  props: {
    dialogFormVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      // dialogFormVisible: false,
      form: {
        amountReceivable: "15",
        paymentMethod: "微信",
        paidInAmount: "15",
        change: "0",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "80px"
    };
  }
};
</script>

<style lang="scss">
.paymentWindow-container {
  .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog {
      margin-top: 150px !important;
      min-width: 300px;
      width: 29%;
      border-radius: 10px;
      .el-dialog__header {
        border-bottom: 1px solid #ddd;
      }
      .el-dialog__body {
        padding: 15px 55px;
        .el-form-item {
          margin-bottom: 5px;
        }
      }
    }
  }
}
.v-modal {
  z-index: -1 !important;
}
</style>