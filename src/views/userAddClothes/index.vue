<template>
  <div class="userAddClothes-container">
    <divider title="添加衣物" />
    <el-card class="box-card">
      <el-form ref="addClothesForm" :model="addClothesForm" :rules="addClothesRules">
        <div class="arrangement">
          <el-divider content-position="left">
            <i class="el-icon-caret-bottom"></i>添加衣物信息
          </el-divider>
          <el-form-item prop="transactionNumber">
            <label>交易单号:</label>
            <el-input
              v-model="addClothesForm.transactionNumber"
              name="transactionNumber"
              placeholder="WBXXXXXXXXXXX"
              maxlength="13"
              clearable
            ></el-input>
          </el-form-item>
          <!-- <clothingName /> -->
          <el-form-item prop="clothesName">
            <label>衣服名称:</label>
            <el-select
              v-model="addClothesForm.clothesName"
              name="clothesName"
              filterable
              placeholder="请选择衣物名称"
              @change="countPrice"
            >
              <el-option
                v-for="clothesName in clothesNames"
                :key="clothesName.value"
                :label="clothesName.label"
                :value="clothesName.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <laundryType /> -->
          <el-form-item prop="laundryType">
            <label>洗衣类型:</label>
            <el-select
              v-model="addClothesForm.laundryType"
              name="laundryType"
              filterable
              placeholder="请选择衣物名称"
              @change="countPrice"
            >
              <el-option
                v-for="laundryType in laundryTypes"
                :key="laundryType.value"
                :label="laundryType.label"
                :value="laundryType.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <clothingBrand /> -->
          <el-form-item prop="clothingBrand">
            <label>衣服品牌:</label>
            <el-select
              v-model="addClothesForm.clothingBrand"
              name="clothingBrand"
              filterable
              placeholder="请选择衣物名称"
            >
              <el-option
                v-for="clothingBrand in clothingBrands"
                :key="clothingBrand.value"
                :label="clothingBrand.label"
                :value="clothingBrand.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="addedDate">
            <label>添加日期:</label>
            <el-date-picker
              v-model="addClothesForm.addedDate"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <!-- <selectDate /> -->
          <el-form-item prop="collectionDate">
            <label>领取日期:</label>
            <el-date-picker
              v-model="addClothesForm.collectionDate"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <!-- <chooseColor /> -->
          <el-form-item prop="clothingColor">
            <label>衣服颜色:</label>
            <el-color-picker
              v-model="addClothesForm.clothingColor"
              show-alpha
              :predefine="predefineColors"
              size="small"
            ></el-color-picker>
          </el-form-item>
          <!-- <clothingAccessories /> -->
          <el-form-item prop="clothingAccessories">
            <label>衣物附件:</label>
            <el-checkbox-group v-model="addClothesForm.clothingAccessories" size="small">
              <el-checkbox-button
                v-for="clothingAccessories in clothingAccessoriess"
                :label="clothingAccessories"
                :key="clothingAccessories"
              >{{clothingAccessories}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <!-- <clothingBlemishes /> -->
          <el-form-item prop="clothingBlemishes">
            <label>衣服瑕疵:</label>
            <el-checkbox-group v-model="addClothesForm.clothingBlemishes" size="small">
              <el-checkbox-button
                v-for="clothingBlemishes in clothingBlemishess"
                :label="clothingBlemishes"
                :key="clothingBlemishes"
              >{{clothingBlemishes}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <label>是否付费:</label>
            <el-switch
              v-model="addClothesForm.ispaid"
              active-value="是"
              inactive-value="否"
              :disabled="true"
            ></el-switch>
          </el-form-item>

          <el-form-item prop="paymentMethod" v-show="payInput">
            <label>付款方式:</label>
            <el-select
              v-model="addClothesForm.paymentMethod"
              name="paymentMethod"
              filterable
              placeholder="请选择付款方式"
              :disabled="false"
            >
              <el-option
                v-for="paymentMethod in paymentMethods"
                :key="paymentMethod.value"
                :label="paymentMethod.label"
                :value="paymentMethod.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="address" class="textarea">
            <label>取衣地址:</label>
            <el-input
              type="textarea"
              placeholder="请填写详细的取衣地址，我们将上门取衣，超过3公里我们将撤销单子"
              name="address"
              v-model="addClothesForm.address"
              :autosize="{ minRows: 1, maxRows: 3 }"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>

          <!-- <note /> -->
          <el-form-item prop="note" class="textarea">
            <label>备注信息:</label>
            <el-input
              type="textarea"
              placeholder="请输入备注信息"
              name="note"
              v-model="addClothesForm.note"
              :autosize="{ minRows: 1, maxRows: 3 }"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>

          <!-- 洗衣价格信息 -->
          <el-divider content-position="left">
            <i class="el-icon-caret-bottom"></i>洗衣价格信息
          </el-divider>
          <el-form-item prop="originalPrice">
            <el-input
              placeholder="请输入原价"
              suffix-icon="el-icon-coin"
              v-model="addClothesForm.originalPrice"
              clearable
              :disabled="true"
            >
              <template slot="prepend">原价(元)</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="discount">
            <el-input
              placeholder="请输入折扣"
              suffix-icon="el-icon-document-delete"
              v-model="addClothesForm.discount"
              clearable
              :disabled="true"
            >
              <template slot="prepend">衣物折扣(&lt;=1)</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="discountPrice">
            <el-input
              placeholder="折后价"
              suffix-icon="el-icon-coin"
              v-model="addClothesForm.discountPrice"
              clearable
              :disabled="true"
            >
              <template slot="prepend">折后价(元)</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="amountReceivable">
            <el-input
              placeholder="请输入应收金额"
              suffix-icon="el-icon-coin"
              v-model="addClothesForm.amountReceivable"
              clearable
              :disabled="true"
            >
              <template slot="prepend">应收金额(元)</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="paidInAmount">
            <el-input
              placeholder="请输入实收金额"
              suffix-icon="el-icon-coin"
              v-model="addClothesForm.paidInAmount"
              @keyup.enter.native="handleAddClothes"
              clearable
              :disabled="true"
            >
              <template slot="prepend">实收金额(元)</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="maLingAmount">
            <el-input
              placeholder="请输入找零金额"
              suffix-icon="el-icon-coin"
              v-model="addClothesForm.maLingAmount"
              @keyup.enter.native="handleAddClothes"
              clearable
              :disabled="true"
            >
              <template slot="prepend">找零金额(元)</template>
            </el-input>
          </el-form-item>
          <el-divider content-position="left">
            <i class="el-icon-caret-bottom"></i>订单信息
          </el-divider>
          <el-table :data="[addClothesForm]" stripe style="width: 100%" size="mini">
            <el-table-column prop="transactionNumber" label="交易单号" min-width="120px"></el-table-column>
            <el-table-column prop="clothesName" label="衣服名称"></el-table-column>
            <el-table-column prop="laundryType" label="洗衣类型"></el-table-column>
            <el-table-column prop="clothingBrand" label="衣服品牌"></el-table-column>
            <el-table-column prop="ispaid" label="是否付费"></el-table-column>
            <el-table-column prop="paymentMethod" label="付款方式"></el-table-column>
            <el-table-column prop="addedDate" label="添加日期"></el-table-column>
            <el-table-column prop="collectionDate" label="取衣日期"></el-table-column>
            <el-table-column prop="clothingColor" label="衣服颜色"></el-table-column>
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
          </el-table>
        </div>
        <div class="button">
          <el-button
            type="warning"
            round
            @click.native.stop="handleReset"
            :loading="loading1"
          >{{ btnText1 }}</el-button>
          <el-button
            type="primary"
            round
            @click.native.stop="handleApplyAddClothes"
            :loading="loading2"
          >{{ btnText2 }}</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import divider from "../componets/divider";
import {
  validVipID,
  validNotEmpty,
  validNotEmpty1,
  validNumber,
  validDiscount,
  validPaidInAmount
} from "@/utils/validate";
import { number_format } from "@/utils/number_format";
import * as cookieUtils from "@/utils/cookie";
import axios from "axios";

export default {
  name: "userAddClothes",
  components: {
    divider
  },
  props: {
    vipIschoose: {
      type: Boolean
    }
  },
  data() {
    const validateTransactionNumber = (rule, value, callback) => {
      if (!validVipID(value)) {
        callback(new Error("交易单号不能为空，且不能包含空格"));
      } else {
        axios
          .post(
            "http://127.0.0.1:3000/collectionClothings/addClothes/validationOrder",
            {
              transactionNumber: value
            }
          )
          .then(res => {
            if (res.data == false) {
              callback(new Error("该订单号已存在"));
              console.log("该订单号已存在");
            } else {
              callback();
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
      }
    };
    const validateEmpty = (rule, value, callback) => {
      if (!validNotEmpty(value)) {
        callback(new Error("不能为空，且不能包含空格"));
      } else {
        callback();
      }
    };
    const validateEmpty1 = (rule, value, callback) => {
      if (!validNotEmpty1(value)) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    // const validateNumber = (rule, value, callback) => {
    //   if (!validNumber(value)) {
    //     callback(new Error("只能是整数或者小数（请保留两位小数）"));
    //   } else {
    //     callback();
    //   }
    // };
    const validateNumber = (rule, value, callback) => {
      if (!validNumber(value)) {
        callback(new Error("只能是整数或者小数（请保留两位小数）"));
      } else {
        callback();
      }
    };
    const validateDiscount = (rule, value, callback) => {
      if (!validDiscount(value)) {
        callback(new Error("折扣只能是0.1~1，至多两位小数"));
      } else {
        callback();
      }
    };
    const validatePaidInAmount = (rule, value, callback) => {
      if (!validPaidInAmount(value)) {
        this.addClothesForm.maLingAmount = "0.00";
        callback(new Error("只能是整数或者小数（请保留两位小数）"));
      } else if (
        Number(this.addClothesForm.paidInAmount) <
          Number(this.addClothesForm.amountReceivable) &&
        this.addClothesForm.ispaid == "是"
      ) {
        this.addClothesForm.maLingAmount = "0.00";
        callback(new Error("实收金额不能小于应收金额，谢谢"));
      } else {
        callback();
      }
    };
    return {
      loading1: false,
      loading2: false,
      btnText1: "重 置",
      btnText2: "确 定",
      vipInfo: null,
      addClothesForm: {
        transactionNumber: "",
        clothesName: "",
        laundryType: "",
        clothingBrand: "",
        paymentMethod: "微信",
        addedDate: "",
        collectionDate: "",
        clothingColor: "#666",
        clothingAccessories: [],
        clothingBlemishes: [],
        originalPrice: "",
        discount: "1",
        discountPrice: "",
        amountReceivable: "",
        paidInAmount: "",
        maLingAmount: "",
        address: "",
        note: "",
        vipID: "", //加上用户的信息
        vipName: "",
        vipState: "",
        vipLevel: "",
        contact: "",
        gender: "",
        ispaid: "是", //状态信息
        whetherTake: "否",
        rewashes: "否",
        salesReturn: "否"
      },
      userInformation: null,
      clothesNames: [],
      laundryTypes: [],
      clothingBrands: [],
      paymentMethods: [],
      pickerOptions: {
        // 禁用日期，今天前
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "后天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit("pick", date);
            }
          },
          {
            text: "大后天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      predefineColors: [
        "#aaaaaa",
        "#dddddd",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#fff",
        "#000"
      ],
      clothingAccessoriess: [],
      clothingBlemishess: [],
      addClothesRules: {
        transactionNumber: [
          { required: true, trigger: "", validator: validateTransactionNumber }
        ],
        addedDate: [{ required: true, trigger: "", validator: validateEmpty }],
        collectionDate: [
          { required: true, trigger: "", validator: validateEmpty }
        ],
        originalPrice: [
          { required: true, trigger: "", validator: validateNumber }
        ],
        discount: [
          { required: true, trigger: "", validator: validateDiscount }
        ],
        discountPrice: [
          { required: true, trigger: "", validator: validateNumber }
        ],
        amountReceivable: [
          { required: true, trigger: "", validator: validateNumber }
        ],
        paidInAmount: [
          { required: true, trigger: "", validator: validatePaidInAmount }
        ],
        address: [{ required: true, trigger: "", validator: validateEmpty1 }]
      }
    };
  },
  methods: {
    countPrice() {
      axios
        .post("http://127.0.0.1:3000/clothesPrice/onePrice", {
          clothesName: this.addClothesForm.clothesName,
          laundryType: this.addClothesForm.laundryType
        })
        .then(res => {
          if (res.data == false) {
            if (
              this.addClothesForm.clothesName == "" ||
              this.addClothesForm.laundryType == ""
            ) {
              console.log();
            } else {
              this.$message({
                message: "还未有此洗衣方式，请更换",
                type: "error",
                center: true,
                offset: "0"
              });
            }
          } else {
            this.addClothesForm.originalPrice = res.data[0].originalPrice;
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
          return false;
        });
    },
    findVipInfo() {
      axios
        .post("http://127.0.0.1:3000/getVipInfo", {
          vipID: this.userInformation.vipID
        })
        .then(res => {
          console.log(res.data);
          if (res.data == false) {
            console.log("没有该会员信息");
          } else {
            this.vipInfo = res.data;
            this.addClothesForm.vipID = this.vipInfo.vipID;
            this.addClothesForm.discount = this.vipInfo.vipDiscount;
            this.addClothesForm.vipName = this.vipInfo.vipName;
            this.addClothesForm.vipState = this.vipInfo.vipState;
            this.addClothesForm.vipLevel = this.vipInfo.vipLevel;
            this.addClothesForm.contact = this.vipInfo.contact;
            this.addClothesForm.gender = this.vipInfo.gender;
            console.log("查找会员信息成功");
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
    handleReset() {
      this.loading1 = true;
      this.btnText1 = "";
      setTimeout(() => {
        this.loading1 = false;
        this.btnText1 = "重 置";
        this.$refs.addClothesForm.resetFields();
        this.addClothesForm.discount = this.vipInfo.vipDiscount;
      }, 300);
    },
    handleApplyAddClothes() {
      this.$refs.addClothesForm.validate(valid => {
        if (valid) {
          if (this.addClothesForm.vipID == "") {
            alert("VIPID为空");
          } else if (
            this.addClothesForm.paymentMethod == "卡内余额" &&
            Number(this.vipInfo.balance) <=
              Number(this.addClothesForm.amountReceivable)
            // 判断余额是否充足
          ) {
            this.$message({
              message: "卡内余额不足，请充值",
              type: "error",
              center: true,
              offset: "0"
            });
          } else {
            this.loading2 = true;
            this.btnText2 = "";
            axios
              .post(
                "http://127.0.0.1:3000/collectionClothings/ApplyAddClothes",
                this.addClothesForm
              )
              .then(res => {
                if (res.data == false) {
                  this.$message({
                    message: "添加衣物订单成功",
                    type: "success",
                    center: true,
                    offset: "0"
                  });
                  setTimeout(() => {
                    this.loading2 = false;
                    this.btnText2 = "确 定";
                    this.$refs.addClothesForm.resetFields();
                  }, 500);
                  setTimeout(() => {
                    this.$message({
                      message: "会员卡余额等信息更新失败",
                      type: "error",
                      center: true,
                      offset: "0"
                    });
                  }, 4000);
                } else if (res.data == "no") {
                  setTimeout(() => {
                    this.$message({
                      message: "添加衣物订单失败，请稍后尝试",
                      type: "error",
                      center: true,
                      offset: "0"
                    });
                  }, 4000);
                  this.loading2 = false;
                  this.btnText2 = "确 定";
                  console.log("添加衣物订单失败");
                  return false;
                } else {
                  this.$message({
                    message: "添加衣物订单成功",
                    type: "success",
                    center: true,
                    offset: "0"
                  });
                  setTimeout(() => {
                    this.loading2 = false;
                    this.btnText2 = "确 定";
                    this.$refs.addClothesForm.resetFields();
                    this.addClothesForm.discount = this.vipInfo.vipDiscount;
                  }, 500);
                  setTimeout(() => {
                    this.$message({
                      message: "会员卡余额更新成功,余额为：" + res.data,
                      type: "success",
                      center: true,
                      offset: "0"
                    });
                    this.vipTopUpForm.balance = res.data;
                  }, 4000);
                  this.$emit("orderUpdate");
                  console.log("添加衣物订单成功");
                }
              })
              .catch(error => {
                this.$message({
                  message: "服务器可能走神了！稍后尝试",
                  type: "error",
                  center: true,
                  offset: "0"
                });
                this.loading2 = false;
                this.btnText2 = "确 定";
                console.log(error);
                return false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    vipIschoose: function() {
      console.log(this.$store.state.user.chooseVip);
    },
    payInput: function() {
      // 是否付费开关的状态决定付费方式是否为空
      if (this.payInput == false) {
        this.addClothesForm.paymentMethod = "";
      } else {
        this.addClothesForm.paymentMethod = "卡内余额";
      }
    },
    changeDiscountPrice: function() {
      this.addClothesForm.discountPrice = number_format(
        this.addClothesForm.originalPrice * this.addClothesForm.discount,
        2,
        ".",
        ",",
        "round"
      );
      this.addClothesForm.amountReceivable = number_format(
        this.addClothesForm.originalPrice * this.addClothesForm.discount,
        2,
        ".",
        ",",
        "round"
      );
      this.addClothesForm.paidInAmount = number_format(
        this.addClothesForm.originalPrice * this.addClothesForm.discount,
        2,
        ".",
        ",",
        "round"
      );
    },
    changeMaLingAmount: function() {
      if (this.addClothesForm.ispaid == "是") {
        this.addClothesForm.maLingAmount = number_format(
          this.addClothesForm.paidInAmount -
            this.addClothesForm.amountReceivable,
          2,
          ".",
          ",",
          "round"
        );
      }
    }
  },
  computed: {
    payInput: function() {
      return this.addClothesForm.ispaid == "否" ? false : true;
    },
    changeDiscountPrice: function() {
      return this.addClothesForm.originalPrice * this.addClothesForm.discount;
    },
    changeMaLingAmount: function() {
      return (
        this.addClothesForm.amountReceivable - this.addClothesForm.paidInAmount
      );
    }
  },
  mounted() {
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
          if (res.data.vipID == "HY00000000000") {
            this.$message({
              message: "您还不是会员，可以去申请会员，享有一定的折扣",
              type: "warning",
              center: true,
              offset: "0"
            });
            this.paymentMethods = [
              { value: "微信", label: "微信" },
              { value: "支付宝", label: "支付宝" }
            ];
          } else {
            this.paymentMethods = [
              { value: "卡内余额", label: "卡内余额" },
              { value: "微信", label: "微信" },
              { value: "支付宝", label: "支付宝" }
            ];
          }
          this.findVipInfo();
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
    // 获取衣服名称信息
    axios
      .post("http://127.0.0.1:3000/clothesName/loadAll")
      .then(res => {
        if (res.data == false) {
          this.$message({
            message: "获取衣服名称信息失败",
            type: "error",
            center: true,
            offset: "0"
          });
        } else {
          this.clothesNames = res.data;
          for (let item in res.data) {
            this.clothesNames[item].value = res.data[item].type;
            this.clothesNames[item].label = res.data[item].type;
          }
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
    // 获取洗衣类型信息
    axios
      .post("http://127.0.0.1:3000/laundryType/loadAll")
      .then(res => {
        if (res.data == false) {
          this.$message({
            message: "获取洗衣类型信息失败",
            type: "error",
            center: true,
            offset: "0"
          });
        } else {
          this.laundryTypes = res.data;
          for (let item in res.data) {
            this.laundryTypes[item].value = res.data[item].type;
            this.laundryTypes[item].label = res.data[item].type;
          }
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
    // 获取衣服品牌信息
    axios
      .post("http://127.0.0.1:3000/clothingBrand/loadAll")
      .then(res => {
        if (res.data == false) {
          this.$message({
            message: "获取衣服品牌信息失败",
            type: "error",
            center: true,
            offset: "0"
          });
        } else {
          this.clothingBrands = res.data;
          for (let item in res.data) {
            this.clothingBrands[item].value = res.data[item].type;
            this.clothingBrands[item].label = res.data[item].type;
          }
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
    // 获取衣服附件信息
    this.$nextTick(function() {});
    axios
      .post("http://127.0.0.1:3000/clothingAccessories/loadAll")
      .then(res => {
        if (res.data == false) {
          this.$message({
            message: "获取衣服附件信息失败",
            type: "error",
            center: true,
            offset: "0"
          });
        } else {
          for (let item in res.data) {
            this.clothingAccessoriess[item] = res.data[item].type;
            this.clothingAccessoriess[item] = res.data[item].type;
          }
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
    // 获取衣服瑕疵信息
    axios
      .post("http://127.0.0.1:3000/clothingBlemishes/loadAll")
      .then(res => {
        if (res.data == false) {
          this.$message({
            message: "获取衣服瑕疵信息失败",
            type: "error",
            center: true,
            offset: "0"
          });
        } else {
          for (let item in res.data) {
            this.clothingBlemishess[item] = res.data[item].type;
            this.clothingBlemishess[item] = res.data[item].type;
          }
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
    // 获取付款方式信息
    // axios
    //   .post("http://127.0.0.1:3000/paymentMethods/loadAll")
    //   .then(res => {
    //     if (res.data == false) {
    //       this.$message({
    //         message: "获取付款方式信息失败",
    //         type: "error",
    //         center: true,
    //         offset: "0"
    //       });
    //     } else {
    //       this.paymentMethods = res.data;
    //       for (let item in res.data) {
    //         this.paymentMethods[item].value = res.data[item].type;
    //         this.paymentMethods[item].label = res.data[item].type;
    //       }
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
    //     return false;
    //   });
  }
};
</script>


<style lang="scss">
@import "~@/styles/mixin.scss";

.userAddClothes-container {
  .arrangement {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    & .el-form-item {
      display: inline-block;
      padding: 7px;
      width: 350px;
      margin: 0;
      .el-form-item__content {
        label {
          color: #555;
          font-size: 14px;
          margin-right: 10px;
        }
        .el-input {
          width: 160px;
          margin: 0;
          .el-input__inner {
          }
        }
        .el-select {
        }
        .el-color-picker {
          display: inline-block;
          vertical-align: -12px;
          .el-color-picker__trigger {
            width: 160px;
            height: 35px;
          }
        }
        .el-checkbox-group {
          display: inline-block;
          height: 30px;
          .el-checkbox-button {
            margin: 0;
            height: 30px;
            line-height: 40px;
            .el-checkbox-button__inner {
              height: 30px;
            }
          }
        }
        .el-input-group {
          .el-input-group__prepend {
          }
          .el-input__inner {
            width: 130px;
          }
        }
        .el-form-item__error {
          font-size: 12px;
          padding: 0;
        }
      }
    }
    .textarea {
      width: 100%;
      .el-textarea__inner {
        margin-top: 10px;
      }
    }
  }
  .button {
    margin: 20px 0 0 0;
    text-align: center;
    .el-icon-loading {
      margin-left: 6.5px;
      margin-right: 6.5px;
    }
    .el-button {
      box-shadow: 1px 1px 6px 2px #999;
      &:hover {
        box-shadow: 2px 2px 7px 3px #777;
      }
    }
  }
}
</style>