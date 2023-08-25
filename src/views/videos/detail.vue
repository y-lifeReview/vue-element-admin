<template>
  <div
    style="position: relative; min-height: calc(100vh - 84px)"
    class="app-container"
  >
    <el-form>
      <el-form-item style="padding: 0 10px">
        <h2>{{ info.title }} 合集下的视频</h2>
        <el-tag v-if="!info.ispassword">未加密</el-tag>
        <template v-else>
          <el-tag type="danger">已加密</el-tag>
          <el-tag style="margin: 0 5px">问题：{{ info.ques }}</el-tag>
          <el-tag type="success">anwser:{{ info.anwser }}</el-tag>
        </template>
      </el-form-item>
    </el-form>
    <div class="demo-image" style="display: flex; flex-wrap: wrap">
      <div
        class="video-item"
        style="position: relative"
        v-for="item in urlList"
        :key="item.id"
        @click="showPlayer(item.url)"
      >
        <el-image
          class="image"
          :src="item.mask_img"
          lazy
          :alt="item.title"
          :title="item.title"
          fit="cover"
        ></el-image>
        <i
          v-if="checkPermission(['admin'])"
          @click.stop="del(item.id)"
          class="iconfont icon-delete delimg"
        ></i>
        <i class="iconfont icon-play playimg"></i>
      </div>
      <div v-if="checkPermission(['admin'])">
        <el-upload
          class="upload-demo"
          drag
          :action="videourl"
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

    <!-- 播放器层 -->
    <div v-if="playerShow" class="my-dplayer" id="dplayer"></div>
    <div @click="closePlayer" v-if="playerShow" class="player-close">
      <el-button type="info" icon="el-icon-close" circle></el-button>
    </div>
  </div>
</template>
<script>
import DPlayer from "dplayer";
import { getVideoDetail, delVideo, addVideo } from "@/api/video";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      urlList: [],
      dp: null,
      // urls: [],
      playerShow: false,
      info: {},
      id: 0,
      uploading: false,
      videourl: process.env.VUE_APP_BASE_VIDEOAPI,
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
      getVideoDetail(id)
        .then((data) => {
          console.log(data);
          this.urlList = data.data;
          this.info = data.info;
          // this.urls = data.data.map((item) => {
          //   return item.mask_img;
          // });
          // console.log(this.urls);
        })
        .catch((err) => {});
    },
    showPlayer(url) {
      this.playerShow = true;
      this.$nextTick(() => {
        this.dp = new DPlayer({
          container: document.getElementById("dplayer"),
          video: {
            url,
            autoplay: true,
            lang: "zh-cn",
            defaultQuality: 100,
            screenshot: true,
            hotkey: true,
          },
        });
      });
    },
    closePlayer() {
      this.playerShow = false;
      this.dp.destroy();
      this.dp = null;
    },
    del(id) {
      let islast = this.urlList.length > 1 ? 0 : this.id;
      delVideo(id, islast)
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
      addVideo(this.id, res.data.url)
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
.my-dplayer {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  background: rgba(0, 0, 0, 0.5);
}
.player-close {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 3;
}
.image {
  width: 360px;
  height: 180px;
  margin: 0 10px;
  border-radius: 6px;
  box-shadow: 0 8px 16px rgb(0 0 0 / 30%);
}
.video-item {
  transform: scale(1);
  transition: 0.2s linear;
}
.video-item:hover {
  transform: scale(1.03);
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
.playimg {
  position: absolute;
  left: 50%;
  top: 50%;
  // width: 50px;
  // height: 50px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 50px;
  transform: translate(-50%, -50%);
}
</style>
