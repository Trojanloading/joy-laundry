<template>
  <!-- 编辑订单记录 -->
  <div class="editorOrder-container">
    <!-- 是否销毁数据 destroy-on-close -->
    <el-dialog title="编辑订单" top="5vh" :visible.sync="dialogFormVisible">
      <!-- 会员信息 -->
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>
        订单信息
      </el-divider>
      <el-form ref="editorOrderForm" :model="editorOrderForm" :rules="editorOrderRules">
        <div class="arrangement">
          <el-form-item prop="transactionNumber">
            <label>交易单号:</label>
            <el-input
              v-model="editorOrderForm.transactionNumber"
              name="transactionNumber"
              placeholder="请输入会员卡号"
              maxlength="13"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item prop="clothesName">
            <label>衣服名称:</label>
            <el-select
              v-model="editorOrderForm.clothesName"
              name="clothesName"
              filterable
              placeholder="请选择衣物名称"
            >
              <el-option
                v-for="clothesName in clothesNames"
                :key="clothesName.value"
                :label="clothesName.label"
                :value="clothesName.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="laundryType">
            <label>洗衣类型:</label>
            <el-select
              v-model="editorOrderForm.laundryType"
              name="laundryType"
              filterable
              placeholder="请选择衣物名称"
            >
              <el-option
                v-for="laundryType in laundryTypes"
                :key="laundryType.value"
                :label="laundryType.label"
                :value="laundryType.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="clothingBrand">
            <label>衣服品牌:</label>
            <el-select
              v-model="editorOrderForm.clothingBrand"
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
              v-model="editorOrderForm.addedDate"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="collectionDate">
            <label>领取日期:</label>
            <el-date-picker
              v-model="editorOrderForm.collectionDate"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="clothingColor">
            <label>衣服颜色:</label>
            <el-color-picker
              v-model="editorOrderForm.clothingColor"
              show-alpha
              :predefine="predefineColors"
              size="small"
            ></el-color-picker>
          </el-form-item>
          <el-form-item prop="clothingAccessories">
            <label>衣物附件:</label>
            <el-checkbox-group v-model="editorOrderForm.clothingAccessories" size="small">
              <el-checkbox-button
                v-for="clothingAccessories in clothingAccessoriess"
                :label="clothingAccessories"
                :key="clothingAccessories"
              >{{clothingAccessories}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="clothingBlemishes">
            <label>衣服瑕疵:</label>
            <el-checkbox-group v-model="editorOrderForm.clothingBlemishes" size="small">
              <el-checkbox-button
                v-for="clothingBlemishes in clothingBlemishess"
                :label="clothingBlemishes"
                :key="clothingBlemishes"
              >{{clothingBlemishes}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <label>是否付费:</label>
            {{ this.editorOrderForm.ispaid }}
          </el-form-item>
          <el-form-item v-show="this.editorOrderForm.ispaid=='是'?true:false">
            <label>付款方式:</label>
            {{ this.editorOrderForm.paymentMethod }}
          </el-form-item>
          <el-form-item prop="note" class="textarea">
            <label>备注信息:</label>
            <el-input
              type="textarea"
              placeholder="请输入备注信息"
              name="note"
              v-model="editorOrderForm.note"
              :autosize="{ minRows: 1, maxRows: 3 }"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" round @click.native.stop="handleClose">取 消</el-button>
        <el-button
          type="warning"
          round
          :loading="loading1"
          @click.native.stop="handleReset"
        >{{ btnText1 }}</el-button>
        <el-button
          type="primary"
          round
          :loading="loading2"
          @click.native.prevent="handleEditorOrder"
        >{{ btnText2 }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { validNotEmpty } from "@/utils/validate";
import axios from "axios";

export default {
  name: "editorOrder",
  props: {
    isdialogFormVisible: {
      type: Boolean
    },
    orderInformation1: {
      type: Object
    }
  },
  data() {
    const validateEmpty = (rule, value, callback) => {
      if (!validNotEmpty(value)) {
        callback(new Error("不能为空，且不能包含空格"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      editorOrderForm: {
        transactionNumber: "",
        clothesName: "",
        laundryType: "",
        clothingBrand: "",
        addedDate: "",
        collectionDate: "",
        clothingColor: "",
        clothingAccessories: [],
        clothingBlemishes: [],
        ispaid: "",
        paymentMethod: "",
        note: ""
      },
      clothesNames: [
        {
          value: "T恤(夏季)",
          label: "T恤(夏季)"
        },
        {
          value: "上衣",
          label: "上衣"
        },
        {
          value: "呢子外衣",
          label: "呢子外衣"
        },
        {
          value: "呢子裙",
          label: "呢子裙"
        },
        {
          value: "毛裤",
          label: "毛裤"
        },
        {
          value: "短裙",
          label: "短裙"
        },
        {
          value: "围巾",
          label: "围巾"
        },
        {
          value: "真丝衬衫",
          label: "真丝衬衫"
        },
        {
          value: "短款羽绒服",
          label: "短款羽绒服"
        }
      ],
      laundryTypes: [
        {
          value: "干洗",
          label: "干洗"
        },
        {
          value: "水洗",
          label: "水洗"
        },
        {
          value: "皮衣",
          label: "皮衣"
        },
        {
          value: "织补",
          label: "织补"
        },
        {
          value: "单烫",
          label: "单烫"
        },
        {
          value: "附加服务",
          label: "附加服务"
        }
      ],
      clothingBrands: [
        {
          value: "七匹狼",
          label: "七匹狼"
        },
        {
          value: "安踏",
          label: "安踏"
        },
        {
          value: "A21",
          label: "A21"
        },
        {
          value: "李宁",
          label: "李宁"
        },
        {
          value: "森马",
          label: "森马"
        },
        {
          value: "优衣库",
          label: "优衣库"
        },
        {
          value: "H&M",
          label: "H&M"
        },
        {
          value: "Beaster",
          label: "Beaster"
        },
        {
          value: "美特斯邦威",
          label: "美特斯邦威"
        }
      ],
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
      clothingAccessoriess: ["帽子", "围巾", "腰带", "衣袖"],
      clothingBlemishess: ["有补丁", "有破损"],
      editorOrderRules: {
        addedDate: [{ required: true, trigger: "", validator: validateEmpty }],
        collectionDate: [
          { required: true, trigger: "", validator: validateEmpty }
        ]
      },
      loading1: false,
      loading2: false,
      btnText1: "重 置",
      btnText2: "确 定",
      orderInformation: null
    };
  },
  watch: {
    isdialogFormVisible: function(newVal) {
      this.dialogFormVisible = newVal;
    },
    dialogFormVisible: function() {
      if (!this.dialogFormVisible) this.$emit("change");
    },
    orderInformation1: function(newVal) {
      console.log("某订单传进来编辑了");
      this.orderInformation = newVal;
      // this.editorOrderForm = newVal;
      this.editorOrderForm.transactionNumber = newVal.transactionNumber;
      this.editorOrderForm.clothesName = newVal.clothesName;
      this.editorOrderForm.laundryType = newVal.laundryType;
      this.editorOrderForm.clothingBrand = newVal.clothingBrand;
      this.editorOrderForm.addedDate = newVal.addedDate;
      this.editorOrderForm.collectionDate = newVal.collectionDate;
      this.editorOrderForm.clothingColor = newVal.clothingColor;
      this.editorOrderForm.clothingAccessories = newVal.clothingAccessories;
      this.editorOrderForm.clothingBlemishes = newVal.clothingBlemishes;
      this.editorOrderForm.ispaid = newVal.ispaid;
      this.editorOrderForm.paymentMethod = newVal.paymentMethod;
      this.editorOrderForm.note = newVal.note;
    }
  },
  methods: {
    messageOfRegister(type, title, time, showClose) {
      // 通知弹窗
      this.$notify({
        title: title,
        message: "",
        type: type,
        duration: time,
        showClose: showClose
      });
    },
    handleClose() {
      this.$refs.editorOrderForm.resetFields();
      this.dialogFormVisible = false;
    },
    handleReset() {
      this.loading1 = true;
      this.btnText1 = "";
      setTimeout(() => {
        this.loading1 = false;
        this.btnText1 = "重 置";
        this.$refs.editorOrderForm.resetFields();
      }, 300);
    },
    handleEditorOrder() {
      this.$refs.editorOrderForm.validate(valid => {
        if (valid) {
          this.loading2 = true;
          this.btnText2 = "";
          axios
            .post(
              "http://127.0.0.1:3000/collectionClothings/laundryManagement/editorOrder",
              this.editorOrderForm
            )
            .then(res => {
              console.log(res.data);
              if (res.data == true) {
                this.$message({
                  message: "订单信息修改成功",
                  type: "success",
                  center: true,
                  offset: "0"
                });
                setTimeout(() => {
                  this.loading2 = false;
                  this.btnText2 = "确 定";
                  this.$refs.editorOrderForm.resetFields();
                  this.dialogFormVisible = false;
                }, 500);
                this.$emit("ediSuccess");
                console.log("订单信息修改成功");
              } else {
                this.loading2 = false;
                this.btnText2 = "确 定";
                console.log("订单信息修改失败");
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
              this.loading2 = false;
              this.btnText2 = "确 定";
              console.log(error);
              return false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.editorOrder-container {
  text-align: left;
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
  .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog {
      // margin-top: 60px !important;
      min-width: 530px;
      width: 60%;
      border-radius: 10px;
      .el-dialog__header {
        font-weight: bold;
        color: #555;
        background-color: #78a17b77;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .el-dialog__body {
        padding: 0 15px 0 15px;
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
                // vertical-align: 5px;
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
      }
      .el-dialog__footer {
        .el-icon-loading {
          margin-left: 6.5px;
          margin-right: 6.5px;
        }
      }
    }
  }
}
.v-modal {
  z-index: -1 !important;
}
</style>