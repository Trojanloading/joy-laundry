<template>
  <!-- 添加衣物价格 -->
  <div class="addClothesPrice-container">
    <el-dialog title="添加衣物价格" top="25vh" :visible.sync="dialogFormVisible">
      <!-- 衣物价格信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        衣物价格信息
      </el-divider>
      <el-form ref="addClothesPriceForm" :model="addClothesPriceForm" :rules="addClothesPriceRules">
        <div class="arrangement">
          <el-form-item prop="clothesName">
            <label>衣服名称:</label>
            <el-select
              v-model="addClothesPriceForm.clothesName"
              name="clothesName"
              filterable
              placeholder="请选择衣物名称"
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
              v-model="addClothesPriceForm.laundryType"
              name="laundryType"
              filterable
              placeholder="请选择洗衣类型"
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
              v-model="addClothesPriceForm.originalPrice"
              ref="originalPrice"
              name="originalPrice"
              placeholder="请输入价格"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item prop="operator">
            <label>操作员:</label>
            <el-input
              v-model="addClothesPriceForm.operator"
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
              v-model="addClothesPriceForm.addedDate"
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
          @click.native.prevent="handleAddClothesPrice"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { validNumber } from "@/utils/validate";
import axios from "axios";
import * as cookieUtils from "@/utils/cookie";

export default {
  name: "addClothesPrice",
  props: {
    isdialogFormVisible: {
      type: Boolean
    }
  },
  data() {
    const validateLaundryType = (rule, value, callback) => {
      axios
        .post(
          "http://127.0.0.1:3000/clothesPrice/CPValidate",
          this.addClothesPriceForm
        )
        .then(res => {
          if (res.data == false) {
            callback();
          } else {
            callback(new Error("已存在该条价格信息，请重新选择衣物名称"));
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
    };
    const validateNumber = (rule, value, callback) => {
      if (!validNumber(value)) {
        callback(new Error("不能为空，且保留两位小数"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      addClothesPriceForm: {
        clothesName: "",
        laundryType: "",
        originalPrice: "",
        operator: "",
        addedDate: ""
      },
      addClothesPriceRules: {
        originalPrice: [
          { required: true, trigger: "", validator: validateNumber }
        ],
        laundryType: [
          { required: true, trigger: "", validator: validateLaundryType }
        ]
      },
      loading: false,
      btnText: "确 定",
      clothesNames: [],
      laundryTypes: []
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
    initDate() {
      const d = new Date();
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    },
    handleClose() {
      this.$refs.addClothesPriceForm.resetFields();
      this.dialogFormVisible = false;
    },
    handleAddClothesPrice() {
      this.$refs.addClothesPriceForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.btnText = "";
          axios
            .post(
              "http://127.0.0.1:3000/clothesPrice/addClothesPrice",
              this.addClothesPriceForm
            )
            .then(res => {
              if (res.data == "success") {
                this.$message({
                  message: "衣物价格添加成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                  this.$refs.addClothesPriceForm.resetFields();
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("success");
                console.log("衣物价格添加成功");
              } else {
                this.loading = false;
                this.btnText = "确 定";
                console.log("衣物价格添加失败");
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
  mounted() {
    // 获取日期
    this.addClothesPriceForm.addedDate = this.initDate();
    // 获取操作员
    var operator_id = cookieUtils.getCookie("adminid");
    axios
      .post("http://127.0.0.1:3000/getClothings/salesReturn/getOperator", {
        operator_id: operator_id
      })
      .then(res => {
        if (res.data == false) {
          console.log("查找操作员失败");
        } else {
          this.addClothesPriceForm.operator = res.data.username;
          console.log("查找操作员成功");
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
    // 获取衣服名称信息
    axios
      .post("http://127.0.0.1:3000/clothesName/loadAll")
      .then(res => {
        if (res.data == false) {
          this.$message({
            message: "获取衣服名称信息失败",
            type: "error",
            center: true,
            offset: "0"
          });
        } else {
          this.clothesNames = res.data;
          for (let item in res.data) {
            this.clothesNames[item].value = res.data[item].type;
            this.clothesNames[item].label = res.data[item].type;
          }
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
    // 获取洗衣类型信息
    axios
      .post("http://127.0.0.1:3000/laundryType/loadAll")
      .then(res => {
        if (res.data == false) {
          this.$message({
            message: "获取洗衣类型信息失败",
            type: "error",
            center: true,
            offset: "0"
          });
        } else {
          this.laundryTypes = res.data;
          for (let item in res.data) {
            this.laundryTypes[item].value = res.data[item].type;
            this.laundryTypes[item].label = res.data[item].type;
          }
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
</script>

<style lang="scss">
.addClothesPrice-container {
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