<template>
  <div class="settings-container">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <div>
        <el-tabs activeName="first">
          <el-tab-pane label="账号详情" name="first" class="user-warp">
            <div class="user user-id">
              <span class="user-warp-title">ID</span>
              <span class="user-warp-content">
                <span>{{ user.id }}</span>
              </span>
            </div>
            <div class="user user-phone">
              <span class="user-warp-title">手机号</span>
              <span class="user-warp-content">
                <span>{{ user.mobile }}</span>
              </span>
            </div>
            <div class="user user-name">
              <span class="user-warp-title">用户名</span>
              <span class="user-warp-content">
                <span>{{ user.name ? user.name : '暂未设置用户名' }}</span>
                <span class="tool-warp" @click="dialogUserNameVisible = true">编辑</span>
              </span>
            </div>
            <div class="user user-desc">
              <span class="user-warp-title">用户简介</span>
              <span class="user-warp-content">
                <span>{{ user.intro ? user.intro : '填写简介更容易获得大家的关注哦' }}</span>
                <span class="tool-warp" @click="dialogUserDescVisible = true">编辑</span>
              </span>
            </div>
            <div class="user user-avator">
              <span class="user-warp-title">用户头像</span>
              <span class="user-warp-content">
                <div class="avator-content">
                  <img
                    :src="user.photo ? user.photo : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                    alt=""
                    @click="$refs.uploadAvator.click()"
                  />
                  <div class="add-avator" @click="$refs.uploadAvator.click()">{{ user.photo ? '更换头像' : '上传头像' }}</div>
                </div>
                <input type="file" ref="uploadAvator" hidden @change="onFileChange" />
              </span>
            </div>
            <div class="user user-email">
              <span class="user-warp-title">邮箱</span>
              <span class="user-warp-content">
                <span>{{ user.email ? user.email : '暂未绑定邮箱' }}</span>
                <span class="tool-warp" @click="dialogUserEmailVisible = true">{{ user.email ? '更换邮箱' : '绑定邮箱' }}</span>
              </span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 设置用户名弹出框 -->
    <el-dialog
      class="dirlogs"
      title="编辑用户名"
      :visible.sync="dialogUserNameVisible"
      :append-to-body="true"
      width="22%"
      :destroy-on-close="true"
      @closed="resetForm"
    >
      <el-form ref="form" :model="previewUser" size="medium" :rules="rules">
        <el-form-item prop="name">
          <el-input v-model="previewUser.name" placeholder="请输入用户名" maxlength="7" show-word-limit></el-input>
          <p>请勿使用包含特殊符号或含有明显营销推广意图的用户名</p>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button size="small" @click="dialogUserNameVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="onUpdateUser(1)">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 设置用户简介弹出框 -->
    <el-dialog
      class="dirlogs user-desc-dirlog"
      title="编辑用户简介"
      :visible.sync="dialogUserDescVisible"
      :append-to-body="true"
      width="22%"
      @closed="resetForm"
    >
      <el-form ref="form" :model="previewUser" size="medium">
        <el-form-item>
          <el-input type="textarea" placeholder="添加简介，让大家更好的认识你" v-model="previewUser.intro" maxlength="70" show-word-limit></el-input>
          <p>要求内容完整通顺，无特殊符号</p>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button size="small" @click="dialogUserDescVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="onUpdateUser(2)">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 修改头像弹出框 -->
    <el-dialog
      class="dirlogs user-desc-dirlog"
      title="更换头像"
      :visible.sync="dialogUserAvatorVisible"
      :append-to-body="true"
      width="25%"
      @opened="onAvatarDialogOpened"
    >
      <div class="avator-preview">
        <img :src="previewImage" ref="preview-image" alt="" />
      </div>
      <div class="btns">
        <el-button size="small" @click="dialogUserAvatorVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="onUpdateAvatar" :loading="updateAvatarLoading">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 绑定邮箱弹出框 -->
    <el-dialog class="dirlogs user-desc-dirlog" title="绑定邮箱" :visible.sync="dialogUserEmailVisible" :append-to-body="true" width="22%" @closed="resetForm">
      <el-form ref="form" :model="previewUser" :rules="rules" size="medium">
        <el-form-item prop="email">
          <el-input v-model="previewUser.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button size="small" @click="dialogUserEmailVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="onUpdateUser(3)">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserAvatar, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  data() {
    return {
      dialogUserNameVisible: false, // 是否显示设置用户名弹出框
      dialogUserDescVisible: false, // 是否显示设置用户简介弹出框
      dialogUserAvatorVisible: false, // 是否显示更换头像弹出框
      dialogUserEmailVisible: false, // 是否显示设置邮箱弹出框
      updateAvatarLoading: false, // 修改头像的loading状态
      updateUsernameLoading: false, // 修改头像的loading状态
      updateIntroLoading: false, // 修改头像的loading状态
      updateEmailLoading: false, // 修改头像的loading状态

      // 用户信息
      user: {
        id: null, // id
        mobile: '', // 手机号
        name: '', // 用户名
        intro: '', // 简介
        photo: '', // 头像
        email: '' // 邮箱
      },
      previewUser: {
        name: '', // 预览用户名
        intro: '', // 预览用户简介
        email: '' // 预览邮箱
      },
      previewImage: '', // 预览头像图片
      rules: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        email: [{ type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }]
      },
      cropper: null // 裁切器实例
    }
  },
  created() {
    this.loadUser()
  },
  methods: {
    // 获取用户信息
    loadUser() {
      getUserProfile().then((res) => {
        this.user = res.data.data
        const { name, intro, email } = this.user
        this.previewUser.name = name
        this.previewUser.intro = intro
        this.previewUser.email = email
      })
    },
    // 上传头像-选择图片
    onFileChange() {
      const file = this.$refs.uploadAvator
      // 获取选择的图片 file.files[0]，生成图片URL
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 解决选择相同文件不触发change事件
      file.value = ''
      // 显示弹出框，裁剪头像
      this.dialogUserAvatorVisible = true
    },
    // 修改头像弹出框完全打开
    onAvatarDialogOpened() {
      // 解决裁切器一直显示同一张图片1.调用replace方法
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      // 图片裁切器必须基于可见状态的img进行初始化
      // 获取图片DOM
      const image = this.$refs['preview-image']
      // 初始化裁切器()
      // 注意：第一次初始化完成之后，预览裁切的图片发生变化时，裁切器默认不会更新(一直显示第一次的图片)，解决方式：1.调用.replace()方法 2.销毁裁切器 .destroy()，重新初始化
      this.cropper = new Cropper(image, {
        // aspectRatio 裁切器比例 1/1 可以直接写 1
        // aspectRatio: 1 / 1
        aspectRatio: 1,
        //  viewMode: 1 限制裁切框不超出图片
        viewMode: 1,
        // 是否允许图片拖动 none/move
        // dragMode: 'none',
        // 是否显示像素背景
        background: false
      })
    },
    // 修改头像
    onUpdateAvatar() {
      // 开启保存按钮loading
      this.updateAvatarLoading = true
      // 获取裁切器裁切后的图片
      this.cropper.getCroppedCanvas().toBlob((file) => {
        // 修改用户头像
        const fd = new FormData()
        fd.append('photo', file)
        updateUserAvatar(fd)
          .then((res) => {
            // 关闭保存按钮loading
            this.updateAvatarLoading = false
            // 关闭弹出框
            this.dialogUserAvatorVisible = false
            // 更新当前显示的用户头像
            // this.user.photo = res.data.data.photo
            this.user.photo = window.URL.createObjectURL(file)
            // 传递更改之后的数据给layout组件，更改用户相关信息
            globalBus.$emit('update-user', this.user)
            this.$notify({
              title: '成功',
              message: '头像修改成功',
              type: 'success'
            })
          })
          .catch(() => {
            // 关闭保存按钮loading
            this.updateAvatarLoading = false
            this.$notify({
              title: '错误',
              message: '头像修改失败',
              type: 'error'
            })
          })
      })
    },
    // 修改基本信息
    onUpdateUser(type) {
      const { name, intro, email } = this.previewUser
      if (type === 1) {
        // 开启保存按钮loading
        this.updateUsernameLoading = true
        // 修改用户名
        updateUserProfile({ name })
          .then((res) => {
            // 关闭保存按钮loading
            this.updateUsernameLoading = false
            // 关闭弹出框
            this.dialogUserNameVisible = false
            // 更新页面显示的用户名
            this.user.name = name
            // 传递更改之后的数据给layout组件，更改用户相关信息
            globalBus.$emit('update-user', this.user)
            this.$notify({
              title: '成功',
              message: '用户名修改成功',
              type: 'success'
            })
          })
          .catch(() => {
            // 关闭保存按钮loading
            this.updateUsernameLoading = false
            this.$notify({
              title: '错误',
              message: '用户名修改失败',
              type: 'error'
            })
          })
      } else if (type === 2) {
        // 修改用户简介
        // 开启保存按钮loading
        this.updateIntroLoading = true
        // 修改用户名
        updateUserProfile({ intro })
          .then(() => {
            // 关闭保存按钮loading
            this.updateIntroLoading = false
            // 关闭弹出框
            this.dialogUserDescVisible = false
            // 更新页面显示的用户名
            this.user.intro = intro
            this.$notify({
              title: '成功',
              message: '用户简介修改成功',
              type: 'success'
            })
          })
          .catch(() => {
            // 关闭保存按钮loading
            this.updateIntroLoading = false
            this.$notify({
              title: '错误',
              message: '用户简介修改失败',
              type: 'error'
            })
          })
      } else if (type === 3) {
        // 修改邮箱
        // 开启保存按钮loading
        this.updateEmailLoading = true
        // 修改用户名
        updateUserProfile({ email })
          .then(() => {
            // 关闭保存按钮loading
            this.updateEmailLoading = false
            // 关闭弹出框
            this.dialogUserEmailVisible = false
            // 更新页面显示的用户名
            this.user.email = email
            this.$notify({
              title: '成功',
              message: '邮箱绑定成功',
              type: 'success'
            })
          })
          .catch(() => {
            // 关闭保存按钮loading
            this.updateEmailLoading = false
            this.$notify({
              title: '成功',
              message: '邮箱绑定失败',
              type: 'error'
            })
          })
      }
    },
    // dialog对话框完全关闭后重置内部表单内容
    resetForm() {
      const { name, intro, email } = this.user
      this.previewUser.name = name
      this.previewUser.intro = intro
      this.previewUser.email = email
    }
  }
}
</script>

