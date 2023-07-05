<template>
  <div class="app-container">
    <el-form style="width: 460px" ref="form" :model="form" label-width="80px">
      <el-form-item label="相册名称">
        <el-input
          show-word-limit
          minlength="1"
          type="text"
          maxlength="10"
          placeholder="请输入相册名称"
          v-model="form.name"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="checkPermission(['admin'])" label="上传图片">
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
        <el-button :loading="isUpload" type="primary" @click="onSubmit"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { addImageCategory } from "@/api/image";
export default {
  data() {
    return {
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
  methods: {
    onSubmit() {
      //   console.log("submit!",this.form);
      if (this.form.name.trim().length === 0) {
        this.$message.error("相册名称不能为空");
        return false;
      }
      console.log(this.imgList);
      if (this.imgList.lenght === 0) {
        this.$message.error("至少添加一张图片");
        return false;
      }

      this.isUpload = true;
      addImageCategory(this.form.name.trim(), this.imgList)
        .then((res) => {
          console.log("结果", res);
          this.isUpload = false;
          this.$message.success("新增相册成功");
          this.$router.push({
            name: "allImages",
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
<style scoped lang="scss"></style>
