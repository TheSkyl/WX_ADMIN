<template>
  <dir id="app">
    <el-input
      v-model="keyword"
      placeholder="请输入内容"
      style="width: 200px"
    ></el-input
    ><el-button type="primary" icon="el-icon-search" @click="getAll"
      >搜索</el-button
    >
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <el-table :data="bannerList" border style="width: 100%">
      <el-table-column prop="headWord" label="单词" width="120" />
      <el-table-column prop="bookId" label="所属类型" width="120" />
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
    <el-row>
      <el-col :span="12">
        <!-- <el-card class="form">
          <json-editor ref="JsonEditor" :schema="schema" v-model="model">
            <button @click="submit">submit</button>
            <button @click="reset">Reset</button>
          </json-editor>
        </el-card> -->
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Model</span>
          </div>
          <pre class="json">{{ jsonString }}</pre>
        </el-card>
        <br />
      </el-col>
    </el-row>

    <el-dialog
      id="test"
      title="添加单词"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="单词">
          <el-input v-model="form.headWord"></el-input>
        </el-form-item>
        <el-form-item label="所属类型">
          <el-input v-model="form.bokkId" placeholder="例如：四级词汇"></el-input>
        </el-form-item>
      </el-form>
      //content json 数据
      <el-form ref="form" :model="form.content" label-width="80px">
        <el-form-item label="美音英标">
          <el-input v-model="form.content.word.content.usphone"></el-input>
        </el-form-item>
        <el-form-item label="英音音标">
          <el-input v-model="form.content.word.content.ukphone"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(sentences, index) in form.content.word.content.sentence.sentences"
          :label="'例句' + (index + 1)"
          :key="sentences.key"
          :rules="{ required: true, message: '内容不能为空', trigger: 'blur' }"
        >
          <el-input v-model="sentences.sContent"></el-input>
          <el-input v-model="sentences.sCn" placeholder="例句翻译"></el-input>
          <a
            class="remove-item"
            v-show="form.content.word.content.sentence.sentences.length > 1"
            @click.prevent="removeForm('例句', sentences)"
            ><i class="el-icon-close"></i
          ></a>
        </el-form-item>
        <el-form-item
          v-for="(synos, index) in form.content.word.content.syno.synos"
          :label="'近义词' + (index + 1)"
          :key="synos.key"
          :rules="{ required: true, message: '内容不能为空', trigger: 'blur' }"
        >
          <el-form-item
            v-for="(hwds, indexs) in synos.hwds"
            :label="'近义词' + (indexs + 1)"
            :key="hwds.key"
            :rules="{
              required: true,
              message: '内容不能为空',
              trigger: 'blur',
            }"
          >
            <el-input
              v-model="hwds.w"
              placeholder="近义词"
              value="默认"
            ></el-input>
            <a
              class="remove-item"
              v-show="synos.hwds.length > 1"
              @click.prevent="removeHwds(index, hwds)"
              ><i class="el-icon-close"></i
            ></a>
          </el-form-item>
          <el-input v-model="synos.pos" placeholder="近义词词性"></el-input>
          <el-input v-model="synos.tran" placeholder="近义词翻译"></el-input>
          <a
            class="remove-item"
            v-show="form.content.word.content.syno.synos.length > 1"
            @click.prevent="removeForm('近义词', synos)"
            ><i class="el-icon-close"></i
          ></a>
          <el-button @click="addHwds(index)">添加近义词</el-button>
        </el-form-item>
        <el-form-item
          v-for="(phrases, index) in form.content.word.content.phrase.phrases"
          :label="'短语' + (index + 1)"
          :key="phrases.key"
          :rules="{ required: true, message: '内容不能为空', trigger: 'blur' }"
        >
          <el-input v-model="phrases.pContent" placeholder="短语"></el-input>
          <el-input v-model="phrases.pCn" placeholder="短语翻译"></el-input>
          <a
            class="remove-item"
            v-show="form.content.word.content.phrase.phrases.length > 1"
            @click.prevent="removeForm('短语', phrases)"
            ><i class="el-icon-close"></i
          ></a>
        </el-form-item>
        <el-form-item
          v-for="(trans, index) in form.content.word.content.trans"
          :label="'翻译' + (index + 1)"
          :key="trans.key"
          :rules="{ required: true, message: '内容不能为空', trigger: 'blur' }"
        >
          <el-input v-model="trans.tranCn" placeholder="短语"></el-input>
          <el-input v-model="trans.tranOther" placeholder="英语释意"></el-input>
          <el-input v-model="trans.pos" placeholder="词性"></el-input>
          <a
            class="remove-item"
            v-show="form.content.word.content.trans.length > 1"
            @click.prevent="removeForm('翻译', trans)"
            ><i class="el-icon-close"></i
          ></a>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addForm('例句')">添加例句</el-button>
        <el-button @click="addForm('近义词')">添加近义词</el-button>
        <el-button @click="addForm('短语')">添加短语</el-button>
        <el-button @click="addForm('翻译')">添加翻译</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </dir>
</template>

<script>
import banner from "@/api/cet";
import JsonEditor from "vue-json-ui-editor";
import schema from "../cet/schema/newsletter";

