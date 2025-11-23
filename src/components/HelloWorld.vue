<template>
  <div class="hello">
    <div class="hero-section">
      <h1>{{ msg }}</h1>
      <p class="description">
        专业的广告内容排版设计工具，支持图片、视频、文字等多种媒体元素的可视化编排。
      </p>
      <el-button type="primary" size="large" @click="goToDesigner">
        开始设计
      </el-button>
    </div>
    
    <div class="features">
      <h2>功能特色</h2>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="feature-item">
            <i class="el-icon-picture feature-icon"></i>
            <h3>多媒体支持</h3>
            <p>支持图片、视频、文字等多种媒体元素，满足各种广告设计需求</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="feature-item">
            <i class="el-icon-s-grid feature-icon"></i>
            <h3>拖拽设计</h3>
            <p>直观的拖拽操作，所见即所得的设计体验，轻松创建专业广告</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="feature-item">
            <i class="el-icon-view feature-icon"></i>
            <h3>实时预览</h3>
            <p>实时预览设计效果，支持一键下发到广告终端设备</p>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <div class="workflow">
      <h2>设计流程</h2>
      <el-steps :active="4" align-center>
        <el-step title="设置画布" description="配置屏幕尺寸"></el-step>
        <el-step title="添加元素" description="拖拽组件到画布"></el-step>
        <el-step title="调整属性" description="设置元素样式和内容"></el-step>
        <el-step title="预览效果" description="查看最终显示效果"></el-step>
        <el-step title="下发设备" description="推送到广告终端"></el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '广告设计系统'
    }
  },
  methods: {
    goToDesigner() {
      this.$router.push('/designer')
    }
  }
}
</script>

<style scoped>
.hello {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
}

.hero-section h1 {
  font-size: 48px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 300;
}

.description {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.features {
  margin-bottom: 60px;
}

.features h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
  font-weight: 300;
}

.feature-item {
  text-align: center;
  padding: 20px;
}

.feature-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 20px;
}

.feature-item h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 400;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
}

.workflow {
  margin-bottom: 40px;
}

.workflow h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
  font-weight: 300;
}
</style>
