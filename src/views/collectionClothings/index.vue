<template>
  <div class="collectionClothings-container">
    <divider title="收取衣物" />
    <!-- 会员信息 -->
    <vipInformation @ischoose="handleChoose" :orderUpdate="tip" />
    <el-tabs type="border-card" v-model="activeName">
      <!-- 添加衣物 -->
      <el-tab-pane name="first">
        <span slot="label">
          <i class="el-icon-circle-plus"></i>&nbsp;添加衣物
        </span>
        <addClothes :vipIschoose="tip" @orderUpdate="handleOrderUpdate" />
      </el-tab-pane>
      <!-- 会员申请添加衣物 -->
      <el-tab-pane name="second">
        <span slot="label">
          <i class="el-icon-circle-plus"></i>&nbsp;用户申请添加衣物
        </span>
        <applyAddClothes @orderUpdate="handleOrderUpdate" />
      </el-tab-pane>
      <!-- 洗衣管理 -->
      <el-tab-pane label="洗衣管理" name="third">
        <span slot="label">
          <i class="el-icon-s-order"></i>&nbsp;洗衣管理
        </span>
        <laundryManagement :vipIschoose="tip" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import addClothes from "./componets/addClothes";
import applyAddClothes from "./componets/applyAddClothes";
import divider from "../componets/divider";
import vipInformation from "./componets/vipInformation";
import laundryManagement from "./componets/laundryManagement";

export default {
  name: "collectionClothings",
  components: {
    addClothes,
    applyAddClothes,
    divider,
    vipInformation,
    laundryManagement
  },
  data() {
    return {
      activeName: "first",
      tip: false
    };
  },
  methods: {
    handleChoose() {
      this.tip = !this.tip;
    },
    handleOrderUpdate() {
      this.tip = !this.tip;
    }
  }
};
</script>

<style lang="scss">
</style>