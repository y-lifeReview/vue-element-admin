<template>
  <div class="app-container">
    <el-input
      v-model="addSignContent"
      placeholder="内容"
      style="width: 300px"
      @keyup.enter.native="addSign"
    />
    <el-button
      style="margin-left: 10px"
      type="primary"
      icon="el-icon-edit"
      @click="addSign"
    >
      新增签名
    </el-button>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      stripe
      empty-text="无"
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="内容"
        :show-overflow-tooltip="true"
        min-width="100px"
      >
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.content" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="mini"
            @click="row.edit = !row.edit"
          >
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handledel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getSignList, changeSign, addSignReq, delSign } from "@/api/sign";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "sign",
  components: { Pagination },
  data() {
    return {
      addSignContent: "",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: "-id",
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取签名列表
    getList() {
      this.listLoading = true;
      getSignList(this.listQuery).then((response) => {
        let data = response.data;
        data = data.map((v) => {
          this.$set(v, "edit", false); //$set vue添加响应式属性
          v.originalContent = v.content;
          return v;
        });
        this.list = data;
        this.total = response.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1 * 1000);
      });
    },
    //取消修改
    cancelEdit(row) {
      row.content = row.originalContent;
      row.edit = false;
      this.$message({
        message: "编辑已取消",
        type: "warning",
      });
    },
    //确认修改完成
    confirmEdit(row) {
      //请求发送
      this.listLoading = true;
      changeSign(row.id, row.content)
        .then((response) => {
          if (response.code === 200) {
            row.edit = false;
            row.originalContent = row.content;
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
    handledel(row) {
      this.$confirm("此操作将永久删除该内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          delSign(row.id)
            .then((response) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.handleFilter()
            })
            .catch((err) => {
              this.listLoading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
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
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
