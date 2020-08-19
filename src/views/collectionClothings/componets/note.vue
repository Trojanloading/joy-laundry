<template>
  <!-- 备注 -->
  <div class="note-container">
    <span>备注:</span>
    <el-input
      type="textarea"
      placeholder="请输入备注信息"
      v-model="textarea"
      :autosize="{ minRows: 1, maxRows: 3 }"
      maxlength="30"
      show-word-limit
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "note",
  data() {
    return {
      textarea: ""
    };
  }
};
</script>

<style lang="scss">
.note-container {
  display: inline-block;
  height: 35px;
  margin: 0 15px 15px 0;
  .el-textarea {
    margin-left: 10px;
    height: 35px;
    width: 150px;
    .el-textarea__inner {
      display: inline-block;
      height: 35px !important;
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