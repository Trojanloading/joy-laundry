<template>
  <!-- 同意添加衣物 -->
  <div class="pass-container">
    <el-dialog title="同意添加衣物" top="30vh" :visible.sync="dialogFormVisible">
      <div>同意该用户申请添加衣物吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handlePassApply"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "pass",
  components: {},
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    applyInformation1: {
      type: Object
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      applyInformation: null,
      btnText: "确 定",
      loading: false
    };
  },
  watch: {
    isdialogFormVisible: function(newVal) {
      this.dialogFormVisible = newVal;
    },
    dialogFormVisible: function() {
      if (!this.dialogFormVisible) this.$emit("change");
    },
    applyInformation1: function(newVal) {
      console.log("某用户的申请信息传进来通过审核");
      this.applyInformation = newVal;
      console.log(newVal);
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handlePassApply() {
      this.btnText = "";
      this.loading = true;
      axios
        .post(
          "http://127.0.0.1:3000/applyAddClothes/addClothes",
          this.applyInformation
        )
        .then(res => {
          if (res.data == true) {
            this.$message({
              message: "添加衣物订单成功",
              type: "success",
              center: true,
              offset: "0"
            });
            setTimeout(() => {
              this.btnText = "确 定";
              this.loading = false;
            }, 500);
            this.dialogFormVisible = false;
            console.log("添加衣物订单成功");
          } else {
            this.$message({
              message: "添加衣物订单失败",
              type: "error",
              center: true,
              offset: "0"
            });
            this.btnText = "确 定";
            this.loading = false;
            console.log("添加衣物订单失败");
          }
        })
        .catch(error => {
          this.$message({
            message: "服务器可能走神了！稍后尝试",
            type: "error",
            center: true,
            offset: "0"
          });
          this.btnText = "确 定";
          this.loading = false;
          console.log(error);
          return false;
        });
    }
  }
};
</script>

<style lang="scss">
.pass-container {
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 400px;
      width: 30%;
      .el-dialog__body {
        padding: 15px;
      }
    }
  }
}
</style>