export default {
  components: { JsonEditor },
  data() {
    return {
      schema: schema,
      // data
    //   model: {
    //     word: {
    //       content: {
    //         sentence: {
    //           sentences: [
    //             {
    //               sContent: "She asked him to leave, but he refused.",
    //               sCn: "她叫他走，但他不肯。",
    //             },
    //             {
    //               sContent:
    //                 "When he offered all that money, I could hardly refuse (= could not refuse ) , could I?",
    //               sCn: "他愿意给那么多钱，我怎么可能拒绝呢？",
    //             },
    //           ],
    //           desc: "例句",
    //         },
    //         usphone: "ri'fjʊz",
    //         syno: {
    //           synos: [
    //             {
    //               pos: "n",
    //               tran: "垃圾；[环境]废物",
    //               hwds: [
    //                 {
    //                   w: "garbage",
    //                 },
    //               ],
    //             },
    //           ],
    //           desc: "同近",
    //         },
    //         ukphone: "rɪ'fjuːz",
    //         phrase: {
    //           phrases: [
    //             {
    //               pContent: "municipal refuse",
    //               pCn: "城市垃圾",
    //             },
    //           ],
    //           desc: "短语",
    //         },
    //         trans: [
    //           {
    //             tranCn: "拒绝",
    //             pos: "v",
    //             tranOther:
    //               "to say firmly that you will not do something that someone has asked you to do",
    //           },
    //         ],
    //       },
    //     },
    //   },
      bannerList: null,
      pageNum: 1,
      pageSize: 12,
      total: 0,
      dialogVisible: false,
      dialogImageUrl: "",
      upDialogVisible: false,
      bannerDefaultFile: [],
      keyword: "",
      form: {
        headWord: "",
        bookName: "",
        content: {
          word: {
            content: {
              sentence: {
                sentences: [
                  {
                    sContent: "",
                    sCn: "",
                  },
                  {
                    sContent:
                      "",
                    sCn: "",
                  },
                ],
                desc: "例句",
              },
              usphone: "",
              syno: {
                synos: [
                  {
                    pos: "",
                    tran: "",
                    hwds: [
                      {
                        w: "",
                      },
                    ],
                  },
                ],
                desc: "",
              },
              ukphone: "",
              phrase: {
                phrases: [
                  {
                    pContent: "",
                    pCn: "",
                  },
                ],
                desc: "",
              },
              trans: [
                {
                  tranCn: "",
                  pos: "",
                  tranOther:
                    "",
                },
              ],
            },
          },
        },
      },
    };
  },
  computed: {
    jsonString() {
      return JSON.stringify(this.form.content, null, 2).trim();
    },
  },
  created() {
    // 挂载完成后启动
    this.getAll();
  },
  methods: {
    addForm(value) {
      switch (value) {
        case "翻译":
          this.form.content.word.content.trans.push({
            tranCn: "",
            pos: "",
            tranOther: "",
          });
          break;
        case "短语":
          this.form.content.word.content.phrase.phrases.push({
            pContent: "",
            pCn: "",
          });
          break;
        case "近义词":
          this.form.content.word.content.syno.synos.push({
            pos: "",
            tran: "",
            hwds: [],
          });
          break;
        case "例句":
          this.form.content.word.content.sentence.sentences.push({
            sContent: "",
            sCn: "",
          });
          break;
        default:
          break;
      }
    },
    removeForm(value, item) {
      switch (value) {
        case "翻译":
          var index = this.form.content.word.content.trans.indexOf(item);
          if (index !== -1) {
            this.form.content.word.content.trans.splice(index, 1);
          }
          break;
        case "短语":
          var index = this.form.content.word.content.phrase.phrases.indexOf(item);
          if (index !== -1) {
            this.form.content.word.content.phrase.phrases.splice(index, 1);
          }
          break;
        case "近义词":
          var index = this.form.content.word.content.syno.synos.indexOf(item);
          if (index !== -1) {
            this.form.content.word.content.syno.synos.splice(index, 1);
          }
          break;
        case "例句":
          var index = this.form.content.word.content.sentence.sentences.indexOf(item);
          if (index !== -1) {
            this.form.content.word.content.sentence.sentences.splice(index, 1);
          }
          break;
        default:
          break;
      }
    },
    addHwds(list) {
      this.form.content.word.content.syno.synos[list].hwds.push({
        w: "",
      });
    },
    removeHwds(list, item) {
      var index = this.form.content.word.content.syno.synos[list].hwds.indexOf(item);
      if (index !== -1) {
        this.form.content.word.content.syno.synos[list].hwds.splice(index, 1);
      }
    },
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
      this.form.title = "";
      this.form.author = "";
      this.form.content = "";
      this.dialogImageUrl = "";
      this.bannerDefaultFile = [];
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
        // this.clearData();
      } else {
        // this.form["content"] = JSON.stringify(this.form.content.;
        // this.form.contentValue = JSON.stringify(this.form.content.;
        const res = await banner.add(this.form);
        this.$message.success("添加成功");
        this.getAll();
        // this.clearData();
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
    submit(_e) {
      this.$refs.JsonEditor.form().validate((valid) => {
        if (valid) {
          // this.form.content.contains the valid data according your JSON Schema.
          // You can submit your model to the server here
          // eslint-disable-next-line no-console
        //   console.log("model", JSON.stringify(this.form.content);
          this.$refs.JsonEditor.clearErrorMessage();
        } else {
          this.$refs.JsonEditor.setErrorMessage(
            "Please fill out the required fields"
          );
          return false;
        }
      });
    },
    reset() {
      this.$refs.JsonEditor.reset();
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
  },
};
</script>

<style>
.form {
  text-align: left;
  width: 90%;
  margin: auto;
}
h2 {
  font-size: 1.7em;
  text-align: center;
  margin-top: 0;
  margin-bottom: 0.2em;
}
h2 + small {
  display: block;
  text-align: center;
  margin-bottom: 1.2em;
}
small {
  line-height: 20px;
  display: block;
}
.el-alert {
  margin-bottom: 15px;
}
.el-form .sub {
  margin-left: 10%;
}
.json {
  text-align: left;
}
</style>
