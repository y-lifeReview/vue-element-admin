<template>
  <div class="app-container">
    <el-form  ref="form" :model="form" label-width="120px">
      <el-form-item label="视频合集名称">
        <el-input
          show-word-limit
          minlength="1"
          type="text"
          maxlength="10"
          placeholder="请输入名称"
          v-model="form.name"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label=""> -->
        <el-row>
          <el-col :span="3">
            <el-form-item
              style="margin-bottom: 10px"
              label-width="120px"
              label="是否加密:"
            >
              <el-switch
                v-model="isPassword"
                active-color="#13ce66"
                inactive-color="gray"
                name="isPassword"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col v-if="isPassword" :span="8">
            <el-form-item
              style="margin-bottom: 10px"
              label-width="60px"
              label="问题:"
              prop="ques"
            >
              <el-input
                v-model="ques"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="Please enter the ques"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="isPassword" :span="8">
            <el-form-item
              style="margin-bottom: 10px"
              label-width="60px"
              label="答案:"
              prop="anwser"
            >
              <el-input
                v-model="anwser"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="Please enter the anwser"
              />
            </el-form-item>
          </el-col>
        </el-row>
      <!-- </el-form-item> -->
      <el-form-item v-if="checkPermission(['admin'])" label="上传首个视频">
        <el-upload
          class="upload-demo"
          drag
          :action="videourl"
          multiple
          :data="dataObj"
          v-loading="uploading"
          :before-upload="beforeUpload"
          :on-success="handleImageSuccess"
          :on-remove="handleRemove"
          list-type="text"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <!-- <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
          </div> -->
        </el-upload>
      </el-form-item>
      <el-form-item v-if="checkPermission(['admin'])">
        <el-button :loading="isUpload" type="primary" @click="onSubmit"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { addVideoCategory } from "@/api/video";
export default {
  data() {
    return {
      uploading: false,
      videourl: process.env.VUE_APP_BASE_VIDEOAPI,
      dataObj: {},
      // imgList:[],
      videoList: [],
      isPassword:0,
      ques:'无',
      anwser:'无',
      isUpload: false,
      form: {
        name: "",
      },
    };
  },
  methods: {
    onSubmit() {
      //   console.log("submit!",this.form);
      if (this.form.name.trim().length === 0) {
        this.$message.error("名称不能为空");
        return false;
      }
      console.log(this.videoList);
      if (this.videoList.lenght === 0) {
        this.$message.error("至少上传一个视频");
        return false;
      }

      this.isUpload = true;
      addVideoCategory(
        this.form.name.trim(),
        this.videoList,
        this.isPassword,
        this.ques,
        this.anwser
      )
        .then((res) => {
          console.log("结果", res);
          this.isUpload = false;
          this.$message.success("新增合集成功");
          this.$router.push({
            name: "allVideo",
          });
        })
        .catch((err) => {
          console.log("失败", err);
          this.isUpload = false;
        });
    },
    beforeUpload() {
      this.uploading = true;
      this.dataObj.token = getToken();
    },
    handleImageSuccess(res, file, fileList) {
      // console.log("上传结果", res,file,fileList);
      let url = res.data.url;
      this.videoList.push(url);
      // let tagindex = url.lastIndexOf('.')
      // let imgurl = url.substring(0,tagindex)+'_sprinkle_0.jpg'
      // console.log(imgurl)
      // this.imgList.push(imgurl);
      this.uploading = false;
    },
    handleRemove(file, fileList) {
      //   console.log(file, fileList);
      let url = file.response.data.url;
      this.videoList.splice(this.videoList.indexOf(url), 1);
      // let tagindex = url.lastIndexOf('.')
      // let imgurl = url.substring(0,tagindex)+'_sprinkle_0.jpg'
      // this.imgList.splice(this.imgList.indexOf(imgurl), 1);
      //   console.log('删除后：',this.videoList)
    },
  },
};
</script>
<style scoped lang="scss">
.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}</style>
