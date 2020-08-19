<template>
  <div class="img-list">
    <template v-for="(item, index) in datas">
      <div v-if="item" :key="index" v-loading="imgLoadings[index]" class="img-item">
        <img :src="item.file?item.file:item.url" alt="" fit="fill" @load="afterImgLoad(index)">
        <div v-if="!disabled" class="layer">
          <i class="el-icon-delete del-icon" @click="delImg(index)" />
        </div>
      </div>
    </template>
    <el-upload v-if="enableShowUpload&&!isUploading" list-type="picture-card" action="" :show-file-list="false" :limit="1" :before-upload="beforeUpload" accept="image/*" :disabled="disabled">
      <i class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
.img-list {
  display: flex;
  min-height: 148px;
  .img-item {
    width: 148px;
    height: 148px;
    overflow: hidden;
    border: 1px dashed #c0ccda;
    border-radius: 8px;
    margin-right: 10px;
    position: relative;
    &:hover .layer {
      display: flex;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba($color: #000000, $alpha: 0.4);
      display: none;
      align-items: center;
      justify-content: center;
      .del-icon {
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
<script>
// import { S3Api } from '@/utils/s3'
export default {
  name: 'UploadImage',
  props: {
    value: {
      type: Array,
      default: null
    },
    limit: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      datas: this.value,
      imgLoadings: [],
      isUploading: false,
      enableShowUpload: true
    }
  },
  watch: {
    value (val) {
      this.datas = val
      this.checkEnableUploadMore()
    }
  },
  created () {
    this.checkEnableUploadMore()
  },
  methods: {
    resetDatas () {
      this.datas = []
      this.imgLoadings = []
      this.isUploading = false
      this.enableShowUpload = true
    },
    getDatas () {
      return this.datas
    },
    isImageUploading () {
      return this.isUploading
    },
    onImageChange (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('Upload a picture can not be greater than 1M')
        return false
      }
    },
    afterImgLoad (index) {
      if (this.isUploading) { // 如果是正在上传的图片等图片上传完再取消loading
        return
      }
      this.$set(this.imgLoadings, index, false)
    },
    // beforeUpload (file) {
    //   this.enableShowUpload = false
    //   const isLt1M = file.size / 1024 / 1024 < 1
    //   if (!isLt1M) {
    //     this.enableShowUpload = true
    //     this.$message.error('Upload a picture can not be greater than 1M')
    //     return false
    //   }
    //   const reader = new FileReader()
    //   const _this = this
    //   const data = { path: '', url: '', file: '' }
    //   reader.readAsDataURL(file)
    //   // eslint-disable-next-line
    //   reader.onload = function () {
    //     _this.$set(data, 'file', this.result)
    //     _this.datas.push(data)
    //   }
    //   this.isUploading = true
    //   this.imgLoadings.push(true)
    //   S3Api.uploadFile(file).then(result => {
    //     this.isUploading = false
    //     _this.$set(_this.datas[_this.datas.length - 1], 'path', result.key)
    //     this.$set(this.imgLoadings, this.imgLoadings.length - 1, false)
    //     // console.log('datas', _this.datas)
    //     this.checkEnableUploadMore()
    //   }).catch(() => {
    //     this.checkEnableUploadMore()
    //     this.isUploading = false
    //   })
    // },
    checkEnableUploadMore () {
      if (this.datas.length === this.limit) {
        this.enableShowUpload = false
      } else {
        this.enableShowUpload = true
      }
    },
    delImg (index) {
      this.imgLoadings.splice(index, 1)
      this.datas.splice(index, 1)
      this.checkEnableUploadMore()
    }
  }
}
</script>
