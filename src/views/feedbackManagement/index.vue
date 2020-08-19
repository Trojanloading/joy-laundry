<template>
  <!-- 反馈管理 -->
  <div class="feedbackManagement-container">
    <divider title="反馈管理" />
    <!-- 表格数据 -->
    <div class="table-content">
      <el-table
        :data="pageList"
        stripe
        size="mini"
        v-loading="loadingTbDate"
        height="320px"
        style="width: 100%;"
        highlight-current-row
        @current-change="handleCurrentChange1"
      >
        <el-table-column prop="date" label="日期" width="100px" sortable></el-table-column>
        <el-table-column prop="username" label="用户名称" width="100px" sortable></el-table-column>
        <el-table-column prop="feedback" label="反馈内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reply" label="回复内容" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed="right" width="140px">
          <template>
            <el-button size="mini" round type="primary" @click.native.capture="handleClik1">
              <i class="el-icon-position"></i>&nbsp;回复
            </el-button>
            <el-button size="mini" round type="danger" @click.native.capture="handleClik2">
              <i class="el-icon-delete"></i>&nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <!-- layout="total, sizes, prev, pager, next, jumper" -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage1"
          :page-sizes="[6, 9, 10, 11]"
          :page-size="6"
          layout="total, prev, pager, next, jumper"
          :total="rawList.length"
        ></el-pagination>
      </div>
    </div>
    <replyFeedback
      :isdialogFormVisible="isopen1"
      :feedbackInformation1="currentRowValue"
      @change="handleChange"
      @repSuccess="handleSuccess"
    />
    <delFeedback
      :isdialogFormVisible="isopen2"
      :feedbackInformation1="currentRowValue"
      @change="handleChange"
      @delSuccess="handleSuccess"
    />
  </div>
</template>

<script>
import divider from "../componets/divider";
import axios from "axios";
import replyFeedback from "./replyFeedback";
import delFeedback from "./delFeedback";

export default {
  name: "feedbackManagement",
  components: {
    divider,
    replyFeedback,
    delFeedback
  },
  data() {
    return {
      rawList: [],
      currentPage1: 1, //默认显示页面为1
      pageSize: 6, //每页数据条数
      pageList: [],
      loadingTbDate: false,
      isopen1: false,
      isopen2: false,
      currentRowValue: null,
      currentRow: null
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loadingTbDate = true;
      axios
        .post("http://127.0.0.1:3000/getUserFeedback", this.userFeedbackForm)
        .then(res => {
          console.log(res.data);
          if (res.data == false) {
            setTimeout(() => {
              this.rawList = "";
              this.currentChangePage(this.rawList, this.currentPage1);
              this.loadingTbDate = false;
            }, 500);
            console.log("获取建议列表失败");
          } else {
            setTimeout(() => {
              this.rawList = res.data;
              this.currentChangePage(this.rawList, this.currentPage1);
              this.loadingTbDate = false;
            }, 1000);
            console.log("获取建议列表成功");
          }
        })
        .catch(error => {
          this.$message({
            message: "服务器可能走神了！稍后尝试",
            type: "error",
            center: true,
            offset: "0"
          });
          console.log(error);
          return false;
        });
    },
    // 每页下拉显示数据
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize;
      this.handleCurrentChange(this.currentPage1);
    },
    // 点击第几页
    handleCurrentChange: function(currentPage) {
      this.loadingTbDate = true;
      setTimeout(() => {
        this.loadingTbDate = false;
        this.currentPage1 = currentPage;
        this.currentChangePage(this.rawList, currentPage);
      }, 300);
    },
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.pageList = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.pageList.push(list[from]);
        }
      }
    },
    handleChange() {
      this.isopen1 = false;
      this.isopen2 = false;
    },
    handleClik1() {
      this.isopen1 = true;
    },
    handleClik2() {
      this.isopen2 = true;
    },
    handleSuccess() {
      setTimeout(() => {
        this.getData();
      }, 500);
    },
    handleCurrentChange1(val) {
      this.currentRow = val;
      this.currentRowValue = this.currentRow;
    }
  }
};
</script>
<style lang="scss">
@import "~@/styles/mixin.scss";

.feedbackManagement-container {
  .table-content {
    .el-table {
      margin-top: 50px;
    }
  }
}
</style>