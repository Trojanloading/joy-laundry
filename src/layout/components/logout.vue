<template>
  <!-- 注销 -->
  <div class="logout-container">
    <el-dialog title="温馨提示" top="30vh" :visible.sync="dialogFormVisible">
      <div class="title">你真真的确定退出登录吗?</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleLogout"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import axios from "axios";
import * as cookieUtils from "@/utils/cookie";

export default {
  name: "logout",
  components: {},
  props: {
    isdialogFormVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      dialogFormVisible: false,
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
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handleLogout() {
      this.loading = true;
      this.btnText = "";
      cookieUtils.delCookie("userid");
      cookieUtils.delCookie("adminid");
      this.$router.push({ path: "/login" });
      setTimeout(() => {
        this.loading = false;
        this.btnText = "确 定";
        this.dialogFormVisible = false;
      }, 500);
      this.$message({
        message: "注销成功",
        type: "success",
        center: true,
        offset: "0"
      });
    }
  }
};
</script>

<style lang="scss">
.logout-container {
  .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog {
      // margin-top: 200px !important;
      min-width: 350px;
      width: 20%;
      border-radius: 10px;
      .el-dialog__header {
        font-weight: bold;
        color: #555;
        background-color: #78a17b77;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .el-dialog__body {
        padding: 15px;
        font-size: 16px;
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