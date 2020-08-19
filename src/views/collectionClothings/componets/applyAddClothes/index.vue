<template>
  <!-- 会员申请添加衣物 -->
  <div class="applyAddClothes-container">
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
        <el-table-column prop="transactionNumber" label="交易单号" min-width="120px"></el-table-column>
        <el-table-column prop="clothesName" label="衣服名称"></el-table-column>
        <el-table-column prop="laundryType" label="洗衣类型"></el-table-column>
        <el-table-column prop="clothingBrand" label="衣服品牌"></el-table-column>
        <el-table-column prop="ispaid" label="是否付费"></el-table-column>
        <el-table-column prop="paymentMethod" label="付款方式"></el-table-column>
        <el-table-column prop="addedDate" label="添加日期"></el-table-column>
        <el-table-column prop="collectionDate" label="取衣日期"></el-table-column>
        <el-table-column prop="clothingColor" label="衣服颜色" width="130px"></el-table-column>
        <el-table-column prop="clothingAccessories" label="衣服附件"></el-table-column>
        <el-table-column prop="clothingBlemishes" label="衣服瑕疵"></el-table-column>
        <el-table-column prop="originalPrice" label="原价(元)"></el-table-column>
        <el-table-column prop="discount" label="折扣(<=1)"></el-table-column>
        <el-table-column prop="discountPrice" label="折后价(元)"></el-table-column>
        <el-table-column prop="amountReceivable" label="应收金额"></el-table-column>
        <el-table-column prop="paidInAmount" label="实收金额"></el-table-column>
        <el-table-column prop="maLingAmount" label="找零金额"></el-table-column>
        <el-table-column prop="address" label="取衣地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="note" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed="right" width="140px">
          <template>
            <el-button size="mini" round type="primary" @click.native.capture="handleClik1">
              <i class="el-icon-success"></i>&nbsp;同意
            </el-button>
            <el-button size="mini" round type="danger" @click.native.capture="handleClik2">
              <i class="el-icon-error"></i>&nbsp;拒绝
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
    <pass
      :isdialogFormVisible="isopen1"
      :applyInformation1="currentRowValue"
      @change="handleChange"
      @addSuccess="handleSuccess"
    />
    <nopass
      :isdialogFormVisible="isopen2"
      :applyInformation1="currentRowValue"
      @change="handleChange"
      @chaSuccess="handleSuccess"
    />
  </div>
</template>

<script>
import axios from "axios";
import pass from "./pass";
import nopass from "./nopass";

export default {
  name: "applyVip",
  components: {
    pass,
    nopass
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
        .post("http://127.0.0.1:3000/getApplyAddClothes")
        .then(res => {
          if (res.data == false) {
            setTimeout(() => {
              this.rawList = "";
              this.currentChangePage(this.rawList, this.currentPage1);
              this.loadingTbDate = false;
            }, 500);
            console.log("获取申请添加衣物列表失败");
          } else {
            setTimeout(() => {
              this.rawList = res.data;
              this.currentChangePage(this.rawList, this.currentPage1);
              this.loadingTbDate = false;
            }, 500);
            console.log("获取申请添加衣物列表成功");
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
      this.getData();
      // setTimeout(() => {
      //   this.$emit("orderUpdate");
      // }, 500);
    },
    handleCurrentChange1(val) {
      this.currentRow = val;
      this.currentRowValue = this.currentRow;
    }
  }
};
</script>
<style lang="scss">
</style>