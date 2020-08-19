<template>
  <!-- 滚回顶部 -->
  <el-backtop :target="target" :bottom="50" :right="15" :visibility-height="150">
    <div
      style="{
        height: 100%;
        width: 100%;
        background-color: #ddd;
        box-shadow: 0 0 20px rgba(136,136,136,.7);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
    >
      <i class="el-icon-caret-top"></i>
    </div>
  </el-backtop>
</template>

<script>
export default {
  name: "ScrollToTop",
  props: {
    target: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.el-backtop {
  z-index: 999;
  div {
    border-radius: 40px;
    &:hover {
      background-color: #ccc !important;
    }
  }
  i {
    color: #78a17b;
  }
}
</style>