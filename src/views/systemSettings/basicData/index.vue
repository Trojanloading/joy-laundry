<template>
  <!-- 基础资料设置 -->
  <div class="basicData-container">
    <divider title="基础资料设置" />
    <el-tabs type="border-card" v-model="activeName">
      <!-- 衣服名称设置 -->
      <el-tab-pane name="first">
        <span slot="label">
          <i class="el-icon-s-shop"></i>&nbsp;衣服名称设置
        </span>
        <!-- 衣服名称设置 -->
        <clothesName />
      </el-tab-pane>

      <!-- 衣服附件设置 -->
      <el-tab-pane name="second">
        <span slot="label">
          <i class="el-icon-s-shop"></i>&nbsp;衣服附件设置
        </span>
        <!-- 衣服附件设置 -->
        <clothingAccessories />
      </el-tab-pane>

      <!-- 服务类型设置 -->
      <el-tab-pane name="third">
        <span slot="label">
          <i class="el-icon-s-order"></i>&nbsp;服务类型设置
        </span>
        <!-- 服务类型设置 -->
        <laundryType />
      </el-tab-pane>

      <!-- 衣服品牌设置 -->
      <el-tab-pane name="fourth">
        <span slot="label">
          <i class="el-icon-s-ticket"></i>&nbsp;衣服品牌设置
        </span>
        <!-- 衣服品牌设置 -->
        <clothingBrand />
      </el-tab-pane>

      <!-- 衣服瑕疵设置 -->
      <el-tab-pane name="fifth">
        <span slot="label">
          <i class="el-icon-s-open"></i>&nbsp;衣服瑕疵设置
        </span>
        <!-- 衣服瑕疵设置 -->
        <clothingBlemishes />
      </el-tab-pane>

      <!-- 付款方式设置 -->
      <el-tab-pane name="sixth">
        <span slot="label">
          <i class="el-icon-s-open"></i>&nbsp;付款方式设置
        </span>
        <!-- 付款方式设置 -->
        <paymentMethods />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import divider from "@/views/componets/divider";
import clothesName from "./clothesName/index";
import clothingAccessories from "./clothingAccessories/index";
import laundryType from "./laundryType/index";
import clothingBrand from "./clothingBrand/index";
import clothingBlemishes from "./clothingBlemishes/index";
import paymentMethods from "./paymentMethods/index";

export default {
  name: "basicData",
  components: {
    divider,
    clothesName,
    clothingAccessories,
    laundryType,
    clothingBrand,
    clothingBlemishes,
    paymentMethods
  },
  data() {
    return {
      activeName: "first"
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="scss">
</style>