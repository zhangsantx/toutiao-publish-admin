<template>
  <div class="publish-container">
    <!-- 编辑区域 -->
    <div class="article-pub-card">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <el-form ref="publish-from" :rules="articleRules" :model="article" label-width="80px" size="small">
            <el-form-item label="文章标题" prop="title">
              <el-input placeholder="请输入文章标题" v-model="article.title" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="正文" prop="content">
              <el-tiptap
                class="tiptap-warp"
                v-model="article.content"
                :charCounterCount="false"
                :extensions="extensions"
                lang="zh"
                placeholder="请输入文章内容"
              />
            </el-form-item>
            <el-form-item label="分类专栏" prop="channel_id">
              <el-select v-model="article.channel_id" placeholder="请选择分类专栏">
                <el-option v-for="channel in channels" :key="channel.id" :label="channel.name" :value="channel.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="展示封面">
              <el-radio-group v-model="article.cover.type">
                <el-radio :label="1">单图</el-radio>
                <el-radio :label="3">三图</el-radio>
                <el-radio :label="0">无封面</el-radio>
                <el-radio :label="-1">自动</el-radio>
              </el-radio-group>
              <!-- 选择封面 -->
              <!-- <div class="upload-cover-warp" v-if="article.cover.type > 0">
                <upload-cover
                  v-for="(cover, index) in article.cover.type"
                  :key="cover"
                  @update-cover="onUpdateCover(index, $event)"
                  :cover-image="article.cover.images[index]"
                ></upload-cover> -->
              <div class="upload-cover-warp" v-if="article.cover.type > 0">
                <upload-cover v-for="(cover, index) in article.cover.type" :key="cover" v-model="article.cover.images[index]"></upload-cover>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onPublish(false)">{{ $route.query.id ? '确认修改' : '立即发布' }}</el-button>
              <el-button @click="onPublish(true)">保存为草稿</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <!-- 预览区域 -->
    <div class="article-show-card">
      <div class="article-show">文章预览</div>
      <el-card shadow="never">
        <div class="article-title">
          {{ article.title || '请输入文章标题' }}
          <div class="article-author">
            <div class="author-cover">
              <img class="author-cover-img" :src="user.photo ? user.photo : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" alt="" />
              <span class="author-name">{{ user.name }}</span>
            </div>
          </div>
        </div>
        <div class="article-content">
          <div class="ql-editor" v-html="article.content || '请输入文章内容'"></div>
        </div>
      </el-card>
      <div class="article-case">
        <!-- 无图 -->
        <div v-if="article.cover.type === 0" class="case-warp case-none">{{ article.title || '标题' }}</div>
        <!-- 单图 -->
        <div v-if="article.cover.type === -1" class="case-warp case-one">
          <div class="text-warp">{{ article.title || '标题' }}</div>
          <div class="img-warp">
            <img :src="article.cover.images[0]" />
          </div>
        </div>
        <!-- 单图 -->
        <div v-if="article.cover.type === 1" class="case-warp case-one">
          <div class="text-warp">{{ article.title || '标题' }}</div>
          <div class="img-warp">
            <img :src="article.cover.images[0]" />
          </div>
        </div>
        <!-- 三图 -->
        <div v-if="article.cover.type === 3" class="case-warp case-three">
          <div class="text-warp">{{ article.title || '标题' }}</div>
          <div class="img-warp">
            <div class="img-content"><img :src="article.cover.images[0]" /></div>
            <div class="img-content"><img :src="article.cover.images[1]" /></div>
            <div class="img-content"><img :src="article.cover.images[2]" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import { getArticleChanels, addArticle, getArticle, updateArticle } from '@/api/article'
