<template>
  <!-- 页面上面的title修饰大型分割线 -->
  <div class="divider-container">
    <el-divider :content-position="contentPosition">{{ title }}</el-divider>
  </div>
</template>

<script>
export default {
  name: "divider",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: "请填写title!!!"
    },
    contentPosition: {
      type: String,
      default: "center"
    }
  }
};
</script>

<style lang="scss">
.divider-container {
  .el-divider {
    margin: 20px 0 25px;
    border: 2px solid #ccc;
    border-radius: 10px;
    .el-divider__text {
      height: 25px;
      line-height: 25px;
      font-size: 17px;
      padding: 0 20px;
      color: #eee;
      text-align: center;
      background-color: #78a17b;
      border-radius: 20px;
    }
  }
}
</style>