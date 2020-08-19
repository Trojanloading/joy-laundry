<template>
  <!-- 会员消费统计 -->
  <div class="memberConsumptionStatistics-container">
    <divider title="会员消费统计" />
    <el-tabs type="border-card" v-model="activeName">
      <!-- 消费充值记录 -->
      <el-tab-pane name="first">
        <span slot="label">
          <i class="el-icon-user-solid"></i>&nbsp;消费充值记录
        </span>
        <!-- 搜索 -->
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入会员卡号或名称"
          @select="handleSelect"
          @keyup.enter.native="handleIconClick"
          clearable
        >
          <i class="el-icon-search el-input__icon" slot="suffix" @click.stop="handleIconClick"></i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.vipName }}</div>
            <span class="addr">{{ item.vipID }}</span>
          </template>
        </el-autocomplete>
        <el-button type="danger" plain round @click.native.stop="handleClikDel">删除记录</el-button>

        <!-- 会员充值记录 -->
        <el-divider content-position="left">
          <i class="el-icon-caret-bottom"></i>会员充值记录
        </el-divider>
        <el-table
          :data="pageList"
          height="280px"
          stripe
          v-loading="loadingTbDate"
          size="mini"
          style="width: 100%"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column prop="vipID" label="会员卡号" sortable min-width="120px" fixed="left"></el-table-column>
          <el-table-column prop="vipName" label="会员名称" sortable min-width="120px"></el-table-column>
          <el-table-column prop="topUpDate" label="充值日期" sortable min-width="120px"></el-table-column>
          <el-table-column prop="paidInActual" label="充值金额(元)" sortable min-width="120px"></el-table-column>
          <el-table-column prop="paidInAmount" label="实收金额(元)" sortable min-width="120px"></el-table-column>
          <el-table-column prop="vipLevel" label="会员级别" sortable min-width="100px"></el-table-column>
          <el-table-column prop="contact" label="联系方式" sortable min-width="100px"></el-table-column>
          <el-table-column prop="paymentMethod" label="付款方式" sortable min-width="120px"></el-table-column>
          <el-table-column prop="note" label="备注" sortable min-width="200px"></el-table-column>
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
            :total="vipTU.length"
          ></el-pagination>
        </div>
        <!-- 会员消费记录 -->
        <el-divider content-position="left">
          <i class="el-icon-caret-bottom"></i>会员消费记录
        </el-divider>
        <el-table :data="tableData2" border size="mini" style="width: 100%">
          <el-table-column prop label="充值日期" sortable></el-table-column>
          <el-table-column prop label="实收金额(元)" sortable></el-table-column>
          <el-table-column prop label="实际充值(元)" sortable></el-table-column>
        </el-table>
        <addClothes />
      </el-tab-pane>

      <!-- 按收款方式统计 -->
      <el-tab-pane name="second">
        <span slot="label">
          <i class="el-icon-s-order"></i>&nbsp;按收款方式统计
        </span>
        这是内容
      </el-tab-pane>
    </el-tabs>
    <deleteRecord
      :isdialogFormVisible="isopen1"
      :customerInformation1="currentRowValue"
      @change="handleChange"
      @delSuccess="handleSuccess"
    />
  </div>
</template>

<script>
import divider from "../componets/divider";
import deleteRecord from "./deleteRecord";
import axios from "axios";

