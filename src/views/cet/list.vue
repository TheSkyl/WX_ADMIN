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
    <el-table :data="cetList" border style="width: 100%">
      <el-table-column prop="headWord" label="单词" width="120" />
      <el-table-column prop="bookId" label="所属类型" width="120" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="deleteCet(scope.row.id)"
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
      <el-col :span="12"> </el-col>
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
          <el-input
            v-model="form.bokkId"
            placeholder="例如：四级词汇"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form.content" label-width="80px">
        <el-form-item label="美音英标">
          <el-input v-model="form.content.word.content.usphone"></el-input>
        </el-form-item>
        <el-form-item label="英音音标">
          <el-input v-model="form.content.word.content.ukphone"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(sentences, index) in form.content.word.content.sentence
            .sentences"
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
import cet from "@/api/cet";
import JsonEditor from "vue-json-ui-editor";

export default {
  components: { JsonEditor },
  data() {
    return {
      cetList: null,
      pageNum: 1,
      pageSize: 12,
      total: 0,
      dialogVisible: false,
      upDialogVisible: false,
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
                    sContent: "",
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
                desc: "同近",
              },
              ukphone: "",
              phrase: {
                phrases: [
                  {
                    pContent: "",
                    pCn: "",
                  },
                ],
                desc: "短语",
              },
              trans: [
                {
                  tranCn: "",
                  pos: "",
                  tranOther: "",
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
    //新添加一行
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
    /**
     * itme:当前数组的索引位置如trans[2] 索引位置就是2
     */
    removeForm(value, item) {
      console.log(item);
      switch (value) {
        case "翻译":
          var index = this.form.content.word.content.trans.indexOf(item);
          if (index !== -1) {
            this.form.content.word.content.trans.splice(index, 1);
          }
          break;
        case "短语":
          var index = this.form.content.word.content.phrase.phrases.indexOf(
            item
          );
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
          var index = this.form.content.word.content.sentence.sentences.indexOf(
            item
          );
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
      var index = this.form.content.word.content.syno.synos[list].hwds.indexOf(
        item
      );
      if (index !== -1) {
        this.form.content.word.content.syno.synos[list].hwds.splice(index, 1);
      }
    },
    /**
     * 删除轮播图
     * id: 图片id
     */
    async deleteCet(id) {
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
      const res = await cet.delById(id);
      this.$message.success("删除信息成功");
      this.getAll();
    },
    //窗口管理触发函数
    addDialogClosed() {
      this.clearData();
    },
    //清楚窗口数据
    clearData() {
      this.dialogVisible = false;
      this.form.title = "";
      this.form.author = "";
      this.form.content = "";
    },
    /**
     * 请求后台轮播图数据，分页请求 
     * pageNum：页码
     * pageSize：每页显示多少
     * 
     */
    async getAll() {
      const { data: res } = await cet.getAll(
        this.pageNum,
        this.pageSize,
      );
      console.log(this.pageNum);
      this.cetList = res.cetList.records;
      this.total = res.cetList.total;
      this.pageNum = res.cetList.current;
      this.pageSize = res.cetList.size;
    },
    /**
     * 添加和编辑
     */
    async save() {
      if (this.form.id) {
        console.log(this.form);
        const res = await cet.update(this.form);
        this.$message.success("编辑成功");
        this.dialogVisible = false;
        this.getAll();
      } else {
        const res = await cet.add(this.form);
        this.$message.success("添加成功");
        this.getAll();
      }
    },
    async getEditInfo(id) {
      this.dialogVisible = true;
      const { data: res } = await cet.getById(id);
      this.form = res.cetList;
    },
   //页码变化
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getAll();
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
