<template>
  <div class="homepage-container">
    <!-- 轮播图 -->
    <div class="shuffling">
      <el-carousel :interval="4000" type="card" height="250px">
        <el-carousel-item v-for="image in images" :key="image">
          <el-image style="width: 100%; height: 100%" :src="image" fit="fill">
            <!-- <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
            </div>-->
          </el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <img class="pikaqiuImg" src="@/assets/2.gif" width="300px" alt="记录美好生活">
  </div>
</template>

<script>
// import * as cookieUtils from "@/utils/cookie";

export default {
  data() {
    return {
      images: [
        "https://cdn.pixabay.com/photo/2016/10/17/03/19/shop-1746858__340.jpg",
        "https://cdn.pixabay.com/photo/2014/08/08/20/54/laundry-413688__340.jpg",
        "https://cdn.pixabay.com/photo/2018/08/29/12/43/to-wash-3639818__340.png",
        "https://cdn.pixabay.com/photo/2016/10/17/03/23/shop-1746862__340.jpg",
        "https://cdn.pixabay.com/photo/2016/11/07/15/45/laundromat-1806114__340.jpg"
      ],
      fits: ["fill", "contain", "cover", "none", "scale-down"],
    };
  },
  methods: {},
  created() {
    // document.cookie = "aad"
    // console.log(document.cookie);
    // console.log(this.$store.state.user.userid);
    // if (!cookieUtils.getCookie("userid")) {
    //   this.$router.push({ path: "/login" });
    // }
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.homepage-container {
  // 轮播图
  .shuffling {
    .el-carousel {
      .el-carousel__container {
        .el-carousel__item {
          border-radius: 10px;
          &:nth-child(2n) {
            background-color: #666;
          }
          &:nth-child(2n + 1) {
            background-color: #666;
          }
          .el-image {
            opacity: 0.5;
            transition: all 0.7s ease-in-out;
          }
        }
        .is-active {
          opacity: 1;
          .el-image {
            opacity: 1;
          }
        }
      }
      .el-carousel__indicators {
        .el-carousel__indicator {
          .el-carousel__button {
            height: 3px;
            border-radius: 5px;
            background-color: #aaa;
          }
        }
      }
    }
  }
  .pikaqiuImg{
    width: 200px;
    border: none;
    border-radius: 150px;
  }
}
</style>