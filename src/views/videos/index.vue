<template>
  <div class="app-container">
    <h2>所有合集</h2>
    <div class="img_box">
      <div v-for="(item, index) in videoList" @click="imgDetail(item.id)" :key="index" class="img_cover">
        <el-image
          class="image"
          fit="cover"
          :src="item.mask_img"
        >
        </el-image>
        <div class="img_title">
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVideoCategory } from "@/api/video";

export default {
  name: "",
  // components: {  },
  data() {
    return {
      videoList:[]
    };
  },
  mounted(){
    this.getCate()
  },
  methods:{
    getCate(){
      getVideoCategory().then((data)=>{
        console.log('data',data)
        this.videoList = data.data
      }).catch((err)=>{
        console.log('err',err)
      })
    },
    imgDetail(id){
      this.$router.push({
        name:'videoDetail',
        query:{
          id:id
        }
      })
    }
  }
};
</script>
<style scoped lang="scss">
.img_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .img_cover {
    width: 232px;
    height: 132px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 8px 16px rgb(0 0 0 / 30%);
    overflow: hidden;
    cursor: pointer;
    .image {
      height: 100px;
      &:before {
        color: #fff;
        font-family: iconfont;
        content: "\e6ff";
        display: block;
        font-size: 18px;
        height: 30px;
        left: calc(50% - 18px);
        top: calc(50% - 18px);
        line-height: 35px;
        position: absolute;
        text-align: center;
        transform: scale(0);
        opacity: 0;
        transition: 0.25s;
        width: 30px;
        z-index: 1;
      }
      &:hover:before {
        transform: scale(2);
        opacity: 1;
        transition: 0.25s;
      }
      &:after {
        background: rgba(0, 0, 0, 0.5) none repeat scroll 0 0;
        content: "";
        display: block;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        opacity: 0;
        transition: 0.25s;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      &:hover:after {
        opacity: 1;
        transition: 0.25s;
      }
    }
    .img_title {
      width: 100%;
      height: 32px;
      text-align: center;
      line-height: 32px;
      overflow: hidden;
      font-size: 14px;
    }
  }
}
</style>
