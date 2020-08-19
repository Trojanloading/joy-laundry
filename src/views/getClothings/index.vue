<template>
  <!-- 领取衣物 -->
  <div class="getClothings-container">
    <divider title="领取衣物" />
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-autocomplete
        popper-class="my-autocomplete"
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入名称或订单号"
        @select="handleSelect"
        @keyup.enter.native="handleIconClick"
        clearable
      >
        <i class="el-icon-search el-input__icon" slot="suffix" @click.stop="handleIconClick"></i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.vipName }}</div>
          <span class="addr">{{ item.transactionNumber }}</span>
        </template>
      </el-autocomplete>
      <!-- 相关操作 -->
      <el-button type="success" plain round @click="handleClik1">取衣结单</el-button>
      <el-button type="warning" plain round @click="handleClik2">订单付费</el-button>
      <el-button type="info" plain round @click="handleClik3">返回重洗</el-button>
      <el-button type="warning" plain round @click="handleClik4">退赔衣物</el-button>
      <el-button type="danger" plain round @click="handleClik5">撤销单子</el-button>
      <!-- 表 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>订单详情
      </el-divider>
      <el-table
        :data="pageList"
        v-loading="loadingTbDate"
        height="300px"
        size="mini"
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column type="index" label="序号" width="50" fixed="left"></el-table-column>
        <el-table-column
          prop="transactionNumber"
          label="交易单号"
          sortable
          min-width="120px"
          fixed="left"
        ></el-table-column>
        <el-table-column prop="vipName" label="客户名称" sortable min-width="100px" fixed="left"></el-table-column>
        <el-table-column prop="addedDate" label="添加日期" sortable min-width="100px"></el-table-column>
        <el-table-column prop="collectionDate" label="取衣日期" sortable min-width="100px"></el-table-column>
        <el-table-column prop="amountReceivable" label="应收金额" sortable min-width="100px"></el-table-column>
        <el-table-column prop="paidInAmount" label="实收金额" sortable min-width="100px"></el-table-column>
        <el-table-column prop="maLingAmount" label="找零金额" sortable min-width="100px"></el-table-column>
        <el-table-column prop="ispaid" label="是否付费" sortable min-width="100px"></el-table-column>
        <el-table-column prop="rewashes" label="是否重洗" sortable min-width="100px"></el-table-column>
        <el-table-column prop="salesReturn" label="是否退赔" sortable min-width="100px"></el-table-column>
        <el-table-column prop="vipID" label="会员卡号" sortable min-width="120px"></el-table-column>
        <el-table-column prop="contact" label="联系方式" sortable min-width="100px"></el-table-column>
        <el-table-column prop="note" label="备注" min-width="200px"></el-table-column>
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
          :total="orders.length"
        ></el-pagination>
      </div>

      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>订单内容详情
      </el-divider>
      <el-table
        :data="tableData2"
        v-loading="loadingTbDate2"
        size="mini"
        style="width: 100%"
      >
        <el-table-column prop="clothesName" label="衣服名称" min-width="100px"></el-table-column>
        <el-table-column prop="laundryType" label="类型" min-width="100px"></el-table-column>
        <el-table-column prop="clothingBrand" label="衣服品牌" min-width="100px"></el-table-column>
        <el-table-column prop="clothingAccessories" label="衣服附件" min-width="100px"></el-table-column>
        <el-table-column prop="clothingBlemishes" label="衣服瑕疵" min-width="100px"></el-table-column>
        <el-table-column prop="clothingColor" label="衣服颜色" min-width="100px"></el-table-column>
        <el-table-column prop="discount" label="折扣" min-width="100px"></el-table-column>
        <el-table-column prop="discountPrice" label="折后价" min-width="100px"></el-table-column>
        <el-table-column prop="whetherTake" label="是否取走" min-width="100px"></el-table-column>
        <el-table-column prop="note" label="备注" min-width="200px"></el-table-column>
      </el-table>
      <!-- 取衣结单窗口 -->
      <takeStatements
        :isdialogFormVisible="isopen1"
        :orderInformation1="currentRowValue"
        @change="handleChange"
        @recSuccess="handleSuccess"
      />
      <!-- 订单付费窗口 -->
      <paid
        :isdialogFormVisible="isopen2"
        :orderInformation1="currentRowValue"
        @change="handleChange"
        @recSuccess="handleSuccess"
      />
      <!-- 返回重洗窗口 -->
      <rewashes
        :isdialogFormVisible="isopen3"
        :orderInformation1="currentRowValue"
        @change="handleChange"
        @recSuccess="handleSuccess"
      />
      <!-- 退赔衣物窗口 -->
      <salesReturn
        :isdialogFormVisible="isopen4"
        :orderInformation1="currentRowValue"
        @change="handleChange"
        @recSuccess="handleSuccess"
      />
      <!-- 撤销单子窗口 -->
      <cancelOrder
        :isdialogFormVisible="isopen5"
        :orderInformation1="currentRowValue"
        @change="handleChange"
        @recSuccess="handleSuccess"
      />
    </el-card>
  </div>
