<template>
  <!-- 删除反馈记录 -->
  <div class="deleteFeedback-container">
    <el-dialog title="删除该反馈记录" top="30vh" :visible.sync="dialogFormVisible">
      <div class="title">此操作将永久删除该反馈记录, 是否继续?</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleDelFeedback"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "deleteFeedback",
  components: {},
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    feedbackInformation1: {
      type: Object
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      feedbackInformation: null,
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
    feedbackInformation1: function(newVal) {
      console.log("某反馈记录传进来删除了");
      console.log(newVal);
      this.feedbackInformation = newVal;
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handleDelFeedback() {
      this.loading = true;
      this.btnText = "";
      axios
        .post(
          "http://127.0.0.1:3000/feedbackManagement/delFeedback",
          this.feedbackInformation
        )
        .then(res => {
          console.log(res.data);
          if (res.data == true) {
            this.$message({
              message: "反馈记录删除成功",
              type: "success",
              center: true,
              offset: "0"
            });
            setTimeout(() => {
              this.loading = false;
              this.btnText = "确 定";
              this.dialogFormVisible = false;
            }, 500);
            this.$emit("delSuccess");
            console.log("反馈记录删除成功");
          } else {
            this.$message({
              message: "反馈记录删除失败",
              type: "error",
              center: true,
              offset: "0"
            });
            this.loading = false;
            this.btnText = "确 定";
            console.log("反馈记录删除失败");
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
};
</script>

<style lang="scss">
.deleteFeedback-container {
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 400px;
      width: 30%;
    }
  }
}
</style>