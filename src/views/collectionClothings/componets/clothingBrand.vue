<template>
  <!-- 选择衣服品牌 -->
  <div class="clothingBrand-container">
    <span>衣服品牌:</span>
    <el-select v-model="value" filterable placeholder="请选择衣服品牌">
      <el-option
        v-for="item in clothingBrand"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "clothingBrand",
  data() {
    return {
      clothingBrand: [
        {
          value: "选项1",
          label: "七匹狼"
        },
        {
          value: "选项2",
          label: "安踏"
        },
        {
          value: "选项3",
          label: "A21"
        },
        {
          value: "选项4",
          label: "李宁"
        },
        {
          value: "选项5",
          label: "森马"
        },
        {
          value: "选项6",
          label: "优衣库"
        },
        {
          value: "选项7",
          label: "H&M"
        },
        {
          value: "选项8",
          label: "Beaster"
        },
        {
          value: "选项9",
          label: "美特斯邦威"
        }
      ],
      value: ""
    };
  }
};
</script>


<style lang="scss">
.clothingBrand-container {
  display: inline-block;
  height: 35px;
  margin: 0 15px 15px 0;
  .el-select {
    width: 150px;
    height: 35px;
    margin-left: 10px;
    .el-input {
      width: 150px;
      height: 35px;
      .el-input__inner {
        height: 35px;
      }
      .el-input__icon {
        height: 35px;
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