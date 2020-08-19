<template>
  <!-- 拒绝申请添加衣物 -->
  <div class="nopass-container">
    <el-dialog title="拒绝申请添加衣物" top="30vh" :visible.sync="dialogFormVisible">
      <div>拒绝该申请吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleRemove"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "nopass",
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
      console.log("拒绝该用户申请添加衣物");
      this.applyInformation = newVal;
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handleRemove() {
      this.loading = true;
      this.btnText = "";
      axios
        .post("http://127.0.0.1:3000/applyAddClothes/cancelOrder", this.applyInformation)
        .then(res => {
          console.log(res.data);
          if (res.data == false) {
            this.$message({
              message: "撤销单子失败",
              type: "error",
              center: true,
              offset: "0"
            });
            this.loading = false;
            this.btnText = "确 定";
            console.log("撤销单子失败");
          } else {
            this.$message({
              message: "已拒绝该申请，并更新其会员信息",
              type: "success",
              center: true,
              offset: "0"
            });
            this.$emit("chaSuccess");
            setTimeout(() => {
              this.loading = false;
              this.btnText = "确 定";
              this.dialogFormVisible = false;
            }, 500);
            console.log("拒绝理由更新成功");
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
  }
};
</script>

<style lang="scss">
.nopass-container {
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 200px;
      width: 30%;
      .el-dialog__body {
        padding: 15px !important;
      }
    }
  }
}
</style>