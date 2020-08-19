<template>
  <!-- 选择日期 -->
  <div class="selectDate-container">
    <span>领取日期:</span>
    <el-date-picker
      v-model="value1"
      align="right"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  name: "selectDate",
  data() {
    return {
      pickerOptions: {
        // 禁用日期，今天前
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "后天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit("pick", date);
            }
          },
          {
            text: "大后天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: ""
    };
  }
};
</script>

<style lang="scss">
.selectDate-container {
  display: inline-block;
  height: 35px;
  margin: 0 15px 15px 0;
  .el-input {
    width: 150px;
    height: 35px;
    margin-left: 10px;
    .el-input__inner {
      height: 35px;
    }
    .el-input__icon {
      height: 38px;
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