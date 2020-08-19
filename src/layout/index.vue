<template>
  <!-- 弹性布局 -->
  <!-- <div class="app-wrapper" :class="[{'hideSidebar':ishideSidebar}]"> -->
  <div class="app-wrapper">
    <!-- 上部分 -->
    <div class="navbar-container">
      <navbar />
    </div>

    <!-- 下部分 -->
    <div class="under-container">
      <!-- 下部分-侧栏部分 -->
      <aside class="sidebar-container">
        <sidebar />
      </aside>

      <!-- 下部分-右边部分 -->
      <div class="main-right">
        <!-- 下部分-右边部分-main部分 -->
        <div class="main-container">
          <app-main />
        </div>

        <!-- 下部分-右边部分-footer部分 -->
        <div class="footer-container">
          <foot />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain, Foot } from "./components";
import * as cookieUtils from "@/utils/cookie";
// import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "Layout",
  data() {
    return {
      ishideSidebar: true
    };
  },
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Foot
  },
  // mixins: [ResizeMixin]
  methods: {},
  created() {
    // document.cookie = "aad"
    // console.log(document.cookie);
    // console.log(this.$store.state.user.userid);
  },
  mounted() {
    if (!cookieUtils.getCookie("userid") && !cookieUtils.getCookie("adminid")) {
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  // position: absolute;
  // top: 0;
  min-height: 100%;
  width: 100%;
  background-color: #666;
}
.navbar-container {
  width: 100%;
  height: 50px;
  // background-color: #2c3d50;
  background-color: #78a17b;
  color: #fff;
}

.under-container {
  display: flex;
  flex-wrap: nowrap;
  flex: auto;
  width: 100%;
}
.sidebar-container {
  width: 230px;
  background-color: #666;
  transition: all 0.3s ease;
}

.main-right {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-container {
  flex: 1;
  background-color: #555;
}
</style>