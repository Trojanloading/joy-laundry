<template>
  <!-- 衣物附件 -->
  <div class="clothingAccessories-container">
    <span>衣物附件:</span>
    <el-checkbox-group v-model="checkboxGroup" size="small">
      <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script>
const cityOptions = ["帽子", "围巾", "腰带", "衣袖"];
export default {
  name: "clothingAccessories",
  data() {
    return {
      checkboxGroup: [],
      cities: cityOptions
    };
  }
};
</script>

<style lang="scss">
.clothingAccessories-container {
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
        line-height: 17px;
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