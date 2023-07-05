<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky v-permission="['admin']" :z-index="10" :class-name="'sub-navbar '">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" /> -->
        <!-- <PlatformDropdown v-model="postForm.platforms" /> -->
        <!-- <SourceUrlDropdown v-model="postForm.source_uri" /> -->
        <template v-if="status === 'publish'">
          <el-button
            v-loading="loading"
            style="margin-left: 10px"
            type="success"
            @click="submitForm(1)"
          >
            发布
          </el-button>
          <el-button v-loading="loading" type="warning" @click="submitForm(0)">
            保存为草稿
          </el-button>
        </template>
        <template v-else-if="status === 'draft'">
          <el-button
            v-loading="loading"
            style="margin-left: 10px"
            type="success"
            @click="draftForm(1)"
          >
            发布
          </el-button>
          <el-button v-loading="loading" type="warning" @click="draftForm(0)">
            更新草稿
          </el-button>
        </template>
        <template v-else> 
          <el-button
            v-loading="loading"
            style="margin-left: 10px"
            type="success"
            @click="draftForm(1)"
          >
            发布
          </el-button>
          <el-button v-loading="loading" type="warning" @click="draftForm(0)">
            保存为草稿
          </el-button>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <MDinput
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                required
              >
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    style="margin-bottom: 10px"
                    label-width="60px"
                    label="作者:"
                    class="postInfo-container-item"
                    prop="author"
                  >
                    <el-select
                      v-model="postForm.author"
                      :remote-method="getRemoteUserList"
                      filterable
                      default-first-option
                      remote
                      placeholder="Search user"
                    >
                      <el-option
                        v-for="(item, index) in userListOptions"
                        :key="item + index"
                        :label="item.nickname + '_' + item.id"
                        :value="item.nickname + '_' + item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    style="margin-bottom: 10px"
                    label-width="60px"
                    label="分类:"
                    class="postInfo-container-item"
                    prop="category"
                  >
                    <el-select
                      v-model="postForm.category"
                      filterable
                      default-first-option
                      allow-create
                      placeholder="Search category"
                    >
                      <el-option
                        v-for="(item, index) in cateListOptions"
                        :key="item + index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="10">
                  <el-form-item label-width="120px" label="Publish Time:" class="postInfo-container-item">
                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                  </el-form-item>
                </el-col> -->

                <!-- <el-col :span="6">
                  <el-form-item label-width="90px" label="Importance:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display:inline-block"
                    />
                  </el-form-item>
                </el-col> -->
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-form-item
              style="margin-bottom: 10px"
              label-width="60px"
              label="加密:"
            >
              <el-switch
                v-model="postForm.isPassword"
                active-color="#13ce66"
                inactive-color="gray"
                name="isPassword"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col v-if="postForm.isPassword" :span="8">
            <el-form-item
              style="margin-bottom: 10px"
              label-width="60px"
              label="问题:"
              prop="ques"
            >
              <el-input
                v-model="postForm.ques"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="Please enter the ques"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="postForm.isPassword" :span="8">
            <el-form-item
              style="margin-bottom: 10px"
              label-width="60px"
              label="答案:"
              prop="anwser"
            >
              <el-input
                v-model="postForm.anwser"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="Please enter the anwser"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item
              style="margin-bottom: 10px"
              label-width="60px"
              label="置顶:"
            >
              <el-switch
                v-model="postForm.isOrder"
                active-color="#13ce66"
                inactive-color="gray"
                name="isOrder"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          style="margin-bottom: 10px"
          label-width="70px"
          label="Summary:"
          prop="summary"
        >
          <el-input
            v-model="postForm.content_short"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the content"
          />
          <span v-show="contentShortLength" class="word-counter"
            >{{ contentShortLength }}words</span
          >
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px">
          <!-- <Tinymce ref="editor" v-model="postForm.content" :height="400" /> -->
          <markdown-editor v-model="postForm.content" height="600px" />
        </el-form-item>

        <el-form-item
        v-permission="['admin']"
          prop="image_uri"
          label-width="60px"
          label="封面图:"
          style="margin-bottom: 30px"
        >
          <Upload  v-model="postForm.image_uri" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
// import Tinymce from "@/components/Tinymce";
import MarkdownEditor from "@/components/MarkdownEditor";
import Upload from "@/components/Upload/SingleImage3";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL } from "@/utils/validate";
import {
  fetchArticle,
  articlePub,
  draftInfo,
  draftUpdate,
} from "@/api/article";
import { searchUser, searchCate } from "@/api/remote-search";
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  isOrder: false,
  anwser: "",
  isPassword: false,
  ques: "",
  category: "",
  title: "", // 文章题目
  content: "", // 文章内容
  content_short: "", // 文章摘要
  image_uri: "", // 文章图片
  uid: 6,
};

