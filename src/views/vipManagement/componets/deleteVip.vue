<template>
  <!-- 删除会员 -->
  <div class="deleteVip-container">
    <el-dialog title="删除会员" top="30vh" :visible.sync="dialogFormVisible">
      <div class="title">此操作将永久删除该会员记录, 是否继续?</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleDeleteVip"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "deleteVip",
  components: {},
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    customerInformation1: {
      type: Object
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      customerInformation: null,
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
    customerInformation1: function(newVal) {
      console.log("某会员传进来了");
      this.customerInformation = newVal;
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handleDeleteVip() {
      this.loading = true;
      this.btnText = "";
      axios
        .post(
          "http://127.0.0.1:3000/vipManagement/deleteVip",
          this.customerInformation
        )
        .then(res => {
          console.log(this.customerInformation)
          console.log(res.data);
          if (res.data == true) {
            this.$message({
              message: "删除会员成功",
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
            console.log("删除会员成功");
          } else {
            this.loading = false;
            this.btnText = "确 定";
            console.log("删除会员失败");
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
.deleteVip-container {
  .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog {
      // margin-top: 200px !important;
      min-width: 400px;
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
        .title {
          height: 50px;
          text-align: center;
          line-height: 50px;
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