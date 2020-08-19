<template>
  <!-- 删除衣服品牌 -->
  <div class="deleteClothingBrand-container">
    <el-dialog title="删除衣服品牌" top="30vh" :visible.sync="dialogFormVisible">
      <div style="text-align:center">该衣服品牌将被移除，是否继续？</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="primary"
          round
          :loading="loading"
          @click.native.prevent="handleDeleteClothingBrand"
        >{{ btnText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "deleteClothingBrand",
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    itemInformation1: {
      type: Object
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      deleteClothingBrandForm: {
        type: ""
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
      this.deleteClothingBrandForm.type = newVal.type;
    }
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
    },
    handleDeleteClothingBrand() {
      this.loading = true;
      this.btnText = "";
      axios
        .post(
          "http://127.0.0.1:3000/clothingBrand/deleteClothingBrand",
          this.deleteClothingBrandForm
        )
        .then(res => {
          if (res.data == true) {
            this.$message({
              message: "衣服品牌删除成功",
              type: "success",
              center: true,
              offset: "0"
            });
            setTimeout(() => {
              this.loading = false;
              this.btnText = "确 定";
              this.dialogFormVisible = false;
            }, 500);
            this.$emit("success");
            console.log("衣服品牌删除成功");
          } else {
            this.loading = false;
            this.btnText = "确 定";
            console.log("衣服品牌删除失败");
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
  },
  mounted() {}
};
</script>

<style lang="scss">
.deleteClothingBrand-container {
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
          }
        }
      }
    }
  }
}
</style>