<style lang="less" scoped>
.settings-container {
  .el-card {
    border: none;
    border-radius: 5px;
    /deep/.el-tabs__active-bar {
      background-color: var(--themeColor);
      width: 64px !important;
    }
    /deep/.el-tabs__item.is-active {
      font-size: 16px;
      color: var(--themeColor);
    }
    /deep/.el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    /deep/.el-tabs__content {
      padding: 20px 55px;
    }
    .user-warp {
      width: 100%;
      .user {
        font-size: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e8e8e8;
        padding: 25px 0;
        .user-warp-title {
          width: 10%;
        }
        .user-warp-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          color: #666;
          position: relative;
          .tool-warp {
            color: #1356bd;
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
      .avator-content {
        position: relative;
        width: 110px;
        height: 110px;
        border-radius: 50%;
        overflow: hidden;
        img {
          height: 100%;
          &:hover {
            cursor: pointer;
          }
        }
        .add-avator {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 25px;
          background: rgba(0, 0, 0, 0.4);
          line-height: 25px;
          text-align: center;
          color: #fff;
          font-size: 12px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
.dirlogs {
  p {
    color: #acacac;
  }
  .btns {
    text-align: right;
  }
}
.user-desc-dirlog {
  /deep/.el-textarea__inner {
    height: 150px;
    resize: none;
    font-family: '微软雅黑';
  }
}
.avator-preview {
  width: 100%;
  margin-bottom: 20px;
  img {
    max-width: 100%;
    height: 200px;
  }
}
</style>
