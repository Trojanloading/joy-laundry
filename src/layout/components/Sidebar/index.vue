<template>
  <div class="sidebar">
    <div class="sidebar-content" @mouseleave="leave">
      <el-row class="tac">
        <el-col>
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#78a17b"
            text-color="#333"
            active-text-color="#ddd"
            :collapse="isCollapse"
          >
            <template v-if="!isuser">
              <el-menu-item index="1" @mouseenter.native="enter($event)" @click.native="aa">
                <svgicon iconClass="iconshouye_huaban-copy-copy-copy-copy" />
                <span slot="title">首页</span>
              </el-menu-item>
              <el-menu-item index="2" @mouseenter.native="enter($event)" @click.native="bb">
                <svgicon iconClass="iconshangyi-" />
                <span slot="title">收取衣物</span>
              </el-menu-item>
              <el-menu-item index="3" @mouseenter.native="enter($event)" @click.native="cc">
                <svgicon iconClass="iconkuzi-" />
                <span slot="title">领取衣物</span>
              </el-menu-item>
              <el-menu-item index="4" @mouseenter.native="enter($event)" @click.native="dd">
                <svgicon iconClass="iconmaozi-" />
                <span slot="title">会员管理</span>
              </el-menu-item>
              <el-menu-item index="5" @mouseenter.native="enter($event)" @click.native="ee">
                <svgicon iconClass="iconbaozhen-" />
                <span slot="title">会员充值</span>
              </el-menu-item>
              <el-menu-item index="6" @mouseenter.native="enter($event)" @click.native="ff">
                <svgicon iconClass="iconweijin-" />
                <span slot="title">反馈管理</span>
              </el-menu-item>
              <el-menu-item index="7" @mouseenter.native="enter($event)" @click.native="gg">
                <svgicon iconClass="iconzhentou-" />
                <span slot="title">公告管理</span>
              </el-menu-item>
              <!-- 统计管理 -->
              <el-submenu index="8" @mouseenter.native="enter($event)">
                <template slot="title">
                  <svgicon iconClass="iconwazi-" />
                  <span>统计管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="8-1" @click.native="hh">
                    <i class="el-icon-s-data"></i>会员消费统计
                  </el-menu-item>
                  <el-menu-item index="8-2" @click.native="ii">
                    <i class="el-icon-s-data"></i>收衣取衣统计
                  </el-menu-item>
                  <el-menu-item index="8-3" @click.native="jj">
                    <i class="el-icon-s-data"></i>收入统计
                  </el-menu-item>
                  <el-menu-item index="8-4" @click.native="kk">
                    <i class="el-icon-s-data"></i>洗衣单统计
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <!-- 系统设置 -->
              <el-submenu index="9" @mouseenter.native="enter($event)">
                <template slot="title">
                  <svgicon iconClass="iconliantiyi-" />
                  <span>系统设置</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="9-1" @click.native="ll">
                    <i class="el-icon-s-tools"></i>基础资料设置
                  </el-menu-item>
                  <el-menu-item index="9-2" @click.native="mm">
                    <i class="el-icon-s-tools"></i>衣服价格设置
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </template>
            <!-- 首页 -->
            <template v-if="isuser">
              <el-menu-item index="1" @mouseenter.native="enter($event)" @click.native="tt">
                <svgicon iconClass="iconshouye_huaban-copy-copy-copy-copy" />
                <span slot="title">首页</span>
              </el-menu-item>
              <!-- 个人信息 -->
              <el-menu-item index="2" @mouseenter.native="enter($event)" @click.native="uu">
                <svgicon iconClass="iconbaozhen-" />
                <span slot="title">个人信息</span>
              </el-menu-item>
              <!-- 洗衣记录 -->
              <el-menu-item index="3" @mouseenter.native="enter($event)" @click.native="vv">
                <svgicon iconClass="iconshangyi-" />
                <span slot="title">添加衣物</span>
              </el-menu-item>
              <!-- 订单详情 -->
              <el-menu-item index="4" @mouseenter.native="enter($event)" @click.native="ww">
                <svgicon iconClass="iconzhentou-" />
                <span slot="title">洗衣记录</span>
              </el-menu-item>
              <!-- 反馈建议 -->
              <el-menu-item index="5" @mouseenter.native="enter($event)" @click.native="xx">
                <svgicon iconClass="iconweijin-" />
                <span slot="title">反馈建议</span>
              </el-menu-item>
              <!-- 系统公告 -->
              <el-menu-item index="6" @mouseenter.native="enter($event)" @click.native="yy">
                <svgicon iconClass="iconzhentou-" />
                <span slot="title">系统公告</span>
              </el-menu-item>
              <!-- 相关设置 -->
              <el-menu-item index="7" @mouseenter.native="enter($event)" @click.native="zz">
                <svgicon iconClass="iconliantiyi-" />
                <span slot="title">相关设置</span>
              </el-menu-item>
            </template>
          </el-menu>
          <span class="layui-nav-bar"></span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Svgicon from "./Svgicon";