</template>

<script>
import divider from "../componets/divider";
import takeStatements from "./componets/takeStatements";
import paid from "./componets/paid";
import rewashes from "./componets/rewashes";
import salesReturn from "./componets/salesReturn";
import cancelOrder from "./componets/cancelOrder";
import axios from "axios";

export default {
  name: "getClothings",
  components: {
    divider,
    takeStatements,
    paid,
    rewashes,
    salesReturn,
    cancelOrder
  },
  data() {
    return {
      orders: [],
      localOrders: null,
      state: "",
      timeout: null,
      isopen1: false,
      isopen2: false,
      isopen3: false,
      isopen4: false,
      isopen5: false,
      currentRowValue: null,
      currentRow: null,
      loadingTbDate: false,
      loadingTbDate2: false,
      tableData2: [],
      currentPage1: 1, //默认显示页面为1
      pageSize: 6, //每页数据条数
      pageList: []
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
        this.currentChangePage(this.orders, currentPage);
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
    //处理点击弹出
    handleChange() {
      this.isopen1 = false;
      this.isopen2 = false;
      this.isopen3 = false;
      this.isopen4 = false;
      this.isopen5 = false;
      // this.loadingTbDate = true;
      // setTimeout(() => {
      //   this.loadingTbDate = false;
      // }, 1000);
    },
    handleClik1() {
      if (this.currentRow) {
        this.isopen1 = true;
      } else {
        this.$message({
          message: "请在表格中选择某订单项",
          type: "warning",
          center: true,
          offset: "0"
        });
        console.log("空值，请在表格中选择某订单项");
      }
    },
    handleClik2() {
      if (this.currentRow) {
        if (this.currentRowValue.ispaid == "是") {
          this.$message({
            message: "该订单项已付费",
            type: "warning",
            center: true,
            offset: "0"
          });
        } else {
          this.isopen2 = true;
        }
      } else {
        this.$message({
          message: "请在表格中选择某订单项",
          type: "warning",
          center: true,
          offset: "0"
        });
        console.log("空值，请在表格中选择某订单项");
      }
    },
    handleClik3() {
      if (this.currentRow) {
        if (this.currentRowValue.whetherTake == "是") {
          this.$message({
            message: "该订单项已取走，不能执行重洗操作",
            type: "warning",
            center: true,
            offset: "0"
          });
        } else {
          this.isopen3 = true;
        }
      } else {
        this.$message({
          message: "请在表格中选择某订单项",
          type: "warning",
          center: true,
          offset: "0"
        });
        console.log("空值，请在表格中选择某订单项");
      }
    },
    handleClik4() {
      if (this.currentRow) {
        if (this.currentRowValue.whetherTake == "是") {
          this.$message({
            message: "该订单项已取走，不能执行退赔操作",
            type: "warning",
            center: true,
            offset: "0"
          });
        } else {
          this.isopen4 = true;
        }
      } else {
        this.$message({
          message: "请在表格中选择某订单项",
          type: "warning",
          center: true,
          offset: "0"
        });
        console.log("空值，请在表格中选择某订单项");
      }
    },
    handleClik5() {
      if (this.currentRow) {
        if (this.currentRowValue.whetherTake == "是") {
          this.$message({
            message: "该订单项已取走，不能执行撤销操作",
            type: "warning",
            center: true,
            offset: "0"
          });
        } else {
          this.isopen5 = true;
        }
      } else {
        this.$message({
          message: "请在表格中选择某订单项",
          type: "warning",
          center: true,
          offset: "0"
        });
        console.log("空值，请在表格中选择某订单项");
      }
    },
    handleSuccess() {
      setTimeout(() => {
        this.loadAll();
      }, 500);
    },
    handleCurrentChange(val) {
      // 点击了某项
      console.log(val);
      this.loadingTbDate2 = true;
      this.currentRow = val;
      this.currentRowValue = this.currentRow;
      this.tableData2 = [val];
      setTimeout(() => {
        this.loadingTbDate2 = false;
      }, 1000);
    },
    messageOfRegister(type, title, time, showClose) {
      //通知弹窗
      this.$notify({
        title: title,
        message: "",
        type: type,
        duration: time,
        showClose: showClose
      });
    },
    loadAll() {
      this.loadingTbDate = true;
      axios
        .post(
          "http://127.0.0.1:3000/collectionClothings/laundryManagement/loadAllOrder"
        )
        .then(res => {
          if (res.data == "集合为空") {
            setTimeout(() => {
              this.orders = "";
              this.currentChangePage(this.orders, this.currentPage1);
              this.localOrders = "";
              this.loadingTbDate = false;
            }, 1000);
            console.log("集合为空");
          } else {
            setTimeout(() => {
              this.orders = res.data;
              this.currentChangePage(this.orders, this.currentPage1);
              this.localOrders = res.data;
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
          this.loadingTbDate = false;
          console.log(error);
        });
    },
    querySearchAsync(queryString, cb) {
      // this.loadAll();
      this.loadingTbDate = true;
      var orders = this.localOrders;
      var results = queryString
        ? orders.filter(this.createStateFilter(queryString))
        : orders;
      console.log(results);
      this.orders = results;
      this.currentChangePage(this.orders, 1);

      setTimeout(() => {
        this.loadingTbDate = false;
      }, 1000);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 2000 * Math.random());
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
      this.orders = [item];
      this.currentChangePage(this.orders, 1);
      console.log(item);
      this.loadingTbDate = true;
      setTimeout(() => {
        this.loadingTbDate = false;
      }, 1000);
    },
    handleIconClick() {
      this.loadingTbDate = true;
      axios
        .post(
          "http://127.0.0.1:3000/collectionClothings/laundryManagement/search",
          {
            state: this.state
          }
        )
        .then(res => {
          if (res.data == "数据库查找错误") {
            this.loadingTbDate = false;
            this.$message({
              message: "查找失败，数据库错误",
              type: "error",
              center: true,
              offset: "0"
            });
            console.log("数据库查找错误");
          } else if (res.data == false) {
            this.loadingTbDate = false;
            this.$message({
              message: "没有该会员，请再次确认",
              type: "warning",
              center: true,
              offset: "0"
            });
            console.log("未找到");
          } else {
            this.orders = res.data;
            this.currentChangePage(this.orders, 1);
            setTimeout(() => {
              this.loadingTbDate = false;
            }, 1000);
          }
        })
        .catch(error => {
          this.loadingTbDate = false;
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
  created() {},
  mounted() {
    this.loadAll();
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.getClothings-container {
  .el-card__body {
    padding: 15px;
    .el-divider {
      margin: 15px 0 15px;
      border: 1px solid #ccc;
      border-radius: 0px;
      .el-divider__text {
        height: 17px;
        line-height: 17px;
        font-size: 12px;
        padding: 0 10px 0 5px;
        color: #eee;
        text-align: center;
        background-color: #78a17b;
        border-radius: 10px;
      }
    }
    .el-table {
      td {
        text-align: center !important;
      }
      .cell {
        display: inline-block;
        white-space: nowrap !important;
        min-width: 50px;
        text-align: center;
      }
      .el-table__body-wrapper {
        @include scrollBar(9px);
        white-space: nowrap;
      }
      .el-button {
        padding: 7px;
      }
    }
    .pagination {
      text-align: center;
      margin-top: 15px;
      .el-pagination {
        .btn-prev {
          border-radius: 20px;
        }
        .el-pager {
          .number {
            border-radius: 20px;
          }
        }
        .btn-next {
          border-radius: 20px;
        }
      }
    }
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
    .el-loading-spinner {
      svg {
        width: 50px;
        height: 50px;
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