import { uploadImage } from '@/api/image'
import {
  ElementTiptap,
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Link,
  Image,
  CodeBlock,
  Blockquote,
  TodoItem,
  TodoList,
  TextAlign,
  FontSize,
  FontType,
  Fullscreen,
  TextHighlight,
  TextColor,
  FormatClear,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  History,
  TrailingNode,
  HardBreak,
  HorizontalRule,
  LineHeight,
  Indent
} from 'element-tiptap'
import UploadCover from './components/upload-cover'
export default {
  name: 'PublishIndex',
  data() {
    return {
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          {
            // 自定义富文本编辑器格式校验
            validateContent(rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          }
        ],
        channel_id: [{ required: true, message: '请选择分类专栏' }]
      },
      user: {},
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        // 文章封面
        cover: {
          type: 0, // 封面类型(-1 自动,0 无封面,1 单图,3 三图)
          images: [] // 图片地址
        },
        channel_id: null // 文章分类id
      },
      channels: [], // 文章分类
      extensions: [
        new Doc(), // 必须项
        new Text(), // 必须项
        new Paragraph(), // 必须项
        new Heading({ level: 6 }), // 标题
        new Bold({ bubble: true }), // 加粗 bubble: true 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 下划线 bubble: true, menubar: false 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic({ bubble: true }), // 斜体
        new Strike({ bubble: true }), // 删除线
        new ListItem(), // 使用列表必须项
        new BulletList({ bubble: true }), // 无序列表
        new OrderedList({ bubble: true }), // 有序列表
        new Link(), // 链接
        new Image({
          // 自定义图片上传(默认会把图片生成base64字符串和内容存储到一起)
          // 返回一个 Promise<url>
          uploadRequest(file) {
            // 如果接口要求 Content-Type 是 multipart/form-data，则请求体必须使用 FormData
            const fd = new FormData()
            fd.append('image', file)
            // 调用服务端接口上传图片并返回图片url
            return uploadImage(fd).then((res) => {
              return res.data.data.url
            })
          }
        }), // 图片
        new CodeBlock({ bubble: true }), // 代码块
        new Blockquote(), // 引用
        new TodoItem(), // 任务列表必须项
        new TodoList(), // 任务列表
        new TextAlign({ bubble: true }), // 文本对齐方式
        new FontSize({ bubble: true }), // 字号
        new FontType({ bubble: true }), // 字体
        new Fullscreen(), // 全屏
        new TextHighlight({ bubble: true }), // 文本高亮
        new TextColor({ bubble: true }), // 文本颜色
        new FormatClear({ bubble: true }), // 清除格式
        new Table({ resizable: true }), // 表格
        new TableHeader(), // 表格必须项
        new TableCell(), // 表格必须项
        new TableRow(), // 表格必须项
        new History(), // 撤销
        new TrailingNode(), // 重做
        new HardBreak(), // 分割线
        new HorizontalRule(), // 行距
        new LineHeight(), // 增加缩进
        new Indent() // 减少缩进
      ]
    }
  },
  created() {
    this.loadUserProfile()
    this.loadChannels()

    // 发布和修改文章共用同一个页面，如果路由路径中有id则为修改文章，此时展示文章数据
    if (this.$route.query.id) {
      this.loadArticles()
    }
  },
  methods: {
    // 获取用户信息
    loadUserProfile() {
      getUserProfile().then((res) => {
        this.user = res.data.data
      })
    },
    // 获取文章分类
    loadChannels() {
      getArticleChanels().then((res) => {
        this.channels = res.data.data.channels
      })
    },
    // 发布/修改文章
    onPublish(draft = false) {
      // 表单验证
      this.$refs['publish-from'].validate((valid) => {
        if (!valid) {
          // 验证失败
          return 0
        } else {
          // 如果是修改文章则修改文章否则为发布文章
          if (this.$route.query.id) {
            // 修改文章
            const articleId = this.$route.query.id
            this.$confirm(draft ? '确认要保存为草稿吗？' : '确认要修改文章吗？', '修改', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 修改文章
              updateArticle(articleId, this.article, draft)
                .then(() => {
                  this.$notify({
                    title: '成功',
                    message: draft ? '已存入草稿' : '修改成功',
                    type: 'success'
                  })
                  // 跳转内容管理页面
                  this.$router.push('/article')
                })
                .catch(() => {
                  this.$notify({
                    title: '错误',
                    message: '修改失败',
                    type: 'error'
                  })
                })
            })
          } else {
            this.$confirm(draft ? '确认要保存为草稿吗？' : '确认要发布文章吗？', '发布', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 发布文章
              addArticle(this.article, draft)
                .then(() => {
                  this.$notify({
                    title: '成功',
                    message: draft ? '已存入草稿' : '发布成功',
                    type: 'success'
                  })
                  // 跳转内容管理页面
                  this.$router.push('/article')
                })
                .catch(() => {
                  this.$notify({
                    title: '错误',
                    message: '发布失败',
                    type: 'error'
                  })
                })
            })
          }
        }
      })
    },
    // 获取文章内容信息(修改文章)
    loadArticles() {
      getArticle(this.$route.query.id).then((res) => {
        this.article = res.data.data
      })
    },
    // 接收子组件上传成功的url
    onUpdateCover(index, url) {
      // 将url保存到images中
      this.article.cover.images[index] = url
    }
  },
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  }
}
</script>

