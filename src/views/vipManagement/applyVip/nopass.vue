<template>
  <!-- 回复理由 -->
  <div class="nopass-container">
    <el-dialog title="回复理由" top="30vh" :visible.sync="dialogFormVisible">
      <el-form ref="nopassForm" :model="nopassForm" :rules="nopassFormRules">
        <el-form-item prop="reason">
          <el-input
            type="textarea"
            placeholder="请输入拒绝理由"
            name="reason"
            v-model="nopassForm.reason"
            :autosize="{ minRows: 5, maxRows: 5 }"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleSendReason"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { validNotEmpty1 } from "@/utils/validate";

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
    const validateEmpty = (rule, value, callback) => {
      if (!validNotEmpty1(value)) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      nopassForm: {
        username: "",
        reason: ""
      },
      dialogFormVisible: false,
      applyInformation: null,
      btnText: "确 定",
      loading: false,
      nopassFormRules: {
        reason: [{ required: true, trigger: "", validator: validateEmpty }]
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
    applyInformation1: function(newVal) {
      console.log("申请会员表回复");
      this.applyInformation = newVal;
      this.nopassForm.username = newVal.username;
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    nopass() {},
    handleSendReason() {
      this.$refs.nopassForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.btnText = "";
          axios
            .post("http://127.0.0.1:3000/setReason", this.nopassForm)
            .then(res => {
              console.log(res.data);
              if (res.data == false) {
                this.$message({
                  message: "拒绝理由更新失败",
                  type: "error",
                  center: true,
                  offset: "0"
                });
                this.loading = false;
                this.btnText = "确 定";
                console.log("拒绝理由更新失败");
              } else {
                this.$message({
                  message: "拒绝理由更新成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                  this.$refs.nopassForm.resetFields();
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("chaSuccess");
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.nopass-container {
  .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog {
      // margin-top: 200px !important;
      min-width: 200px;
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
        padding: 15px !important;
        .title {
          height: 50px;
          text-align: center;
          line-height: 50px;
        }
      }
      .el-dialog__footer {
        padding-top: 0;
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