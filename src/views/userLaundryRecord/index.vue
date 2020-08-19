<template>
  <div class="userLaundryRecord-container">
    <divider title="洗衣记录" />
    <el-card class="box-card">
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>订单详情
      </el-divider>
      <el-table
        :data="pageList"
        v-loading="loadingTbDate"
        height="250px"
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
        <el-table-column prop="vipName" label="客户名称" sortable min-width="120px" fixed="left"></el-table-column>
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
      <el-table :data="tableData2" v-loading="loadingTbDate2" size="mini" style="width: 100%">
        <el-table-column prop="clothesName" label="衣服名称" min-width="100px"></el-table-column>
        <el-table-column prop="laundryType" label="类型" min-width="100px"></el-table-column>
        <el-table-column prop="clothingBrand" label="衣服品牌" min-width="100px"></el-table-column>
        <el-table-column prop="clothingAccessories" label="衣服附件" min-width="100px"></el-table-column>
        <el-table-column prop="clothingBlemishes" label="衣服瑕疵" min-width="100px"></el-table-column>
        <el-table-column prop="clothingColor" label="衣服颜色" min-width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="discount" label="折扣" min-width="100px"></el-table-column>
        <el-table-column prop="discountPrice" label="折后价" min-width="100px"></el-table-column>
        <el-table-column prop="whetherTake" label="是否取走" min-width="100px"></el-table-column>
        <el-table-column prop="address" label="地址" min-width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="note" label="备注" min-width="200px" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import divider from "../componets/divider";
import axios from "axios";
import * as cookieUtils from "@/utils/cookie";

export default {
  name: "userLaundryRecord",
  components: {
    divider
  },
  data() {
    return {
      orders: [],
      localOrders: null,
      loadingTbDate: false,
      loadingTbDate2: false,
      tableData2: [],
      currentPage1: 1, //默认显示页面为1
      pageSize: 6, //每页数据条数
      pageList: [],
      userInformation: null
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
    handleCurrentChange(val) {
      this.loadingTbDate2 = true;
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
          "http://127.0.0.1:3000/collectionClothings/laundryManagement/loadOrder",
          this.userInformation
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
    }
  },
  mounted() {
    // 去服务端拿所有会员信息
    let user_id = cookieUtils.getCookie("userid");
    axios
      .post("http://127.0.0.1:3000/getUserInfo", {
        user_id: user_id
      })
      .then(res => {
        console.log(res.data);
        if (res.data == false) {
          console.log("查找用户信息失败");
        } else {
          this.userInformation = res.data;
          this.loadAll();
          console.log("查找用户信息成功");
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
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.userLaundryRecord-container {
  .el-card__body {
    padding: 15px;
  }
}
</style>