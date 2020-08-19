<template>
  <!-- 选择衣服名称 -->
  <div class="clothingName-container">
    <span>衣服名称:</span>
    <el-select v-model="value" filterable placeholder="请选择衣物名称">
      <el-option
        v-for="item in clothingName"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "clothingName",
  data() {
    return {
      clothingName: [
        {
          value: "选项1",
          label: "T恤(夏季)"
        },
        {
          value: "选项2",
          label: "上衣"
        },
        {
          value: "选项3",
          label: "呢子外衣"
        },
        {
          value: "选项4",
          label: "呢子裙"
        },
        {
          value: "选项5",
          label: "毛裤"
        },
        {
          value: "选项6",
          label: "短裙"
        },
        {
          value: "选项7",
          label: "围巾"
        },
        {
          value: "选项8",
          label: "真丝衬衫"
        },
        {
          value: "选项9",
          label: "短款羽绒服"
        }
      ],
      value: ""
    };
  }
};
</script>

<style lang="scss">
.clothingName-container {
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
   &>span {
    display: inline-block;
    font-size: 14px;
    height: 35px;
    line-height: 35px;
    color: #555;
  }
}
</style>