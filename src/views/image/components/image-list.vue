<template>
  <div class="image-list-container">
    <div class="tool-warp">
      <el-radio-group v-model="collect" size="small" @change="loadImages(1)">
        <el-radio-button :label="false">全部({{ totalAll }})</el-radio-button>
        <el-radio-button :label="true">我的收藏</el-radio-button>
      </el-radio-group>
      <el-button v-if="isShowAdd" type="primary" size="small" @click="dialogTableVisible = true">上传</el-button>
    </div>
    <!-- 素材列表 -->
    <el-row :gutter="20" v-loading="loading">
      <el-col v-for="(image, index) in images" :key="image.id" :xs="12" :sm="8" :md="6" :lg="4" :xl="4">
        <div :class="selected === index ? 'image-warp image-warp-active' : 'image-warp'" @click="selected = index">
          <div class="grid-content bg-purple">
            <el-image :src="image.url"></el-image>
          </div>
          <div v-if="isShowAction" class="tools-warp">
            <el-button
              :icon="image.is_collected ? 'iconfont icon-shoucang1' : 'iconfont icon-shoucang'"
              circle
              size="mini"
              :loading="image.loading"
              @click="onCollect(image)"
            ></el-button>
            <el-button icon="iconfont icon-shanchu" circle size="mini" :loading="image.loading" @click="onDelete(image)"></el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 分页器 -->
    <el-pagination
      class="list-pagination"
      background
      layout="prev, pager, next"
      :total="totalCount"
      :hide-on-single-page="true"
      :page-size="pageSize"
      :disabled="loading"
      :current-page.sync="page"
      @current-change="onPageChange"
    >
    </el-pagination>
    <!-- 弹出层 -->
    <el-dialog title="上传素材" :visible.sync="dialogTableVisible" :append-to-body="true" width="40%">
      <!-- <div class="upload-warp"> -->
      <el-upload
        v-if="dialogTableVisible"
        class="upload-warp"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadImgSuccess"
        :on-error="onUploadImgErr"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageList',
  props: {
    // 是否显示上传素材按钮
    isShowAdd: {
      type: Boolean,
      default: true
    },
    // 是否显示收藏删除
    isShowAction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // 获取本地存储中的user信息
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 是否查询收藏的素材列表
      images: [], // 图片素材列表
      dialogTableVisible: false, // 是否显示dialog
      // 图片上传自定义请求头
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalAll: 0, // 未收藏图片总数
      totalCount: 0, // 图片素材总数
      pageSize: 10, // 每页素材数量
      page: 1, // 当前页
      loading: true, // loading加载动画
      selected: null // 图片项是否选中
    }
  },
  created() {
    this.loadImages(1)
  },
  methods: {
    // 获取图片素材列表
    loadImages(page) {
      // 开启loading
      this.loading = true
      // 重置高亮页码，防止数据和高亮页码不一致
      this.page = page
      getImages({
        collect: this.collect, // 是否收藏
        page, // 第几页
        per_page: this.pageSize // 每页条数
      }).then((res) => {
        // 关闭loading
        this.loading = false
        const { total_count: totalCount, results } = res.data.data
        // 手动为每个图片收藏按钮添加loading状态
        results.forEach((img) => {
          img.loading = false
        })
        this.images = results
        this.totalCount = totalCount
        if (this.collect === false) {
          this.totalAll = totalCount
        }
      })
    },
    // 上传素材成功
    onUploadImgSuccess() {
      // 文件上传成功
      // 上传成功
      this.$notify({
        title: '成功',
        message: '图片上传成功',
        type: 'success'
      })
      // 关闭文件上传对话框
      this.dialogTableVisible = false
      // 更新素材列表
      this.loadImages(false)
    },
    // 上传素材失败
    onUploadImgErr() {
      // 上传失败
      this.$notify({
        title: '错误',
        message: '图片上传失败',
        type: 'error'
      })
    },
    // 分页器页码发生变化
    onPageChange(page) {
      this.loadImages(page)
    },
    // 收藏与取消收藏
    onCollect(image) {
      // 开启loading
      image.loading = true
      collectImage(image.id, !image.is_collected)
        .then((res) => {
          image.is_collected = !image.is_collected
          // 关闭loading
          image.loading = false
          this.$notify({
            title: '成功',
            message: image.is_collected ? '收藏成功' : '已取消收藏',
            type: 'success'
          })
        })
        .catch(() => {
          // 关闭loading
          image.loading = false
          this.$notify({
            title: '错误',
            message: '收藏失败',
            type: 'error'
          })
        })
    },
    // 删除素材
    onDelete(image) {
      // 开启loading
      image.loading = true
      deleteImage(image.id)
        .then((res) => {
          // 关闭loading
          image.loading = false
          // 刷新素材列表
          this.loadImages(this.page)
          this.$notify({
            title: '成功',
            message: '素材删除成功',
            type: 'success'
          })
        })
        .catch(() => {
          // 关闭loading
          image.loading = false
          this.$message({
            type: 'error',
            message: '删除失败'
          })
          this.$notify({
            title: '错误',
            message: '素材删除失败',
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.image-list-container {
  .tool-warp {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-row {
    margin-top: 20px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
    text-align: center;
    overflow: hidden;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    padding: 10px;
    .image-warp {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid transparent;
      // border: 2px solid orange;
      overflow: hidden;
      transition: all 0.2s;
      position: relative;
      &:hover {
        border: 2px solid var(--themeColor);
      }
      .tools-warp {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        display: none;
        transition: all 0.5s;
      }
      &:hover .tools-warp {
        display: block;
        display: flex;
        justify-content: right;
        align-items: center;
        .el-button {
          background-color: transparent;
          border: none;
          margin-bottom: 5px;
          margin-right: 5px;
          margin-left: 0;
          font-size: 14px;
          color: var(--themeColor);
          &:hover {
            background-color: var(--themeColor);
            color: #fff;
          }
          &:first-child {
            margin-right: 2px;
          }
        }
      }
    }
    .image-warp-active {
      border: 2px solid var(--themeColor);
      .tools-warp {
        display: block;
        display: flex;
        justify-content: right;
        align-items: center;
        .el-button {
          background-color: transparent;
          border: none;
          margin-bottom: 5px;
          margin-right: 5px;
          margin-left: 0;
          font-size: 14px;
          color: var(--themeColor);
          &:hover {
            background-color: var(--themeColor);
            color: #fff;
          }
          &:first-child {
            margin-right: 2px;
          }
        }
      }
    }
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .list-pagination {
    margin-top: 10px;
    text-align: right;
  }
}
/deep/.el-dialog__body {
  text-align: center;
}
</style>
