<template>
  <!-- 衣服瑕疵 -->
  <div class="clothingBlemishes-container">
    <span>衣服瑕疵:</Span>
    <el-checkbox-group v-model="checkboxGroup" size="small">
      <el-checkbox-button v-for="blemish in blemishes" :label="blemish" :key="blemish">{{blemish}}</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script>
const blemishesOptions = ["有补丁", "有破损"];
export default {
  name: "clothingBlemishes",
  data() {
    return {
      checkboxGroup: [],
      blemishes: blemishesOptions
    };
  }
};
</script>

<style lang="scss">
.clothingBlemishes-container {
  display: inline-block;
  height: 35px;
  margin: 0 15px 15px 0;
  .el-checkbox-group {
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
    .el-checkbox-button {
      height: 35px;
      .el-checkbox-button__inner {
        height: 35px;
        line-height: 17px !important;
      }
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
</style>