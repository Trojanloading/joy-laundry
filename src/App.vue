<template>
  <div id="app">
    <transition name="app-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    // document.body.removeChild(document.getElementById("Loading"));
    document.getElementById("Loading").style.opacity = 0;
    document.getElementById("Loading").style.zIndex = 0;
  }
};
</script>