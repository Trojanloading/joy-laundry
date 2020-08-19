<template>
  <!-- 会员管理 -->
  <div class="vipManagement-container">
    <divider title="会员管理" />
    <el-tabs type="border-card" v-model="activeName">
      <!-- 会员信息 -->
      <el-tab-pane name="first">
        <span slot="label">
          <i class="el-icon-user-solid"></i>&nbsp;会员信息
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
        <!-- 相关操作 -->
        <el-button type="primary" plain round @click.native.stop="handleClik1">添加会员</el-button>
        <el-button type="info" plain round @click.native.stop="handleClik2">会员补卡</el-button>
        <!-- 会员信息详情 -->
        <el-divider content-position="left">
          <i class="el-icon-caret-bottom"></i>会员信息详情
        </el-divider>
        <el-table
          :data="pageList"
          v-loading="loadingTbDate"
          height="320px"
          stripe
          fit
          lazy
          size="mini"
          style="width: 100%"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column prop="vipID" label="会员卡号" sortable min-width="120px" fixed="left"></el-table-column>
          <el-table-column prop="vipName" label="会员名称" sortable min-width="100px" fixed="left"></el-table-column>
          <el-table-column prop="vipState" label="会员卡状态" sortable min-width="100px"></el-table-column>
          <el-table-column prop="vipLevel" label="会员级别" sortable min-width="100px"></el-table-column>
          <el-table-column prop="vipDiscount" label="会员折扣" sortable min-width="100px"></el-table-column>
          <el-table-column prop="balance" label="卡内余额" sortable min-width="100px"></el-table-column>
          <el-table-column prop="totalConsumption" label="消费总额" sortable min-width="100px"></el-table-column>
          <el-table-column prop="numberOfConsumption" label="消费次数" sortable min-width="100px"></el-table-column>
          <el-table-column prop="contact" label="联系方式" sortable min-width="100px"></el-table-column>
          <el-table-column prop="vipIntegral" label="客户积分" sortable min-width="100px"></el-table-column>
          <el-table-column prop="gender" label="性别" sortable min-width="100px"></el-table-column>
          <el-table-column prop="registrationDate" label="注册日期" sortable min-width="100px"></el-table-column>
          <el-table-column prop="vipPassword" label="会员密码" sortable min-width="100px"></el-table-column>
          <el-table-column prop="note" label="备注" sortable min-width="200px"></el-table-column>
          <el-table-column label="操作" fixed="right" width="150px">
            <template>
              <el-button size="mini" round type="info" @click.native.capture="handleClik3">
                <i class="el-icon-edit"></i>&nbsp;编辑
              </el-button>
              <el-button size="mini" round type="danger" @click.native.capture="handleClik4">
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
            :total="vips.length"
          ></el-pagination>
        </div>
        <!-- 会员充值记录 -->
        <el-divider content-position="left">
          <i class="el-icon-caret-bottom"></i>会员充值记录
        </el-divider>
        <el-table
          :data="vipTopUpRecord"
          v-loading="loadingTbDate2"
          stripe
          size="mini"
          style="width: 100%"
          highlight-current-row
        >
          <el-table-column prop="topUpDate" label="充值日期" sortable></el-table-column>
          <el-table-column prop="paidInAmount" label="实收金额(元)" sortable></el-table-column>
          <el-table-column prop="paidInActual" label="实际充值(元)" sortable></el-table-column>
        </el-table>
        <!-- <addClothes /> -->
      </el-tab-pane>

      <!-- 会员申请 -->
      <el-tab-pane label="会员申请" name="second">
        <span slot="label">
          <i class="el-icon-s-order"></i>&nbsp;会员申请
        </span>
        <applyVip />
      </el-tab-pane>

      <!-- 积分兑换历史记录 -->
      <el-tab-pane label="积分兑换历史记录" name="third">
        <span slot="label">
          <i class="el-icon-s-order"></i>&nbsp;积分兑换历史记录
        </span>
        敬请期待
      </el-tab-pane>
    </el-tabs>
    <!-- 添加会员 -->
    <addVip :isdialogFormVisible="isopen1" @change="handleChange" @addSuccess="handleSuccess" />
    <!-- 会员补卡 -->
    <reissueCard
      :isdialogFormVisible="isopen2"
      :customerInformation1="currentRowValue"
      @change="handleChange"
      @recSuccess="handleSuccess"
    />
    <!-- 编辑会员 -->
    <editorVip
      :isdialogFormVisible="isopen3"
      :customerInformation1="currentRowValue"
      @change="handleChange"
      @ediSuccess="handleSuccess"
    />
    <!-- 删除会员 -->
    <deleteVip
      :isdialogFormVisible="isopen4"
      :customerInformation1="currentRowValue"
      @change="handleChange"
      @delSuccess="handleSuccess"
    />
  </div>
