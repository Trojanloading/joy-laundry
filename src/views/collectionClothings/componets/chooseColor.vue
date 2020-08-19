<template>
  <!-- 选择衣服颜色 -->
  <div class="chooseColor-container">
    <span>衣服颜色:</span>
    <el-color-picker v-model="color" show-alpha :predefine="predefineColors" size="small"></el-color-picker>
  </div>
</template>
<script>
export default {
  name: "chooseColor",
  data() {
    return {
      color: "#aaa",
      predefineColors: [
        "#aaaaaa",
        "#dddddd",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#fff",
        "#000"
      ]
    };
  }
};
</script>

<style lang="scss">
.chooseColor-container {
  display: inline-block;
  margin: 0 15px 15px 0;
  .el-color-picker {
    margin-left: 10px;
    display: inline-block;
    vertical-align: -12px;
    .el-color-picker__trigger {
      width: 150px;
      height: 35px;
    }
  }
  & > span {
    display: inline-block;
    font-size: 14px;
    height: 35px;
    line-height: 35px;
    color: #555;
  }
}
.el-color-dropdown__value .el-input {
  width: 160px;
}
</style>