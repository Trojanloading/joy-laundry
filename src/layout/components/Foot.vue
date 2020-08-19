<template>
  <!-- complete -->
  <div class="foot">
    <footer>
      <span class="left">copyright © 2020 wyuls.top all rights reserved</span>
      <span>clean first&#38;spotless</span>
      <span class="right">--version 1.0.0</span>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Foot"
};
</script>

<style lang="scss" scoped>
.foot {
  width: 100%;
  height: 40px;
  background-color: #ccc;
  color: #666;
  font-size: 14px;
  content: "";
  clear: both;
  overflow: hidden;
  padding: 0 15px;
  footer {
    height: 100%;
    text-align: center;
    span {
      line-height: 40px;
    }
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
}
</style>