</template>
<script>
import divider from "../componets/divider";
import addVip from "./componets/addVip";
import reissueCard from "./componets/reissueCard";
import editorVip from "./componets/editorVip";
import deleteVip from "./componets/deleteVip";
import applyVip from "./applyVip";
import axios from "axios";

export default {
  name: "vipManagement",
  components: {
    divider,
    addVip,
    reissueCard,
    editorVip,
    deleteVip,
    applyVip
  },
  data() {
    return {
      vips: [],
      state: "",
      timeout: null,
      aaa: false,
      isopen1: false,
      isopen2: false,
      isopen3: false,
      isopen4: false,
      currentRowValue: null,
      currentRow: null,
      activeName: "first",
      vipTopUpRecord: [],
      loadingTbDate: false,
      loadingTbDate2: false,
      localVips: null,
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
        this.currentChangePage(this.vips, currentPage);
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
      // this.loadingTbDate = true;
      // setTimeout(() => {
      //   this.loadingTbDate = false;
      // }, 1000);
    },
    handleClik1() {
      this.isopen1 = true;
    },
    handleClik2() {
      if (this.currentRow) {
        this.isopen2 = true;
      } else {
        this.$message({
          message: "请在表格中选择某项",
          type: "error",
          center: true,
          offset: "0"
        });
        console.log("空值，请在表格中选择某项");
      }
    },
    handleClik3() {
      this.isopen3 = true;
    },
    handleClik4() {
      this.isopen4 = true;
      // this.currentRowValue = this.currentRow;
    },
    handleSuccess() {
      setTimeout(() => {
        this.loadAll();
      }, 500);
    },
    handleCurrentChange(val) {
      // 点击了某项
      console.log(val.vipID);
      this.currentRow = val;
      this.currentRowValue = this.currentRow;
      axios
        .post("http://127.0.0.1:3000/vipTopUp/record", { vipID: val.vipID })
        .then(res => {
          if (res.data == false) {
            this.vipTopUpRecord = [];
            console.log("无记录，查找失败");
          } else {
            this.vipTopUpRecord = res.data;
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
          console.log(error);
        });
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
        .post("http://127.0.0.1:3000/vipManagement/loadAll")
        .then(res => {
          if (res.data == "集合为空") {
            setTimeout(() => {
              this.localVips = "";
              this.vips = "";
              this.currentChangePage(this.vips, this.currentPage1);
              this.loadingTbDate = false;
            }, 500);
            console.log("集合为空");
          } else {
            setTimeout(() => {
              this.localVips = res.data;
              this.vips = res.data;
              this.currentChangePage(this.vips, this.currentPage1);
              this.loadingTbDate = false;
            }, 500);
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
      console.log("加载后执行后续");
      this.loadingTbDate = true;
      var vips = this.localVips;
      var results = queryString
        ? vips.filter(this.createStateFilter(queryString))
        : vips;
      this.vips = results;
      this.currentChangePage(this.vips, this.currentPage1);
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
      this.vips = [item];
      this.currentChangePage(this.vips, 1);
      console.log(item);
      this.loadingTbDate = true;
      setTimeout(() => {
        this.loadingTbDate = false;
      }, 1000);
    },
    handleIconClick() {
      this.loadingTbDate = true;
      axios
        .post("http://127.0.0.1:3000/vipManagement/search", {
          state: this.state
        })
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
              message: "没有该会员的订单信息，请再次确认",
              type: "warning",
              center: true,
              offset: "0"
            });
            console.log("未找到");
          } else {
            this.vips = res.data;
            this.currentChangePage(this.vips, 1);
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
  mounted() {
    // 去服务端拿所有会员信息
    this.loadAll();
  },
  watch: {
    vipTopUpRecord: function() {
      this.loadingTbDate2 = true;
      setTimeout(() => {
        this.loadingTbDate2 = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.vipManagement-container {
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
