<template>
  <div class="app-container">
    <div class="demo-image" style="display: flex;flex-wrap: wrap;">
      <div style="position: relative" v-for="item in urlList" :key="item.id">
        <el-image
          class="image"
          :src="item.src"
          :preview-src-list="urls"
          lazy
          :alt="item.title"
          :title="item.title"
        ></el-image>
        <i v-if="checkPermission(['admin'])" @click="delImg(item.id)" class="iconfont icon-delete delimg"></i>
      </div>
      <div v-if="checkPermission(['admin'])">
        <el-upload
          class="upload-demo"
          drag
          :action="imgurl"
          :data="dataObj"
          v-loading="uploading"
          :before-upload="beforeUpload"
          :on-success="handleImageSuccess"
          :show-file-list="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
    </div>
  </div>
</template>
<script>
import { getImageDetail, delImage, addImage } from "@/api/image";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      urlList: [],
      urls: [],
      id: 0,
      uploading: false,
      imgurl: process.env.VUE_APP_BASE_IMGAPI,
      dataObj: {},
    };
  },
  mounted() {
    const id = this.$route.query && this.$route.query.id;
    console.log("id", id);
    this.id = id;
    this.getDetail(id);
  },
  methods: {
    getDetail(id) {
      getImageDetail(id)
        .then((data) => {
          console.log(data);
          this.urlList = data.data;
          this.urls = data.data.map((item) => {
            return item.src;
          });
          console.log(this.urls);
        })
        .catch((err) => {});
    },
    delImg(id) {
      let islast = this.urlList.length > 1 ? 0 : this.id;
      delImage(id, islast)
        .then((data) => {
          if (!islast) {
            this.getDetail(this.id);
          } else {
            this.$router.back();
          }
        })
        .catch((err) => {});
    },
    beforeUpload() {
      this.uploading = true;
      this.dataObj.token = getToken();
    },
    handleImageSuccess(res) {
      addImage(this.id, res.data.url)
        .then((res) => {
          console.log("结果", res);
          this.uploading = false;
          this.$message.success("上传成功");
          this.getDetail(this.id);
        })
        .catch((err) => {
          console.log("失败", err);
          this.uploading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.image {
  width: 360px;
  height: 180px;
  margin: 0 10px;
  border-radius: 6px;
  box-shadow: 0 8px 16px rgb(0 0 0 / 30%);
}
.delimg {
  position: absolute;
  right: 15px;
  top: 10px;
  width: 30px;
  height: 30px;
  color: #fff;
  font-size: 30px;
}
</style>
