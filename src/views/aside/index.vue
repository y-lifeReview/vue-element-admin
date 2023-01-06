<template>
  <div class="app-container">
    <el-select style="width: 150px" v-model="asideGrade" placeholder="导航等级">
      <el-option key="0" label="一级导航" value="1"> </el-option>
      <el-option key="1" label="二级导航" value="2"> </el-option>
    </el-select>
    <el-select
      style="width: 150px"
      v-if="asideGrade === '2'"
      v-model="asideFather"
      placeholder="所属父级导航"
    >
      <el-option
        v-for="item in asideList"
        :key="item.id"
        :label="item.title"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <el-input v-model="addTitle" placeholder="标题" style="width: 150px" />
    <el-select style="width: 150px" v-model="addIsout" placeholder="是否外链">
      <el-option key="0" label="是" :value="1"> </el-option>
      <el-option key="1" label="否" :value="0"> </el-option>
    </el-select>
    <el-input
      v-model="addPath"
      placeholder="链接地址/路由"
      style="width: 150px"
    />
    <el-input v-model="addIcon" placeholder="导航图标" style="width: 150px" />
    <el-button
      style="margin-left: 10px"
      type="primary"
      icon="el-icon-edit"
      @click="addAsideRoute"
    >
      新增导航
    </el-button>

    <el-table
      :data="asideList"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      v-loading="listLoading"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="标题" width="180">
        <template slot-scope="{ row }">
          <el-input
            :ref="'input' + row.id"
            v-if="row.edit"
            v-model="row.title"
            :class="row.zindex == 1 ? 'edit-input' : 'edit-input-child'"
            size="small"
          />
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否外链" width="180">
        <template slot-scope="{ row }">
          <el-select
            style="width: 150px"
            v-model="row.is_outweb"
            placeholder="是否外链"
            v-if="row.edit"
          >
            <el-option key="0" label="是" :value="1"> </el-option>
            <el-option key="1" label="否" :value="0"> </el-option>
          </el-select>
          <span v-else>{{ row.is_outweb ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接地址/路由">
        <template slot-scope="{ row }">
          <el-input
            v-if="row.edit"
            v-model="row.path"
            class="edit-input"
            size="small"
          />
          <span v-else>{{ row.path === "0" ? "无" : row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon_string" label="图标">
        <template slot-scope="{ row }">
          <el-input
            v-if="row.edit"
            v-model="row.icon_string"
            class="edit-input"
            size="small"
          />
          <span v-else>{{ row.icon_string }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >
              确认
            </el-button>
            <el-button
              class="cancel-btn"
              size="mini"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <el-button v-else type="primary" size="mini" @click="handleEdit(row)">
            修改
          </el-button>

          <template v-if="!row.edit">
            <el-button
              v-if="row.is_show == 1"
              type="warning"
              size="mini"
              @click="handleShow(row)"
            >
              隐藏
            </el-button>
            <el-button
              v-else
              type="primary"
              size="mini"
              @click="handleShow(row)"
            >
              显示
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { asideInfo, asideShow, asideAdd, asideChange } from "@/api/aside";
export default {
  name: "asideRoute",
  // components: {  },
  data() {
    return {
      addIcon: "",
      addPath: "",
      addIsout: null,
      addTitle: "",
      asideFather: null,
      asideGrade: "1",
      asideList: [],
      listLoading: true,
    };
  },
  mounted() {
    this.getAisdeInfo();
  },
  methods: {
    //获取签名列表
    getAisdeInfo() {
      this.listLoading = true;
      asideInfo().then((response) => {
        let data = response.data;
        // console.log('导航数据',data)
        data = data.map((v) => {
          if (v.children) {
            v.children = v.children.map((item) => {
              this.$set(item, "edit", false);
              item.originalTitle = item.title;
              item.originalOut = item.is_outweb;
              item.originalPath = item.path;
              item.originalIcon = item.icon_string;
              return item;
            });
          }
          this.$set(v, "edit", false); //$set vue添加响应式属性
          v.originalTitle = v.title;
          v.originalOut = v.is_outweb;
          v.originalPath = v.path;
          v.originalIcon = v.icon_string;
          return v;
        });
        console.log("data", data);
        this.asideList = data;
        // this.total = response.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1 * 1000);
      });
    },
    //导航显示
    handleShow(row) {
      console.log("参数", row);
      let { is_show, id } = row;
      this.listLoading = true;
      asideShow(is_show, id).then((response) => {
        // console.log("显示控制结果", response);
        if (response.code === 200) {
          this.getAisdeInfo();
        } else {
          this.$message({
            type: "error",
            message: response.message,
          });
          this.listLoading = false;
        }
      });
    },
    //新增导航
    addAsideRoute() {
      if (
        this.addTitle.trim() === "" ||
        this.addIcon.trim() === "" ||
        this.addPath.trim() === "" ||
        this.addIsout === null ||
        (this.asideGrade == "2" && this.asideFather === null)
      ) {
        this.$message({
          type: "warning",
          message: "请检查你的新增数据是否完整",
        });
        return;
      }

      this.listLoading = true;
      asideAdd({
        icon_string: this.addIcon,
        title: this.addTitle,
        father_id: this.asideFather,
        zindex: this.asideGrade,
        is_outweb: this.addIsout,
        path: this.addPath,
      }).then((response) => {
        console.log("新增结果", response);
        if (response.code === 200) {
          this.$message({
            type: "success",
            message: "新增成功",
          });
          this.addIcon = this.addPath = this.addTitle = "";
          this.addIsout = this.asideFather = null;
          this.asideGrade = "1";
          this.getAisdeInfo();
        } else {
          this.$message({
            type: "success",
            message: "新增失败" + response.message,
          });
          this.listLoading = false;
        }
      });
    },
    handleEdit(row) {
      // console.log("修改信息", row);
      //关闭其他正在编辑的行
      this.asideList = this.asideList.map((v) => {
        if (v.children) {
          v.children = v.children.map((item) => {
            item.edit = false
            return item;  
          });
        }
        v.edit = false;
        return v;
      });
      row.edit = !row.edit;
      this.$nextTick(() => {
        this.$refs["input" + row.id].focus();
      });
    },
    //取消修改
    cancelEdit(row) {
      row.title = row.originalTitle;
      row.is_outweb = row.originalOut;
      row.path = row.originalPath;
      row.icon_string = row.originalIcon;
      row.edit = false;
      this.$message({
        message: "编辑已取消",
        type: "warning",
      });
    },
    //确认修改完成
    confirmEdit(row) {
      //参数检查
      if (
        row.title.trim() === "" ||
        row.path.trim() === "" ||
        row.icon_string.trim() === ""
      ) {
        this.$message({
          type: "warning",
          message: "请检查要修改的导航数据是否完整",
        });
        return;
      }
      //请求发送
      this.listLoading = true;
      asideChange({
        id: row.id,
        title: row.title,
        is_outweb: row.is_outweb,
        path: row.path,
        icon_string: row.icon_string,
      })
        .then((response) => {
          if (response.code === 200) {
            row.edit = false;
            row.originalTitle = row.title;
            row.originalOut = row.is_outweb;
            row.originalPath = row.path;
            row.originalIcon = row.icon_string;
            this.listLoading = false;
            this.$message({
              message: "修改成功",
              type: "success",
            });
          } else {
            this.listLoading = false;
            this.$message({
              message: "修改失败" + response,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    //新增签名
    addSign() {
      let content = this.addSignContent.trim().substring(-1, 30);
      if (content.length === 0 || content.length === 0) {
        return;
      }
      this.listLoading = true;
      addSignReq(content)
        .then((response) => {
          if (response.code === 200) {
            this.addSignContent = "";
            this.$message({
              message: "新增成功",
              type: "success",
            });
            //刷新数据
            this.handleFilter();
          } else {
            this.listLoading = false;
            this.$message({
              message: "新增失败" + response,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },

    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
  },
};
</script>
<style scoped>
.edit-input {
  width: 80%;
}
.edit-input-child {
  width: 75%;
}
</style>
