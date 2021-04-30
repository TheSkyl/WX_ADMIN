<template>
  <dir id="app">
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table
      :data="novelList"
      border
      style="width: 100%"
      default-expand-all
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="title" label="书名" width="120" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="sequence" label="顺序" width="300" />
      <el-table-column prop="briefIntroduction" label="简介" width="300" />
      <el-table-column label="章节">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            v-if="scope.row.children || scope.row.children === null"
            >一级故障</el-tag
          >
          <el-tag size="mini" type="warning" prop="chapter" v-else
            >{{ scope.row.chapter }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200px">
        <template slot-scope="scope">
          <el-image
            :preview-src-list="[scope.row]"
            style="height: 50px"
            fit="fill"
            v-if="scope.row.children || scope.row.children === null"
            :src="'http://localhost:53021/web' + scope.row.imgLink"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="日期" width="150" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="
              scope.row.children || scope.row.children === null
                ? deleteNovel(scope.row.id)
                : deleteAritcle(scope.row.id)
            "
            >删除</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="
              scope.row.children || scope.row.children === null
                ? getEditInfo(scope.row.id)
                : getArticlInfo(scope.row.id)
            "
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="addArticle(scope.row.id)"
            v-if="scope.row.children || scope.row.children === null"
            >添加章节</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      id="test"
      title="小说"
      :visible.sync="dialogVisible"
      width="70%"
      @close="addDialogClosed"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="书名">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.briefIntroduction"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="form.sequence"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="link">
          <el-upload
            action="http://localhost:53021/web/banner/upload"
            list-type="picture-card"
            accept="image/jpeg,image/gif,image/png,image/bmp"
            :limit="1"
            :file-list="novelDefaultFile"
            :before-remove="beforeRemove"
            :on-success="handleUploadSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="upDialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      id="test"
      title="章节添加"
      :visible.sync="articleDialogVisible"
      width="70%"
      @close="articleAddDialogClosed"
    >
      <el-form ref="form" :model="articleForm" label-width="80px">
        <el-form-item label="章节名">
          <el-input v-model="articleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <quill-editor
            v-model="articleForm.article"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item label="章节">
          <el-input v-model="articleForm.chapter"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="articleSave">确 定</el-button>
      </span>
    </el-dialog>
  </dir>
</template>

<script>
import novelApi from "@/api/novel";
import { quillEditor } from "vue-quill-editor";

export default {
  data() {
    return {
      novelList: [],
      articleForm: {
        novelId:"",
        title:"",
        article:"",
        chapter:"",
        type:0
      },
      content: "welcome to tinymce!",
      editorOption: {},
      dialogVisible: false,
      articleDialogVisible: false,
      dialogImageUrl: "",
      upDialogVisible: false,
      novelDefaultFile: [],
      form: {},
    };
  },
  created() {
    // 挂载完成后启动
    this.getAll();
  },
  methods: {
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
    },
    async deleteNovel(id) {
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
      const res = await novelApi.delById(id);
      this.$message.success("删除信息成功");
      this.getList();
    },
    articleAddDialogClosed() {
      this.articleForm = "";
    },
    addDialogClosed() {
      this.clearData();
    },
    clearData() {
      this.dialogVisible = false;
      this.form = "";
      this.dialogImageUrl = "";
      this.novelDefaultFile = [];
    },
    //上传图片成功回调函数
    handleUploadSuccess(response, file, fileList) {
      console.log(response);
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
      this.getAll();
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      console.log(file);
      this.upDialogVisible = true;
    },
    async getArticlInfo(id) {
      this.articleDialogVisible = true;
      const { data: res } = await novelApi.getArticle(id);
      this.articleForm = res.article;
      console.log(res);
    },
    async getAll() {
      const { data: res } = await novelApi.getAll();
      console.log(res.novel);
      this.novelList = res.novel;
      console.log(this.novelList);
    },
    async addArticle(id){
      this.articleForm.novelId = id;
      this.articleDialogVisible = true;
    },

    async articleSave() {
      if (this.form.id) {
        await novelApi.updateArticle(this.articleForm);
        this.$message.success("編輯成功");
      }else{
        await novelApi.addArticle(this.articleForm);
        this.$message.success("添加成功");
      }
    },
    async deleteAritcle(id){
      await novelApi.delArticleById(id);
    },
    async save() {
      if (this.form.id) {
        console.log(this.form);
        const res = await novelApi.update(this.form);
        this.$message.success("編輯成功");
        this.dialogVisible = false;
        this.clearData();
        this.getList();
      } else {
        const res = await novelApi.add(this.form);
        this.$message.success("添加成功");
        this.clearData();
      }
    },
    async getEditInfo(id) {
      this.dialogVisible = true;
      const { data: res } = await novelApi.getById(id);
      console.log("cdd" + res);
      this.novelDefaultFile.push({
        url: "http://localhost:53021/web" + res.novel.imgLink,
      });
      this.form = res.novel;
      this.dialogImageUrl = res.novel.imgLink;
      console.log(this.dialogImageUrl);
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
