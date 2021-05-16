<template>
  <dir id="app">
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table :data="poetryAuthorList" border style="width: 100%">
      <el-table-column prop="name" label="诗人" width="120" />
      <el-table-column prop="intro" label="简介" width="300" />
      <el-table-column label="图片" width="200px">
        <template slot-scope="scope">
          <el-image
            :preview-src-list="[scope.row]"
            style="height: 90px; width: 60px"
            fit="fill"
            v-if="scope.row.children || scope.row.children === null"
            :src="'http://localhost:53021/web' + scope.row.imgLink"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deletePoetryAuthor(scope.row.id)"
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
      title="诗词"
      :visible.sync="dialogVisible"
      width="70%"
      @close="addDialogClosed"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="作者">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.intro"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="imgLink">
          <el-upload
            action="http://localhost:53021/web/banner/upload"
            list-type="picture-card"
            accept="image/jpeg,image/gif,image/png,image/bmp"
            :limit="1"
            :file-list="poetryAuthorDefaultFile"
            :before-remove="beforeRemove"
            :on-success="handleUploadSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="upDialogVisible">
            <img width="50px" :src="dialogImageUrl" alt="" />
          </el-dialog>
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
import poetryApi from "@/api/poetry";
import { quillEditor } from "vue-quill-editor";

export default {
  data() {
    return {
      poetryAuthorList: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      articleDialogVisible: false,
      dialogImageUrl: "",
      upDialogVisible: false,
      poetryAuthorDefaultFile: [],
      form: {
        name: "",
        intro: "",
      },
    };
  },
  created() {
    // 挂载完成后启动
    this.getAll();
  },
  methods: {
    async deletePoetryAuthor(id) {
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
      const res = await poetryApi.delById(id);
      this.$message.success("删除信息成功");
      this.getList();
    },
    addDialogClosed() {
      this.clearData();
    },
    clearData() {
      this.dialogVisible = false;
      this.form.name = "";
      this.form.intro = "";
      this.dialogImageUrl = "";
      this.poetryAuthorDefaultFile = [];
    },
    //上传图片成功回调函数
    handleUploadSuccess(response, file, fileList) {
      this.form.imgLink = response;
      this.$message.success("上传成功");
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getAll();
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.upDialogVisible = true;
    },
    async getAll() {
      const { data: res } = await poetryApi.getAll(
        this.pageNum,
        this.pageSize,
        this.keyword
      );
      this.poetryAuthorList = res.poetryAuthor.records;
      this.total = res.poetryAuthor.total;
      this.pageNum = res.poetryAuthor.current;
      this.pageSize = res.poetryAuthor.size;
    },
    async save() {
      if (this.form.id) {
        const res = await poetryApi.update(this.form);
        this.$message.success("編輯成功");
        this.dialogVisible = false;
        this.clearData();
        this.getList();
      } else {
        const res = await poetryApi.add(this.form);
        this.$message.success("添加成功");
        this.clearData();
      }
    },
    async getEditInfo(id) {
      this.dialogVisible = true;
      const { data: res } = await poetryApi.getById(id);
      console.log("cdd" + res);
      this.poetryAuthorDefaultFile.push({
        url: "http://localhost:53021/web" + res.poetryAuthor.imgLink,
      });
      this.form = res.poetryAuthor;
      this.dialogImageUrl = res.poetryAuthor.imgLink;
    },
  },
};
</script>

<style>
.edit_container {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.ql-editor {
  height: 400px;
}
</style>
