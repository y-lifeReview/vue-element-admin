<template>
  <div class="app-container">
    <el-form style="width: 460px" ref="form" :model="form" label-width="80px">
      <el-form-item label="内容">
        <el-input
          v-model="textarea1"
          :autosize="{ minRows: 3, maxRows: 8 }"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>

      <el-form-item v-if="checkPermission(['admin'])" label="图片">
        <el-upload
          class="upload-demo"
          drag
          :action="imgurl"
          multiple
          :data="dataObj"
          v-loading="uploading"
          :before-upload="beforeUpload"
          :on-success="handleImageSuccess"
          :on-remove="handleRemove"
          list-type="picture"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <!-- <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
          </div> -->
        </el-upload>
      </el-form-item>
      <el-form-item v-if="checkPermission(['admin'])">
        <el-button
        style="margin-top: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="addDynamic"
        v-permission="['admin']"
      >
        发布
      </el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { dynamicPub } from "@/api/dynamic";
export default {
  name: "dynamic",
  // components: {  },
  data() {
    return {
      textarea1: "",
      uploading: false,
      imgurl: process.env.VUE_APP_BASE_IMGAPI,
      dataObj: {},
      imgList: [],
      isUpload: false,
      form: {
        name: "",
      },
    };
  },
  mounted() {
    //   this.getAisdeInfo();
  },
  methods: {
    addDynamic() {
      dynamicPub(this.textarea1,this.imgList)
        .then((data) => {
          if (data.code === 200) {
            this.$message({
              type: "success",
              message: data.data,
            });
            this.textarea1 = "";
            this.imgList = [];
            this.dataObj ={};
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: data.data,
          });
        });
    },
    beforeUpload() {
      this.uploading = true;
      this.dataObj.token = getToken();

    },
    handleImageSuccess(res,file,fileList) {
      // console.log("上传结果", res,file,fileList);
      this.imgList.push(res.data.url);
      this.uploading = false;
    },
    handleRemove(file, fileList) {
      //   console.log(file, fileList);
      this.imgList.splice(this.imgList.indexOf(file.response.data.url), 1);
      //   console.log('删除后：',this.imgList)
    },
  },
};
</script>
<style scoped></style>
