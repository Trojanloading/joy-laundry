<template>
  <!-- 修改衣服瑕疵 -->
  <div class="editClothingBlemishes-container">
    <el-dialog title="修改衣服瑕疵" top="25vh" :visible.sync="dialogFormVisible">
      <!-- 衣服瑕疵信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        衣服瑕疵信息
      </el-divider>
      <el-form
        ref="editClothingBlemishesForm"
        :model="editClothingBlemishesForm"
        :rules="editClothingBlemishesRules"
      >
        <div class="arrangement">
          <el-form-item prop="type">
            <label>衣服瑕疵名称:</label>
            <el-input
              v-model="editClothingBlemishesForm.type"
              name="type"
              placeholder="请输入衣服瑕疵名称"
              maxlength="13"
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleEditClothingBlemishes"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { validNotEmpty } from "@/utils/validate";
import axios from "axios";

export default {
  name: "editClothingBlemishes",
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    itemInformation1: {
      type: Object
    }
  },
  data() {
    const validateNotEmpty = (rule, value, callback) => {
      if (!validNotEmpty(value)) {
        callback(new Error("不能为空，且不能含有空格"));
      } else {
        axios
          .post("http://127.0.0.1:3000/clothingBlemishes/CBValidate", {
            type: value
          })
          .then(res => {
            if (res.data == false) {
              callback();
            } else {
              console.log(res.data);
              callback(new Error("该衣服瑕疵已存在"));
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
    };
    return {
      dialogFormVisible: false,
      editClothingBlemishesForm: {
        oldType:"",
        type: ""
      },
      editClothingBlemishesRules: {
        type: [{ required: true, trigger: "", validator: validateNotEmpty }]
      },
      loading: false,
      btnText: "确 定"
    };
  },
  watch: {
    isdialogFormVisible: function(newVal) {
      this.dialogFormVisible = newVal;
    },
    dialogFormVisible: function() {
      if (!this.dialogFormVisible) this.$emit("change");
    },
    itemInformation1: function(newVal){
      this.editClothingBlemishesForm.type = newVal.type;
      this.editClothingBlemishesForm.oldType = newVal.type;
    }
  },
  methods: {
    handleClose() {
      this.$refs.editClothingBlemishesForm.resetFields();
      this.dialogFormVisible = false;
    },
    handleEditClothingBlemishes() {
      this.$refs.editClothingBlemishesForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.btnText = "";
          axios
            .post(
              "http://127.0.0.1:3000/clothingBlemishes/editClothingBlemishes",
              this.editClothingBlemishesForm
            )
            .then(res => {
              if (res.data == true) {
                this.$message({
                  message: "衣服瑕疵修改成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                  this.$refs.editClothingBlemishesForm.resetFields();
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("success");
                console.log("衣服瑕疵修改成功");
              } else {
                this.loading = false;
                this.btnText = "确 定";
                console.log("衣服瑕疵修改失败");
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
  },
  mounted() {}
};
</script>

<style lang="scss">
.editClothingBlemishes-container {
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 400px;
      width: 30%;
      .el-dialog__body {
        text-align: left;
        padding: 15px;
        .arrangement {
          & .el-form-item {
            width: 350px;
            .el-form-item__content {
              .el-input {
                width: 200px;
              }
            }
          }
        }
      }
    }
  }
}
</style>