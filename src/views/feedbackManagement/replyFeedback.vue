<template>
  <!-- 回复反馈 -->
  <div class="replyFeedback-container">
    <el-dialog title="回复反馈" top="30vh" :visible.sync="dialogFormVisible">
      <el-form ref="replyFeedbackForm" :model="replyFeedbackForm" :rules="replyFeedbackFormRules">
        <el-form-item prop="reply">
          <el-input
            type="textarea"
            placeholder="请输入您的回复内容"
            name="note"
            v-model="replyFeedbackForm.reply"
            :autosize="{ minRows: 5, maxRows: 5 }"
            maxlength="150"
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
          @click.native.prevent="handleRepFeedback"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { validNotEmpty1 } from "@/utils/validate";

export default {
  name: "replyFeedback",
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
    const validateEmpty = (rule, value, callback) => {
      if (!validNotEmpty1(value)) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      replyFeedbackForm: {
        username: "",
        date: new Date(),
        feedback: "",
        reply: ""
      },
      dialogFormVisible: false,
      feedbackInformation: null,
      btnText: "确 定",
      loading: false,
      replyFeedbackFormRules: {
        reply: [{ required: true, trigger: "", validator: validateEmpty }]
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
    feedbackInformation1: function(newVal) {
      console.log("某反馈记录传进来回复了");
      this.feedbackInformation = newVal;
      this.replyFeedbackForm.username = newVal.username;
      this.replyFeedbackForm.date = newVal.date;
      this.replyFeedbackForm.feedback = newVal.feedback;
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handleRepFeedback() {
      this.$refs.replyFeedbackForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.btnText = "";
          console.log(this.replyFeedbackForm);
          axios
            .post(
              "http://127.0.0.1:3000/feedbackManagement/repFeedback",
              this.replyFeedbackForm
            )
            .then(res => {
              console.log(res.data);
              if (res.data == true) {
                this.$message({
                  message: "回复成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("repSuccess");
                console.log("回复成功");
              } else {
                this.$message({
                  message: "回复失败",
                  type: "error",
                  center: true,
                  offset: "0"
                });
                this.loading = false;
                this.btnText = "确 定";
                console.log("回复失败");
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
.replyFeedback-container {
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 400px;
      width: 30%;
      .el-dialog__body {
        padding: 15px;
      }
      .el-dialog__footer {
        padding-top: 0;
      }
    }
  }
}
.v-modal {
  z-index: -1 !important;
}
</style>