<template>
  <section class="app-main">
    <div class="app-main-content">
      <transition name="fade-transform" mode="out-in">
        <router-view />
        <!-- <router-view :key="key" /> -->
      </transition>
      <scrollToTop target=".app-main-content" />
    </div>
  </section>
</template>

<script>
import ScrollToTop from "@/components/ScrollToTop";

export default {
  name: "AppMain",
  components: {
    ScrollToTop
  },
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.app-main {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #ddd;
  .app-main-content {
    @include scrollBar(6px);
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // overflow-x: hidden;
    overflow-y: scroll;
    background-color: #eee;
    z-index: 999;
    padding: 10px;
  }
}
</style>
