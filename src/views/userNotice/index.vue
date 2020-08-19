<template>
  <!-- 系统公告 -->
  <div class="userNotice-container">
    <divider title="系统公告" />
    <el-tabs type="border-card" v-model="activeName">
      <!-- 系统公告 -->
      <el-tab-pane label="系统公告" name="first">
        <span slot="label">
          <i class="el-icon-s-order"></i>&nbsp;系统公告
        </span>
        <div class="table-content">
          <el-table
            :data="pageList"
            stripe
            size="mini"
            v-loading="loadingTbDate"
            height="300px"
            style="width: 100%;"
            highlight-current-row
          >
            <el-table-column prop="date" label="日期" width="100px" sortable></el-table-column>
            <el-table-column prop="content" label="公告内容" show-overflow-tooltip></el-table-column>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import divider from "../componets/divider";
import axios from "axios";

export default {
  name: "userNotice",
  components: {
    divider
  },
  data() {
    return {
      rawList: [],
      currentPage1: 1, //默认显示页面为1
      pageSize: 6, //每页数据条数
      pageList: [],
      loadingTbDate: false,
      activeName: "first"
    };
  },
  methods: {
    getData() {
      this.loadingTbDate = true;
      axios
        .post("http://127.0.0.1:3000/getNotice")
        .then(res => {
          console.log(res.data);
          if (res.data == false) {
            console.log("获取系统公告失败");
          } else {
            this.rawList = res.data;
            this.currentChangePage(this.rawList, 1);
            this.loadingTbDate = false;
            console.log(res.data);
            console.log("获取系统公告成功");
          }
        })
        .catch(error => {
          this.$message({
            message: "服务器可能走神了！稍后尝试",
            type: "error",
            center: true,
            offset: "0"
          });
          this.loadingTbDate = false;
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
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.userNotice-container {
  .box-card {
    width: 500px;
    margin: 50px auto 30px;
    background-color: #eee;
    border-radius: 10px;
    .el-card__header {
      background-color: #78a17b77;
      line-height: 22px;
      span {
        color: #666;
      }
    }
    .el-card__body {
      .el-textarea {
        .el-textarea__inner {
          @include scrollBar;
        }
      }
    }
    .send {
      margin-top: 20px;
      width: 100%;
    }
  }
}
</style>