export default {
  name: "memberConsumptionStatistics",
  components: {
    divider,
    deleteRecord
  },
  data() {
    return {
      vipTU: [],
      currentPage1: 1, //默认显示页面为1
      pageSize: 6, //每页数据条数
      pageList: [],
      loadingTbDate: false,
      state: "",
      timeout: null,
      activeName: "first",
      searchInput: "HY20200505002",
      currentRow: null,
      currentRowValue: null,
      isopen1: false,
      tableData2: [
        {
          TopUpDate: "2020-05-01",
          paidInAmount: "45",
          paidInAmount1: "45"
        }
      ]
    };
  },
  methods: {
    // 每页下拉显示数据
    handleSizeChange: function(pageSize) {
      this.pageSize = pageSize;
      this.handleCurrentChange(this.currentPage1);
    },
    // 点击第几页
    handleCurrentChange1: function(currentPage) {
      this.loadingTbDate = true;
      setTimeout(() => {
        this.loadingTbDate = false;
        this.currentPage1 = currentPage;
        this.currentChangePage(this.vipTU, currentPage);
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
    },
    handleClikDel() {
      if (this.currentRow) {
        this.isopen1 = true;
      } else {
        this.$message({
          message: "请在表格中选择某项",
          type: "warning",
          center: true,
          offset: "0"
        });
        console.log("空值，请在表格中选择某项");
      }
    },
    handleSuccess() {
      setTimeout(() => {
        this.loadAll();
      }, 500);
    },
    handleCurrentChange(val) {
      // 点击了某项
      console.log(val._id);
      this.currentRow = val;
      this.currentRowValue = this.currentRow;
      // axios
      //   .post("http://127.0.0.1:3000/vipTopUp/record", { ID: val._id })
      //   .then(res => {
      //     if (res.data == false) {
      //       this.vipTopUpRecord = [];
      //       console.log("无记录，查找失败");
      //     } else {
      //       this.vipTopUpRecord = res.data;
      //       console.log(res.data);
      //     }
      //   })
      //   .catch(error => {
      //     this.$message({
      //       message: "服务器可能走神了！稍后尝试",
      //       type: "error",
      //       center: true,
      //       offset: "0"
      //     });
      //     console.log(error);
      //   });
    },
    loadAll() {
      this.loadingTbDate = true;

      axios
        .post("http://127.0.0.1:3000/memberConsumptionStatistics/loadAll")
        .then(res => {
          if (res.data == "集合为空") {
            console.log("集合为空");
          } else {
            console.log(res.data);
            this.vipTU = res.data;
            this.currentChangePage(this.vipTU, 1);
            setTimeout(() => {
              this.loadingTbDate = false;
            }, 1000);
          }
        })
        .catch(error => {
          this.messageOfRegister(
            "error",
            "服务器错误,请稍后尝试！！！",
            4000,
            true
          );
          console.log(error);
        });
    },
    querySearchAsync(queryString, cb) {
      // 在圈圈等待时去请求新的数据
      this.loadAll();
      var vipTU = this.vipTU;
      var results = queryString
        ? vipTU.filter(this.createStateFilter(queryString))
        : vipTU;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.vipName.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      this.state = item.vipName;
      this.vipTU = [item];
      this.currentChangePage(this.vipTU, 1);
      console.log(item);
    },
    handleIconClick() {
      axios
        .post("http://127.0.0.1:3000/memberConsumptionStatistics/search", {
          state: this.state
        })
        .then(res => {
          if (res.data == "数据库查找错误") {
            this.$message({
              message: "查找失败，数据库错误",
              type: "error",
              center: true,
              offset: "0"
            });
            console.log("数据库查找错误");
          } else if (res.data == false) {
            this.$message({
              message: "没有该会员，请再次确认",
              type: "warning",
              center: true,
              offset: "0"
            });
            console.log("未找到");
          } else {
            this.vipTU = res.data;
            this.currentChangePage(this.vipTU, 1);
          }
        })
        .catch(error => {
          this.messageOfRegister(
            "error",
            "服务器错误,请稍后尝试！！！",
            4000,
            true
          );
          console.log(error);
        });
    }
  },
  mounted() {
    // 去服务端拿所有会员充值记录信息
    this.loadAll();
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.memberConsumptionStatistics-container {
  .el-tabs {
    .el-autocomplete {
      width: 270px;
      margin: 0 45px 15px 20px;
      .el-input--suffix {
        .el-input__inner {
          border-radius: 50px;
          height: 40px;
          padding-left: 30px;
          padding-right: 70px;
          // border-width: #ccc;
        }
        .el-input__suffix {
          height: 40px;
          line-height: 40px;
          .el-input__suffix-inner {
            .el-icon-search {
              cursor: pointer;
              font-weight: bold;
              font-size: 20px;
              width: 60px;
              height: 40px;
              line-height: 42px;
              // padding-right: 20px;
              &:hover {
                color: #78a17b;
              }
            }
            .el-icon-circle-close {
              position: absolute;
              top: 6px;
              left: -20px;
              font-size: 20px;
            }
          }
        }
      }
    }
    .el-button {
      box-shadow: 1px 1px 6px 2px #999;
      &:hover {
        box-shadow: 2px 2px 7px 3px #777;
      }
    }
  }
}
// 搜索建议模板
.my-autocomplete {
  li {
    line-height: normal;
    padding: 5px 15px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: 5px;
    }
    .addr {
      font-size: 15px;
      color: #b4b4b4;
    }
    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>