<style lang="less" scoped>
.publish-container {
  // height: 100%;
  height: 90vh;
  display: flex;
  .article-pub-card {
    flex: 6;
    margin-right: 10px;
    // overflow-y: auto;
    // height: 90vh;
    height: 100%;

    .tiptap-warp {
      height: 55vh;
      padding-bottom: 5px;
      // background-color: orange;
    }
    /deep/.el-tiptap-editor .border-top-radius {
      border-radius: 5px 5px 0 0;
      border-color: #dcdfe6;
    }
    /deep/.el-tiptap-editor > .el-tiptap-editor__content {
      padding: 10px 15px;
      border-color: #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 5px;
      border-radius: 0 0 5px 5px;
    }
    .upload-cover-warp {
      display: flex;
    }
  }
  .article-show-card {
    flex: 3;
    // height: 90vh;
    height: 97%;
    position: relative;
    overflow: auto;
    overflow: hidden;
    padding: 10px 0 250px 0;
    background-color: #fff;
    border-radius: 5px;
    .el-card {
      border: none;
      border-radius: 5px;
      overflow-y: auto;
      margin-top: 80px;
      padding-top: 0px;
      height: 100%;
    }
    .article-show {
      padding: 5px;
      font-size: 17px;
      border-left: 3px solid var(--themeColor);
    }
    .article-title {
      position: absolute;
      top: 50px;
      left: 0;
      width: 100%;
      font-size: 18px;
      padding: 5px 20px;
      font-weight: 700;
      background-color: #fff;
      .article-author {
        .author-cover {
          margin-top: 5px;
          display: flex;
          align-items: center;
          .author-cover-img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 5px;
          }
          span {
            font-size: 16px;
            font-weight: 400;
          }
        }
      }
    }
    .article-content {
      padding: 0 20px;
      overflow: hidden;
    }
  }
  .article-case {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .case-warp {
      width: 80%;
      display: flex;
      background-color: #fff;
      border-radius: 10px;
      padding: 10px 10px;
      // 溢出显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
    }
    .case-none {
      height: 60px;
      align-items: center;
    }
    .case-one {
      width: 80%;
      height: 100px;
      display: flex;
      .text-warp {
        flex: 3;
        margin-right: 8px;
      }
      .img-warp {
        flex: 1.5;
        height: 100%;
        overflow: hidden;
        background-color: #dcdcdc;
        img {
          height: 100%;
          background-size: cover;
        }
      }
    }
    .case-three {
      height: 120px;
      display: flex;
      flex-direction: column;
      .text-warp {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .img-warp {
        flex: 3;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        margin-top: 5px;
        .img-content {
          flex: 1;
          width: 33%;
          height: 100%;
          margin-right: 5px;
          background-color: #dcdcdc;
          overflow: hidden;
          background-size: cover;
          img {
            width: 100%;
            // height: 100%;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
