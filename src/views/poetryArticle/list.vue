<template>
  <dir id="app">
    <el-input
      v-model="keyword"
      placeholder="请输入内容"
      style="width: 200px"
    ></el-input
    ><el-button type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table :data="poetryList" border style="width: 100%">
      <el-table-column prop="title" label="名字" width="120" />
      <el-table-column prop="author" label="诗人" width="120" />
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="deletePoetry(scope.row.id)"
            >删除</el-button
          >
          <el-button type="text" size="small" @click="getEditInfo(scope.row.id)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" style="margin-top: 10px">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="handleCurrentChange"
        :total="total"
      >
      </el-pagination>
    </el-row>

    <el-dialog
      id="test"
      title="添加诗词"
      :visible.sync="dialogVisible"
      width="70%"
      @close="addDialogClosed"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="诗人">
          <el-input v-model="form.author"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </dir>
</template>

<script>
import poetry from "@/api/poetryArticle";

export default {
  data() {
    return {
      poetryList: null,
      pageNum: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      keyword: "",
      form: {
        title:'',
        author:'',
        content:''
      },
    };
  },
  created() {
    // 挂载完成后启动
    this.getAll();
  },
  methods: {
    async deletePoetry(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const res = await poetry.delById(id);
      this.$message.success("删除信息成功");
      this.getAll();
    },
    addDialogClosed() {
      this.clearData();
    },
    clearData() {
      this.dialogVisible = false;
      this.form.title='';
      this.form.author='';
      this.form.content='';
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getAll();
    },
    async getAll() {
      const { data: res } = await poetry.getAll(
        this.pageNum,
        this.pageSize,
        this.keyword
      );
      console.log(this.pageNum);
      this.poetryList = res.poetry.records;
      this.total = res.poetry.total;
      this.pageNum = res.poetry.current;
      this.pageSize = res.poetry.size;
    },
    async save() {
      if (this.form.id) {
        console.log(this.form);
        const res = await poetry.update(this.form);
        this.$message.success("編輯成功");
        this.dialogVisible = false;
        this.getAll();
        this.clearData();
      } else {
        const res = await poetry.add(this.form);
        this.$message.success("添加成功");
        this.getAll();
        this.clearData();
      }
    },
    async getEditInfo(id) {
      this.dialogVisible = true;
      const { data: res } = await poetry.getById(id);
      this.form = res.poetry;
    },
  },
};
</script>

<style>
</style>
