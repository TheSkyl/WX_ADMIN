<template>
  <dir id="app">
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table :data="bannerList" border style="width: 100%">
      <el-table-column prop="name" label="名字" width="120" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="sequence" label="顺序" width="120" />
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">
          <el-switch
            @change="changeBannerStatus(scope.row)"
            v-model="scope.row.ban"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200px">
        <template slot-scope="scope">
          <el-image
            :preview-src-list="[scope.row]"
            style="height: 100px"
            fit="fill"
            :src="'http://localhost:53021/web' + scope.row.imgLink"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
      title="日记表"
      :visible.sync="dialogVisible"
      width="70%"
      @close="addDialogClosed"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="form.sequence"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imgLink">
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
import banner from "@/api/learingBanner";

export default {
  data() {
    return {
      bannerList: null,
      pageNum: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      dialogImageUrl: "",
      upDialogVisible: false,
      bannerDefaultFile: [],
      queryInfo: {
        keyword: "",
      },
      form: {},
    };
  },
  created() {
    // 挂载完成后启动
    this.getAll();
  },
  methods: {
    //删除
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
      this.getList();
    },
    addDialogClosed() {
      this.clearData();
    },
    clearData() {
      this.dialogVisible = false;
      this.form = "";
      this.dialogImageUrl = "";
      this.bannerDefaultFile = [];
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.upDialogVisible = true;
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getAll();
    },
    //请求所有
    async getAll() {
      const { data: res } = await banner.getAll(
        this.pageNum,
        this.pageSize,
        this.queryInfo.keyword
      );
      console.log(this.pageNum);
      this.bannerList = res.page.records;
      this.total = res.page.total;
      this.pageNum = res.page.current;
      this.pageSize = res.page.size;
    },
    //添加和编辑
    async save() {
      if (this.form.id) {
        const res = await banner.update(this.form);
        this.$message.success("编辑成功");
        this.dialogVisible = false;
        this.clearData();
        this.getList();
      } else {
        const res = await banner.add(this.form);
        this.$message.success("添加成功");
        this.clearData();
      }
    },
    //请求数据
    async getEditInfo(id) {
      this.dialogVisible = true;
      const { data: res } = await banner.getById(id);
      this.bannerDefaultFile.push({
        url: "http://localhost:53021/web" + res.banner.imgLink,
      });
      this.form = res.banner;
      this.dialogImageUrl = res.banner.link;
    },
    //状态修改
    async changeBannerStatus(list) {
      const res = await banner.changeStatus(list.id, list.ban);
      if (res.code !== 20000) {
        list.ban = !list.ban;
      }
      this.$message.success("修改状态成功！");
    },
  },
};
</script>

<style>
</style>
