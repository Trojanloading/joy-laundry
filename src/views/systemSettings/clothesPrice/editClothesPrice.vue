<template>
  <!-- 修改衣物价格 -->
  <div class="editClothesPrice-container">
    <el-dialog title="修改衣物价格" top="25vh" :visible.sync="dialogFormVisible">
      <!-- 衣物价格信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        衣物价格信息
      </el-divider>
      <el-form
        ref="editClothesPriceForm"
        :model="editClothesPriceForm"
        :rules="editClothesPriceRules"
      >
        <div class="arrangement">
          <el-form-item prop="clothesName">
            <label>衣服名称:</label>
            <el-select
              v-model="editClothesPriceForm.clothesName"
              name="clothesName"
              filterable
              placeholder="请选择衣物名称"
              :disabled="true"
            >
              <el-option
                v-for="clothesName in clothesNames"
                :key="clothesName.value"
                :label="clothesName.label"
                :value="clothesName.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="laundryType">
            <label>洗衣类型:</label>
            <el-select
              v-model="editClothesPriceForm.laundryType"
              name="laundryType"
              filterable
              placeholder="请选择洗衣类型"
              :disabled="true"
            >
              <el-option
                v-for="laundryType in laundryTypes"
                :key="laundryType.value"
                :label="laundryType.label"
                :value="laundryType.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="originalPrice">
            <label>价&nbsp;格:</label>
            <el-input
              v-model="editClothesPriceForm.originalPrice"
              ref="originalPrice"
              name="originalPrice"
              placeholder="请输入价格"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item prop="operator">
            <label>操作员:</label>
            <el-input
              v-model="editClothesPriceForm.operator"
              ref="operator"
              name="operator"
              placeholder="操作员"
              :disabled="true"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item prop="addedDate">
            <label>添加日期:</label>
            <el-input
              v-model="editClothesPriceForm.addedDate"
              ref="addedDate"
              name="addedDate"
              placeholder="添加日期"
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
          @click.native.prevent="handleEditClothesPrice"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { validNumber } from "@/utils/validate";
import axios from "axios";

export default {
  name: "editClothesPrice",
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    itemInformation1: {
      type: Object
    }
  },
  data() {
    const validateNumber = (rule, value, callback) => {
      if (!validNumber(value)) {
        callback(new Error("不能为空，且保留两位小数"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      editClothesPriceForm: {
        clothesName: "",
        laundryType: "",
        originalPrice: "",
        operator: "",
        addedDate: ""
      },
      editClothesPriceRules: {
        originalPrice: [
          { required: true, trigger: "", validator: validateNumber }
        ]
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
    itemInformation1: function(newVal) {
      this.editClothesPriceForm = newVal;
    }
  },
  methods: {
    handleClose() {
      this.$refs.editClothesPriceForm.resetFields();
      this.dialogFormVisible = false;
    },
    handleEditClothesPrice() {
      this.$refs.editClothesPriceForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.btnText = "";
          axios
            .post(
              "http://127.0.0.1:3000/clothesPrice/editClothesPrice",
              this.editClothesPriceForm
            )
            .then(res => {
              if (res.data == true) {
                this.$message({
                  message: "衣物价格修改成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                  this.$refs.editClothesPriceForm.resetFields();
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("success");
                console.log("衣物价格修改成功");
              } else {
                this.loading = false;
                this.btnText = "确 定";
                console.log("衣物价格修改失败");
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
.editClothesPrice-container {
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 400px;
      width: 40%;
      .el-dialog__body {
        text-align: left;
        padding: 15px;
        .arrangement {
          & .el-form-item {
            width: 250px;
            .el-form-item__content {
              .el-input {
                width: 160px;
              }
            }
          }
        }
      }
    }
  }
}
</style>