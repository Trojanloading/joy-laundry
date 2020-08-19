<template>
  <!-- 删除某条系统公告 -->
  <div class="deleteNotice-container">
    <el-dialog title="删除该公告" top="30vh" :visible.sync="dialogFormVisible">
      <div class="title">此操作将永久删除该公告记录, 是否继续?</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleDelNotice"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "deletedNotice",
  components: {},
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    noticeInformation1: {
      type: Object
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      noticeInformation: null,
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
    noticeInformation1: function(newVal) {
      console.log("某公告记录传进来删除了");
      console.log(newVal);
      this.noticeInformation = newVal;
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handleDelNotice() {
      this.loading = true;
      this.btnText = "";
      axios
        .post("http://127.0.0.1:3000/notice/delNotice", this.noticeInformation)
        .then(res => {
          console.log(res.data);
          if (res.data == true) {
            this.$message({
              message: "公告记录删除成功",
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
            console.log("公告记录删除成功");
          } else {
            this.$message({
              message: "公告记录删除失败",
              type: "error",
              center: true,
              offset: "0"
            });
            this.loading = false;
            this.btnText = "确 定";
            console.log("公告记录删除失败");
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
.deleteNotice-container {
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 400px;
      width: 30%;
      .el-dialog__body {
        padding: 0 15px 0 15px;
        .title {
          height: 50px;
          text-align: center;
          line-height: 50px;
        }
      }
      .el-dialog__footer {
        .el-button {
          box-shadow: 1px 1px 6px 2px #999;
          &:hover {
            box-shadow: 2px 2px 7px 3px #777;
          }
        }
      }
    }
  }
}
.v-modal {
  z-index: -1 !important;
}
</style>