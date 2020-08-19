<template>
  <!-- 公告管理 -->
  <div class="notice-container">
    <divider title="公告管理" />
    <el-tabs type="border-card" v-model="activeName">
      <!-- 发送公告 -->
      <el-tab-pane name="first">
        <span slot="label">
          <i class="el-icon-circle-plus"></i>&nbsp;发送公告
        </span>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>请编写公告</span>
            <span style="float: right">{{ noticeForm.date | toDate }}</span>
          </div>
          <el-form ref="noticeForm" :model="noticeForm" :rules="noticeFormRules">
            <el-form-item prop="content">
              <el-input
                type="textarea"
                placeholder="请输入公告内容"
                name="content"
                v-model="noticeForm.content"
                :autosize="{ minRows: 5, maxRows: 5 }"
                maxlength="150"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button
            class="send"
            type="primary"
            round
            :loading="loading"
            @click.native.prevent="handleSend"
          >{{ btnText }}</el-button>
        </el-card>
      </el-tab-pane>
      <!-- 历史公告 -->
      <el-tab-pane label="历史公告" name="second">
        <span slot="label">
          <i class="el-icon-s-order"></i>&nbsp;历史公告
        </span>
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
            <el-table-column prop="operator" label="操作员" width="100px" sortable></el-table-column>
            <el-table-column prop="content" label="公告内容" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" fixed="right" width="140px">
              <template>
                <el-button size="mini" round type="danger" @click.native.capture="handleClik1">
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
      </el-tab-pane>
    </el-tabs>
    <delNotice
      :isdialogFormVisible="isopen1"
      :noticeInformation1="currentRowValue"
      @change="handleChange"
      @delSuccess="handleSuccess"
    />
  </div>
</template>


<script>
import divider from "../componets/divider";
import delNotice from "./delNotice";
import axios from "axios";
import * as cookieUtils from "@/utils/cookie";
import { validNotEmpty1 } from "@/utils/validate";

export default {
  name: "notice",
  components: {
    divider,
    delNotice
  },
  data() {
    const validateEmpty = (rule, value, callback) => {
      if (!validNotEmpty1(value)) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      rawList: [],
      currentPage1: 1, //默认显示页面为1
      pageSize: 6, //每页数据条数
      pageList: [],
      isopen1: false,
      currentRowValue: null,
      currentRow: null,
      loadingTbDate: false,
      activeName: "first",
      noticeForm: {
        operator: "",
        date: new Date(),
        content: ""
      },
      loading: false,
      btnText: "发送",
      noticeFormRules: {
        content: [{ required: true, trigger: "", validator: validateEmpty }]
      }
    };
  },
  methods: {
    getData() {
      this.loadingTbDate = true;
      axios
        .post("http://127.0.0.1:3000/getNotice")
        .then(res => {
          if (res.data == false) {
            setTimeout(() => {
              this.rawList = "";
              this.currentChangePage(this.rawList, this.currentPage1);
              this.loadingTbDate = false;
            }, 1000);
            console.log("获取系统公告失败");
          } else {
            setTimeout(() => {
              this.rawList = res.data;
              this.currentChangePage(this.rawList, this.currentPage1);
              this.loadingTbDate = false;
            }, 1000);
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
    },
    handleClik1() {
      this.isopen1 = true;
    },
    handleSuccess() {
      setTimeout(() => {
        this.getData();
      }, 500);
    },
    handleCurrentChange1(val) {
      this.currentRow = val;
      this.currentRowValue = this.currentRow;
    },
    initDate() {
      const d = new Date();
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    },
    handleSend() {
      this.$refs.noticeForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.btnText = "";
          this.noticeForm.date = this.initDate();
          axios
            .post("http://127.0.0.1:3000/notice", this.noticeForm)
            .then(res => {
              if (res.data == true) {
                this.$message({
                  message: "公告发送成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                  this.noticeForm.content = "";
                  this.$refs.noticeForm.resetFields();
                }, 500);
                this.getData();
                console.log("公告发送成功");
              } else {
                this.$message({
                  message: "公告发送失败，请稍后重试",
                  type: "warning",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading = false;
                  this.btnText = "确 定";
                }, 500);
                console.log("公告发送失败");
                return false;
              }
            })
            .catch(error => {
              this.$message({
                message: "服务器可能走神了！稍后尝试",
                type: "error",
                center: true,
                offset: "0"
              });
              this.loading = false;
              this.btnText = "确 定";
              console.log(error);
              return false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    let admin_id = cookieUtils.getCookie("adminid");
    axios
      .post("http://127.0.0.1:3000/layout/navbar/getUsername", {
        user_id: admin_id
      })
      .then(res => {
        if (res.data == false) {
          console.log("查找username失败");
        } else {
          this.noticeForm.operator = res.data.username;
          this.getData();
          console.log("查找username成功");
        }
      })
      .catch(error => {
        this.$message({
          message: "服务器可能走神了！稍后尝试1321",
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

.notice-container {
  .box-card {
    width: 500px;
    margin: 50px auto 30px;
    background-color: #eee;
    border-radius: 10px;
    box-shadow: 1px 1px 6px 2px #999;
    border: none;
    &:hover {
      box-shadow: 2px 2px 7px 3px #777;
    }
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