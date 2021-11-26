<template>
  <div class="upload-cover-container">
    <!-- <div class="cover-warp">+</div> -->
    <!-- <div class="cover-warp" @click="showCoverSelect"> -->
    <!-- <img class="cover-image" src="https://z3.ax1x.com/2021/11/01/IPG7QK.jpg" alt="" /> -->
    <!-- </div> -->
    <div class="cover-warp" @click="showCoverSelect"><img class="cover-image" ref="cover-image" :src="value" alt="" />{{ value ? '' : '+' }}</div>
    <!-- 弹出层 -->
    <el-dialog title="选择封面" :visible.sync="coverSelectDialog" width="50%" :append-to-body="true" @closed="resetUploadImage">
      <span>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="素材库" name="first">
            <image-list :is-show-add="false" :is-show-action="false" ref="image-list"></image-list>
          </el-tab-pane>
          <el-tab-pane label="上传图片" name="second">
            <div class="upload-img-warp">
              <div class="upload-btns">
                <input type="file" name="" ref="upload-cover" hidden @change="onFileChange" />
                <el-button size="small" type="primary" @click="$refs['upload-cover'].click()">上传文件</el-button>
              </div>
              <div class="preview-cover-warp">
                <div v-if="!previewImage">请选择文件</div>
                <img v-else class="preview-cover" :src="previewImage" alt="" />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="coverSelectDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="onUploadCover" :loading="updateCoverLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import ImageList from '@/views/image/components/image-list'
export default {
  name: 'UploadCover',
  props: ['value'],
  data() {
    return {
      coverSelectDialog: false, // 选择封面dialog是否显示
      activeName: 'first',
      previewImage: '', // 上传图片预览
      updateCoverLoading: false // 上传图片loading
    }
  },
  components: {
    ImageList
  },
  methods: {
    showCoverSelect() {
      this.coverSelectDialog = true
    },
    // 上传封面图片-显示预览
    onFileChange() {
      const file = this.$refs['upload-cover']
      // 获取选择的图片 file.files[0]，生成图片URL
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 解决选择相同文件不触发change事件
      // file.value = ''
    },
    // 上传封面图片-上传服务器
    onUploadCover() {
      // 本地上传
      // 判断是否为上传图片且选择了文件
      if (this.activeName === 'second') {
        const file = this.$refs['upload-cover'].files[0]
        if (!file) {
          this.$notify({
            title: '提示',
            message: '请先选择文件',
            type: 'warning'
          })
          return 0
        }
        // 上传文件
        // 开启loading
        this.updateCoverLoading = true
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd)
          .then((res) => {
            this.$refs['cover-image'].src = res.data.data.url
            // 关闭loading
            this.updateCoverLoading = false
            // 关闭dialog
            this.coverSelectDialog = false
            // 将上传的图片传递给父组件
            this.$emit('input', res.data.data.url)
            this.$notify({
              title: '成功',
              message: '图片上传成功',
              type: 'success'
            })
          })
          .catch(() => {
            // 关闭loading
            this.updateCoverLoading = false
            this.$notify({
              title: '错误',
              message: '图片上传失败',
              type: 'error'
            })
          })
      } else if (this.activeName === 'first') {
        // 素材库上传
        // 获取当前选中的图片地址 通过ref获取组件实例
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$notify({
            title: '提示',
            message: '请先选择封面',
            type: 'warning'
          })
          return 0
        }
        // 关闭dialog
        this.coverSelectDialog = false
        // 将上传的图片传递给父组件
        this.$emit('input', imageList.images[selected].url)
      }
    },
    // dialog完全关闭后重置预览的图片
    resetUploadImage() {
      // 重置预览的图片
      this.previewImage = ''
    }
  }
}
</script>

<style lang="less" scoped>
.upload-cover-container {
  margin-top: 10px;
  .cover-warp {
    width: 170px;
    height: 110px;
    border: 1px dashed #dcdfe6;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #dcdfe6;
    font-size: 25px;
    margin-right: 10px;
    overflow: hidden;
    .cover-image {
      height: 100%;
    }
  }
}
.upload-img-warp {
  display: flex;
  flex-direction: column;
  .upload-btns {
    display: flex;
    justify-content: right;
  }
  .preview-cover-warp {
    height: 200px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .preview-cover {
    max-width: 100%;
    height: 100%;
  }
}
</style>
