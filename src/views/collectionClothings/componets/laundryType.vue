<template>
  <!-- 选择洗衣类型 -->
  <div class="laundryType-container">
    <span>洗衣类型:</span>
    <el-select v-model="value" filterable placeholder="请选择洗衣类型">
      <el-option
        v-for="item in laundryType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "laundryType",
  data() {
    return {
      laundryType: [
        {
          value: "选项1",
          label: "干洗"
        },
        {
          value: "选项2",
          label: "水洗"
        },
        {
          value: "选项3",
          label: "皮衣"
        },
        {
          value: "选项4",
          label: "织补"
        },
        {
          value: "选项5",
          label: "单烫"
        },
        {
          value: "选项6",
          label: "附加服务"
        }
      ],
      value: ""
    };
  }
};
</script>

<style lang="scss">
.laundryType-container {
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