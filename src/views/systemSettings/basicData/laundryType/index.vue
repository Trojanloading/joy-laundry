<template>
  <!-- 洗衣类型设置 -->
  <div class="laundryType-container">
    <div class="btn">
      <el-button type="primary" round @click.native.stop="addLaundryType">添加洗衣类型</el-button>
    </div>
    <el-table
      :data="pageList"
      height="310px"
      stripe
      size="mini"
      v-loading="loadingTbDate"
      style="width: 100%"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column prop="type" label="洗衣类型"></el-table-column>
      <el-table-column label="操作" width="150px" fixed="right">
        <template>
          <el-button size="mini" round type="primary" @click.native.capture="handleEdit">
            <i class="el-icon-edit"></i>&nbsp;修改
          </el-button>
          <el-button size="mini" round type="danger" @click.native.capture="handleDelete">
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
        @current-change="handleCurrentChange1"
        :current-page="currentPage1"
        :page-sizes="[6, 9, 10, 11]"
        :page-size="6"
        layout="total, prev, pager, next, jumper"
        :total="laundryType.length"
      ></el-pagination>
    </div>
    <addLaundryType :isdialogFormVisible="isopen1" @change="handleChange" @success="handleSuccess" />
    <editLaundryType
      :isdialogFormVisible="isopen2"
      :itemInformation1="currentRowValue"
      @change="handleChange"
      @success="handleSuccess"
    />
    <deleteLaundryType
      :isdialogFormVisible="isopen3"
      :itemInformation1="currentRowValue"
      @change="handleChange"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import addLaundryType from "./addLaundryType";
import editLaundryType from "./editLaundryType";
import deleteLaundryType from "./deleteLaundryType";
import axios from "axios";

export default {
  name: "laundryType",
  components: {
    addLaundryType,
    editLaundryType,
    deleteLaundryType
  },
  data() {
    return {
      laundryType: [],
      currentPage1: 1, //默认显示页面为1
      pageSize: 6, //每页数据条数
      pageList: [],
      loadingTbDate: false,
      currentRow: null,
      currentRowValue: null,
      isopen1: false,
      isopen2: false,
      isopen3: false
    };
  },
  methods: {
    // 每页下拉显示数据
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize;
      this.handleCurrentChange1(this.currentPage1);
    },
    // 点击第几页
    handleCurrentChange1: function(currentPage) {
      this.loadingTbDate = true;
      setTimeout(() => {
        this.loadingTbDate = false;
        this.currentPage1 = currentPage;
        this.currentChangePage(this.laundryType, currentPage);
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
    addLaundryType() {
      this.isopen1 = true;
    },
    handleEdit() {
      this.isopen2 = true;
    },
    handleDelete() {
      this.isopen3 = true;
    },
    handleChange() {
      this.isopen1 = false;
      this.isopen2 = false;
      this.isopen3 = false;
    },
    handleSuccess() {
      setTimeout(() => {
        this.loadAll();
      }, 500);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.currentRowValue = this.currentRow;
    },
    loadAll() {
      this.loadingTbDate = true;
      axios
        .post("http://127.0.0.1:3000/laundryType/loadAll")
        .then(res => {
          if (res.data == false) {
            setTimeout(() => {
              this.laundryType = "";
              this.currentChangePage(this.laundryType, this.currentPage1);
              this.loadingTbDate = false;
            }, 1000);
            console.log("查找失败");
          } else {
            setTimeout(() => {
              this.laundryType = res.data;
              this.currentChangePage(this.laundryType, this.currentPage1);
              this.loadingTbDate = false;
            }, 1000);
          }
        })
        .catch(error => {
          this.loadingTbDate = false;
          this.$message({
            message: "服务器错误",
            type: "error",
            center: true,
            offset: "0"
          });
          console.log(error);
        });
    }
  },
  mounted() {
    this.loadAll();
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.laundryType-container {
  .el-tabs {
    text-align: center;
    .el-table {
      margin-top: 10px;
    }
  }
  .el-button {
    box-shadow: 1px 1px 6px 2px #999;
    &:hover {
      box-shadow: 2px 2px 7px 3px #777;
    }
  }
  .btn{
    margin-left: 277px;
  }
}
</style>