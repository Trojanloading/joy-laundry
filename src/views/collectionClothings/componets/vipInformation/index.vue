<template>
  <!-- 会员信息 -->
  <div class="vipInformation-container">
    <el-card class="box-card">
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
      <el-table
        :data="tableData"
        v-loading="loadingTbDate"
        size="mini"
        style="width: 100%"
        highlight-current-row
      >
        <el-table-column prop="vipID" label="会员卡号" min-width="120px" fixed="left"></el-table-column>
        <el-table-column prop="vipName" label="会员名称" min-width="100px"></el-table-column>
        <el-table-column prop="vipState" label="会员卡状态" min-width="100px"></el-table-column>
        <el-table-column prop="vipLevel" label="会员级别"></el-table-column>
        <el-table-column prop="vipDiscount" label="会员折扣"></el-table-column>
        <el-table-column prop="balance" label="卡内余额"></el-table-column>
        <el-table-column prop="totalConsumption" label="消费总额"></el-table-column>
        <el-table-column prop="numberOfConsumption" label="消费次数"></el-table-column>
        <el-table-column prop="contact" label="联系方式" min-width="100px"></el-table-column>
        <el-table-column prop="vipIntegral" label="客户积分"></el-table-column>
        <el-table-column prop="gender" label="性别"></el-table-column>
        <el-table-column prop="registrationDate" label="注册日期" min-width="200px"></el-table-column>
        <el-table-column prop="vipPassword" label="会员密码"></el-table-column>
        <el-table-column prop="note" label="备注" min-width="200px"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "vipInformation",
  props: {
    orderUpdate: {
      type: Boolean
    }
  },
  data() {
    return {
      vips: [],
      state: "",
      timeout: null,
      tableData: [],
      loadingTbDate: false
    };
  },
  methods: {
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
              message: "没有该会员，请再次确认",
              type: "warning",
              center: true,
              offset: "0"
            });
            console.log("未找到");
          } else {
            this.tableData = res.data;
            this.$store.commit("user/SET_CHOOSEVIP", res.data[0]);
            this.$emit("ischoose");
            // console.log(this.$store.state.user.chooseVip);
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
    },
    loadAll() {
      // 加载全部会员信息
      axios
        .post("http://127.0.0.1:3000/vipManagement/loadAll")
        .then(res => {
          if (res.data == "集合为空") {
            console.log("集合为空");
          } else {
            console.log(res.data);
            this.vips = res.data;
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
      var vips = this.vips;
      var results = queryString
        ? vips.filter(this.createStateFilter(queryString))
        : vips;

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
      this.loadingTbDate = true;
      setTimeout(() => {
        this.loadingTbDate = false;
      }, 1000);
      this.state = item.vipName;
      this.tableData = [item];
      this.$store.commit("user/SET_CHOOSEVIP", item);
      // 触发一个事件，让添加衣物拿到信息
      this.$emit("ischoose");
      // console.log(this.$store.state.user.chooseVip);
    }
  },
  mounted() {
    // 去服务端拿所有会员信息
    this.loadAll();
  },
  watch: {
    orderUpdate: function() {
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
              message: "没有该会员，请再次确认",
              type: "warning",
              center: true,
              offset: "0"
            });
            console.log("未找到");
          } else {
            this.tableData = res.data;
            this.$store.commit("user/SET_CHOOSEVIP", res.data[0]);
            // console.log(this.$store.state.user.chooseVip);
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
  }
};
</script>

<style lang="scss">
.vipInformation-container {
  margin: 0 0 15px 0;
  text-align: center;
  .el-card__body {
    padding: 15px;
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
      white-space: nowrap;
    }
    .el-button {
      padding: 7px;
    }
  }
  .el-autocomplete {
    width: 300px;
    margin: 5px 0 5px 0;
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