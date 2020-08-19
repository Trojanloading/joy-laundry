<template>
  <!-- 洗衣管理 -->
  <div class="laundryManagement-container">
    <el-button type="primary" plain round @click.native.stop="handleShowAllOrder">显示所有订单</el-button>
    <el-divider content-position="left">
      <i class="el-icon-caret-bottom"></i>订单详情列表
    </el-divider>
    <el-table
      :data="pageList"
      v-loading="loadingTbDate"
      stripe
      style="width: 100%"
      height="320px"
      size="mini"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="transactionNumber"
        label="交易单号"
        fixed="left"
        min-width="120px"
        sortable
      ></el-table-column>
      <el-table-column prop="vipName" label="会员名称" fixed="left" min-width="120px" sortable></el-table-column>
      <el-table-column prop="vipID" label="会员卡号" min-width="120px" sortable></el-table-column>
      <el-table-column prop="clothesName" label="衣服名称" min-width="100px" sortable></el-table-column>
      <el-table-column prop="laundryType" label="洗衣类型" min-width="100px" sortable></el-table-column>
      <el-table-column prop="clothingBrand" label="衣服品牌" min-width="100px" sortable></el-table-column>
      <el-table-column prop="ispaid" label="是否付费" min-width="100px" sortable></el-table-column>
      <el-table-column prop="whetherTake" label="是否取走" min-width="100px" sortable></el-table-column>
      <el-table-column prop="rewashes" label="是否重洗" min-width="100px" sortable></el-table-column>
      <el-table-column prop="salesReturn" label="是否退赔" min-width="100px" sortable></el-table-column>
      <el-table-column prop="paymentMethod" label="付款方式" min-width="100px" sortable></el-table-column>
      <el-table-column prop="addedDate" label="添加日期" min-width="100px" sortable></el-table-column>
      <el-table-column prop="collectionDate" label="取衣日期" min-width="100px" sortable></el-table-column>
      <el-table-column prop="clothingColor" label="衣服颜色" min-width="150px" sortable></el-table-column>
      <el-table-column prop="clothingAccessories" label="衣服附件" min-width="120px" sortable></el-table-column>
      <el-table-column prop="clothingBlemishes" label="衣服瑕疵" min-width="120px" sortable></el-table-column>
      <el-table-column prop="originalPrice" label="原价(元)" min-width="100px" sortable></el-table-column>
      <el-table-column prop="discount" label="折扣(<=1)" min-width="100px" sortable></el-table-column>
      <el-table-column prop="discountPrice" label="折后价(元)" min-width="100px" sortable></el-table-column>
      <el-table-column prop="amountReceivable" label="应收金额" min-width="100px" sortable></el-table-column>
      <el-table-column prop="paidInAmount" label="实收金额" min-width="100px" sortable></el-table-column>
      <el-table-column prop="maLingAmount" label="抹零金额" min-width="100px" sortable></el-table-column>
      <el-table-column prop="note" label="备注" min-width="200px" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="140px">
        <template>
          <el-button size="mini" round type="info" @click.native.capture="handleEdiOrder">
            <i class="el-icon-edit"></i>&nbsp;编辑
          </el-button>
          <el-button size="mini" round type="danger" @click.native.capture="handleDelOrder">
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
        :total="orderData.length"
      ></el-pagination>
    </div>
    <!-- 编辑订单记录 -->
    <editorOrder
      :isdialogFormVisible="isopen1"
      :orderInformation1="currentRowValue"
      @change="handleChange"
      @ediSuccess="handleSuccess"
    />
    <!-- 删除订单记录 -->
    <deleteOrder
      :isdialogFormVisible="isopen2"
      :orderInformation1="currentRowValue"
      @change="handleChange"
      @delSuccess="handleSuccess"
    />
  </div>
</template>

<script>
import deleteOrder from "./deleteOrder";
import editorOrder from "./editorOrder";
import axios from "axios";

export default {
  name: "laundryManagement",
  components: {
    deleteOrder,
    editorOrder
  },
  props: {
    vipIschoose: {
      type: Boolean
    }
  },
  data() {
    return {
      loadingTbDate: false,
      isopen1: false,
      isopen2: false,
      currentRow: null,
      currentRowValue: null,
      isShowAll: null,
      orderData: [],
      currentPage1: 1, //默认显示页面为1
      pageSize: 6, //每页数据条数
      pageList: []
    };
  },
  watch: {
    vipIschoose: function() {
      let mess = this.$store.state.user.chooseVip;
      this.loadingTbDate = true;
      axios
        .post(
          "http://127.0.0.1:3000/collectionClothings/laundryManagement/loadOrder",
          {
            vipID: mess.vipID
          }
        )
        .then(res => {
          if (res.data == false) {
            this.orderData = [];
            this.currentChangePage(this.orderData, 1);
            setTimeout(() => {
              this.loadingTbDate = false;
            }, 1000);
            console.log("该用户没有订单信息");
          } else {
            this.orderData = res.data;
            this.currentChangePage(this.orderData, 1);
            this.isShowAll = false;
            setTimeout(() => {
              this.loadingTbDate = false;
            }, 1000);
            console.log(res.data);
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
        });
    }
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
        this.currentChangePage(this.orderData, currentPage);
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
    handleSuccess() {
      // this.loadingTbDate = true;
      // setTimeout(() => {
      //   this.loadingTbDate = false;
      // }, 1000);
      if (this.isShowAll) {
        this.handleShowAllOrder();
      } else {
        let mess = this.$store.state.user.chooseVip;
        this.loadingTbDate = true;
        axios
          .post(
            "http://127.0.0.1:3000/collectionClothings/laundryManagement/loadOrder",
            {
              vipID: mess.vipID
            }
          )
          .then(res => {
            if (res.data == false) {
              this.orderData = [];
              setTimeout(() => {
                this.loadingTbDate = false;
              }, 1000);
              console.log("该用户没有订单信息");
            } else {
              this.orderData = res.data;
              this.isShowAll = false;
              setTimeout(() => {
                this.loadingTbDate = false;
              }, 1000);
              console.log(res.data);
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
          });
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.currentRowValue = this.currentRow;
    },
    handleShowAllOrder() {
      this.loadingTbDate = true;
      axios
        .post(
          "http://127.0.0.1:3000/collectionClothings/laundryManagement/loadAllOrder"
        )
        .then(res => {
          if (res.data == false) {
            setTimeout(() => {
              this.orderData = [];
              this.currentChangePage(this.orderData, this.currentPage1);
              this.loadingTbDate = false;
            }, 1000);
            console.log("还没有订单信息");
          } else {
            setTimeout(() => {
              this.orderData = res.data;
              this.currentChangePage(this.orderData, this.currentPage1);
              this.isShowAll = true;
              this.loadingTbDate = false;
            }, 1000);
            console.log(res.data);
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
        });
    },
    handleEdiOrder() {
      this.isopen1 = true;
    },
    handleDelOrder() {
      this.isopen2 = true;
    }
  }
};
</script>

<style lang="scss">
.laundryManagement-container {
  text-align: center;
}
</style>