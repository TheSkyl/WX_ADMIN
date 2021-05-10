<template>
  <dir id="app">
    <el-input
      v-model="keyword"
      placeholder="请输入内容"
      style="width: 200px"
    ></el-input
    ><el-button type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table :data="bannerList" border style="width: 100%">
      <el-table-column prop="headWord" label="单词" width="120" />
      <!-- <el-table-column prop="content" label="诗句" width="120" /> -->
      <el-table-column prop="bookName" label="所属类型" width="120" />
      <!-- <el-table-column prop="sequence" label="顺序" width="300" /> -->
      <!-- <el-table-column label="图片" width="200px">
        <template slot-scope="scope">
          <el-image
            :preview-src-list="[scope.row]"
            style="height: 100px"
            fit="fill"
            :src="'http://localhost:53021/web' + scope.row.link"
          ></el-image>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="deleteBanner(scope.row.id)"
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
        <!-- <el-form-item label="顺序">
          <el-input v-model="form.sequence"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="图片" prop="link">
          <el-upload
            action="http://localhost:53021/web/banner/upload"
            list-type="picture-card"
            accept="image/jpeg,image/gif,image/png,image/bmp"
            :limit="1"
            :file-list="bannerDefaultFile"
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
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </dir>
</template>

<script>
import banner from "@/api/cet";

export default {
  data() {
    return {
      bannerList: null,
      pageNum: 1,
      pageSize: 13,
      total: 0,
      dialogVisible: false,
      dialogImageUrl: "",
      upDialogVisible: false,
      bannerDefaultFile: [],
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
    async deleteBanner(id) {
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
      const res = await banner.delById(id);
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
      this.dialogImageUrl = "";
      this.bannerDefaultFile = [];
    },
    //上传图片成功回调函数
    handleUploadSuccess(response, file, fileList) {
      console.log(response);
      this.form.link = response;
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
      console.log(file);
      this.upDialogVisible = true;
    },
    async getAll() {
      const { data: res } = await banner.getAll(
        this.pageNum,
        this.pageSize,
        this.keyword
      );
      console.log(this.pageNum);
      this.bannerList = res.poetry.records;
      this.total = res.poetry.total;
      this.pageNum = res.poetry.current;
      this.pageSize = res.poetry.size;
      console.log(this.bannerList);
      // this.
    },
    async save() {
      if (this.form.id) {
        console.log(this.form);
        const res = await banner.update(this.form);
        this.$message.success("編輯成功");
        this.dialogVisible = false;
        this.getAll();
        this.clearData();
      } else {
        const res = await banner.add(this.form);
        this.$message.success("添加成功");
        this.getAll();
        this.clearData();
      }
    },
    async getEditInfo(id) {
      this.dialogVisible = true;
      const { data: res } = await banner.getById(id);
      console.log(res);
      this.form = res.poetry;
      //   this.dialogImageUrl = res.banner.link;
      //   console.log(this.dialogImageUrl);
    },
  },
};
</script>

<style>
</style>