export default {
  name: "ArticleDetail",
  components: { MarkdownEditor, MDinput, Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error",
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback();
        } else {
          this.$message({
            message: "外链url填写不正确",
            type: "error",
          });
          callback(new Error("外链url填写不正确"));
        }
      } else {
        callback();
      }
    };
    return {
      status: "publish", //publish发布全新文章、draft更新草稿、update更新文章
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      cateListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        category: [{ validator: validateRequire }],
        ques: [{ validator: validateRequire }],
        anwser: [{ validator: validateRequire }],
        summary: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: "blur" }],
      },
      tempRoute: {},
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length;
    },
    // displayTime: {
    //   // set and get is useful when the data
    //   // returned by the back end api is different from the front end
    //   // back end return => "2013-06-25 06:59:25"
    //   // front end need timestamp => 1372114765000
    //   get() {
    //     return +new Date(this.postForm.display_time);
    //   },
    //   set(val) {
    //     this.postForm.display_time = new Date(val);
    //   },
    // },
  },
  mounted() {
    this.getRemoteUserList();
    this.getAllCategory();
    //是否编辑草稿
    this.isEditDraft();
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    isEditDraft() {
      let { aid, ispublish } = this.$route.query;
      //是否发布新文章
      if (aid === undefined) {
        return;
      }
      if (ispublish) {
        this.status = "update";
      } else {
        this.status = "draft";
      }

      //获取草稿信息
      const loading = this.$loading({
        target: ".createPost-container",
        lock: true,
        text: "数据获取中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // loading.close();
      draftInfo(aid).then((response) => {
        console.log("草稿信息获取", response);
        if (response.code === 200) {
          let info = response.data[0];
          if (info.title) this.postForm.title = info.title;
          if (info.user_id) this.postForm.author = "明天下小雨_" + info.user_id;
          if (info.category) this.postForm.category = info.category;
          if (info.is_password) {
            this.postForm.isPassword = true;
            if (info.ques) this.postForm.ques = info.ques;
            if (info.anwser) this.postForm.anwser = info.anwser;
          }
          if (info.isorder) this.postForm.isOrder = true;
          if (info.summary) this.postForm.content_short = info.summary;
          if (info.md_url) this.postForm.content = info.md_url;
          if (info.img) this.postForm.image_uri = info.img;
          loading.close();
        } else {
          this.$message({
            message: "获取草稿失败",
            type: "error",
          });
          loading.close();
        }
      });
    },
    fetchData(id) {
      fetchArticle(id)
        .then((response) => {
          this.postForm = response.data;

          // just for test
          this.postForm.title += `   Article Id:${this.postForm.id}`;
          this.postForm.content_short += `   Article Id:${this.postForm.id}`;

          // set tagsview title
          this.setTagsViewTitle();

          // set page title
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setTagsViewTitle() {
      const title = "Edit Article";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Article";
      document.title = `${title} - ${this.postForm.id}`;
    },
    submitForm(ispublish) {
      if (ispublish) {
        //发布
        // console.log(this.postForm);
        this.postForm.uid = this.postForm.author.split("_")[1] || null;
        this.$refs.postForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let _this = this;
            this.postForm.ispublish = true;
            articlePub(this.postForm)
              .then((result) => {
                _this.$notify({
                  title: "成功",
                  message: "发布文章成功",
                  type: "success",
                  duration: 2000,
                });
                _this.loading = false;
                _this.$router.back();
              })
              .catch((err) => {
                this.$notify({
                  title: "失败",
                  message: "发布文章失败",
                  type: "fail",
                  duration: 2000,
                });
                _this.loading = false;
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        //保存为草稿
        this.loading = true;
        if (this.postForm.author) {
          this.postForm.uid = this.postForm.author.split("_")[1];
        } else {
          this.postForm.uid = null;
        }
        let _this = this;
        this.postForm.ispublish = false;
        articlePub(this.postForm)
          .then((result) => {
            _this.$notify({
              title: "成功",
              message: "保存草稿成功",
              type: "success",
              duration: 2000,
            });
            _this.loading = false;
            _this.status = "draft";
          })
          .catch((err) => {
            this.$notify({
              title: "失败",
              message: "保存草稿失败",
              type: "fail",
              duration: 2000,
            });
            _this.loading = false;
          });
      }
    },
    draftForm(ispublish) {
      this.loading = true;
      let _this = this;
      this.postForm.aid = this.$route.query.aid;
      this.postForm.ispublish = ispublish;
      if (ispublish) {
        draftUpdate(this.postForm)
          .then((response) => {
            if (response.code === 200) {
              this.$message({
                message: "发布成功",
                type: "success",
                showClose: true,
                duration: 1000,
              });
            }
            _this.loading = false;
            _this.$router.back()
          })
          .catch((err) => {
            _this.loading = false;
          });
      } else {
        draftUpdate(this.postForm)
          .then((response) => {
            if (response.code === 200) {
              this.$message({
                message: "保存成功",
                type: "success",
                showClose: true,
                duration: 1000,
              });
            }
            _this.loading = false;
          })
          .catch((err) => {
            _this.loading = false;
          });
      }
    },
    getRemoteUserList(query) {
      searchUser(query).then((response) => {
        if (!response.data) return;
        this.userListOptions = response.data;
      });
    },
    getAllCategory() {
      searchCate().then((response) => {
        console.log("response:", response);
        if (!response.data) return;
        this.cateListOptions = response.data.map((v) => v.category);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
