<template>
  <div class="playlist-viewer">
    <el-card>
      <div slot="header" class="clearfix">
        <span>播放列表JSON预览</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="copyToClipboard">复制JSON</el-button>
        <el-button style="float: right; padding: 3px 10px" type="text" @click="refreshData">刷新</el-button>
      </div>

      <!-- 模拟设备请求 -->
      <div class="device-request">
        <h4>模拟设备请求 (7001)</h4>
        <el-form inline>
          <el-form-item label="设备SN">
            <el-input v-model="deviceSN" placeholder="输入设备SN号" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="requestPlayList">请求播放列表</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- JSON数据展示 -->
      <div class="json-display">
        <h4>响应数据 (method: 7001)</h4>
        <pre>{{ formattedJSON }}</pre>
      </div>

      <!-- 7002通知日志 -->
      <div class="notification-log" v-if="notificationLogs.length > 0">
        <h4>7002变更通知日志</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in notificationLogs"
            :key="index"
            :timestamp="log.timestamp"
            placement="top"
          >
            <el-card>
              <h4>{{ log.type === 0 ? '删除任务' : '添加/修改任务' }}</h4>
              <pre>{{ log.data }}</pre>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mockPlayListAPI } from '@/services/mockApi'

export default {
  name: 'PlayListViewer',
  data() {
    return {
      deviceSN: 'SN20231001',
      playListData: null,
      notificationLogs: []
    }
  },
  computed: {
    formattedJSON() {
      if (!this.playListData) {
        return '请点击"请求播放列表"按钮获取数据'
      }
      return JSON.stringify(this.playListData, null, 2)
    }
  },
  mounted() {
    this.requestPlayList()
    this.setupNotificationListener()
  },
  methods: {
    // 请求播放列表
    async requestPlayList() {
      try {
        const response = await mockPlayListAPI.deviceRequestPlayList(this.deviceSN)
        this.playListData = response
        this.$message.success('播放列表获取成功')
      } catch (error) {
        this.$message.error('获取播放列表失败')
        console.error(error)
      }
    },

    // 刷新数据
    refreshData() {
      this.requestPlayList()
    },

    // 复制到剪贴板
    copyToClipboard() {
      const text = this.formattedJSON
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        this.$message.success('JSON已复制到剪贴板')
      } catch (err) {
        this.$message.error('复制失败')
      }
      document.body.removeChild(textarea)
    },

    // 设置通知监听
    setupNotificationListener() {
      // 监听console.log中的7002通知
      const originalLog = console.log
      console.log = (...args) => {
        originalLog.apply(console, args)
        
        // 检测是否是7002通知
        if (args[0] && typeof args[0] === 'string' && args[0].includes('7002')) {
          const logData = args[1]
          if (logData && logData.method === 7002) {
            this.addNotificationLog(logData)
          }
        }
      }
    },

    // 添加通知日志
    addNotificationLog(logData) {
      const timestamp = new Date().toLocaleString()
      this.notificationLogs.unshift({
        timestamp,
        type: logData.params.type,
        data: JSON.stringify(logData, null, 2)
      })
      
      // 只保留最近10条
      if (this.notificationLogs.length > 10) {
        this.notificationLogs = this.notificationLogs.slice(0, 10)
      }
    }
  }
}
</script>

<style scoped>
.playlist-viewer {
  padding: 20px;
}

.device-request {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.json-display {
  margin-bottom: 20px;
}

.json-display pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 500px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
}

.notification-log {
  margin-top: 30px;
}

.notification-log pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 11px;
}

h4 {
  margin-bottom: 10px;
  color: #409eff;
}
</style>