import * as cookieUtils from "@/utils/cookie";

export default {
  name: "sidebar",
  data() {
    return {
      isuser: false
    };
  },
  components: {
    Svgicon
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    enter(event) {
      var aa = document.getElementsByClassName("layui-nav-bar");
      aa[0].style.top = event.target.offsetTop + "px";
      aa[0].style.visibility = "visible";
      // alert(event.target.offsetTop);
    },
    leave() {
      var aa = document.getElementsByClassName("layui-nav-bar");
      aa[0].style.visibility = "hidden";
    },
    aa() {
      this.$router.push("/homepage");
    },
    bb() {
      this.$router.push("/homepage/collectionClothings");
    },
    cc() {
      this.$router.push("/homepage/getClothings");
    },
    dd() {
      this.$router.push("/homepage/vipManagement");
    },
    ee() {
      this.$router.push("/homepage/vipTopUp");
    },
    ff() {
      this.$router.push("/homepage/feedbackManagement");
    },
    gg() {
      this.$router.push("/homepage/notice");
    },
    hh() {
      this.$router.push(
        "/homepage/statisticalManagement/memberConsumptionStatistics"
      );
    },
    ii() {
      this.$router.push("/homepage/noteRecords");
    },
    jj() {
      this.$router.push("/homepage/noteRecords");
    },
    kk() {
      this.$router.push("/homepage/noteRecords");
    },
    ll() {
      this.$router.push("/homepage/systemSettings/basicData");
    },
    mm() {
      this.$router.push("/homepage/systemSettings/clothesPrice");
    },
    tt() {
      this.$router.push("/homepage");
    },
    uu() {
      this.$router.push("/homepage/userInfo");
    },
    vv() {
      this.$router.push("/homepage/userAddClothes");
    },
    ww() {
      this.$router.push("/homepage/userLaundryRecord");
    },
    xx() {
      this.$router.push("/homepage/feedback");
    },
    yy() {
      this.$router.push("/homepage/systemNotice");
    },
    zz() {
      this.$router.push("/homepage/noteRecords");
    }
  },
  computed: {
    isCollapse: function() {
      return this.$store.state.user.ishideSidebar;
      // return true;
    }
  },
  created() {
    return (this.isuser = cookieUtils.getCookie("userid") ? true : false);
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.sidebar {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #333;
  .sidebar-content {
    @include scrollBar;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    // background-color: #2c3d50;
    background-color: #78a17b;
    z-index: 999;
    .el-menu-vertical-demo {
      border: none !important;
      .el-menu-item {
        .icon {
        }
        span {
        }
      }
      .el-submenu {
        .el-submenu__title {
          font-size: 16px !important;
          .icon {
          }
          span {
          }
          .el-submenu__icon-arrow {
            color: #333 !important;
            font-size: 15px;
            font-weight: bold;
          }
        }
        .el-menu {
          .el-menu-item-group {
            .el-menu-item-group__title {
              padding: 0 !important;
              display: none;
            }
            ul {
              .el-menu-item {
                // padding-left: 10px !important;
                i {
                  color: #555 !important;
                  margin: 0;
                }
              }
            }
          }
        }
      }
      .is-opened {
        i {
        }
      }
    }
  }
}
ul {
  i {
    color: #555 !important;
  }
}
// 移动标
.layui-nav-bar {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9999;
  display: block;
  width: 5px;
  height: 56px;
  background-color: #ddd;
  transition: all 0.25s ease-in-out;
  visibility: hidden;
}

li svg {
  font-size: 20px;
  margin: 0 22px 0 1px;
}
li {
  font-size: 16px !important;
}
</style>