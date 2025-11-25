<template>
  <div class="play-schedule">
    <el-container>
      <el-main>
        <!-- 顶部操作栏 -->
        <div class="toolbar">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加播放任务</el-button>
          <el-button icon="el-icon-refresh" @click="loadPlayList">刷新</el-button>
          
          <!-- 搜索筛选 -->
          <div class="search-bar">
            <el-input
              v-model="searchForm.taskName"
              placeholder="任务名称"
              clearable
              style="width: 200px; margin-right: 10px;"
            ></el-input>
            <el-input
              v-model="searchForm.sn"
              placeholder="设备SN号"
              clearable
              style="width: 200px; margin-right: 10px;"
            ></el-input>
            <el-select
              v-model="searchForm.status"
              placeholder="状态"
              clearable
              style="width: 120px; margin-right: 10px;"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" :value="true"></el-option>
              <el-option label="停用" :value="false"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          </div>
        </div>

        <!-- 播放任务列表 -->
        <el-table
          :data="filteredPlayList"
          border
          stripe
          style="width: 100%; margin-top: 20px;"
          :height="tableHeight"
        >
          <el-table-column prop="playid" label="任务ID" width="180"></el-table-column>
          <el-table-column prop="playname" label="任务名称" width="150"></el-table-column>
          <el-table-column label="设备SN号" width="150">
            <template slot-scope="scope">
              {{ scope.row.sn || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="SN匹配方式" width="120">
            <template slot-scope="scope">
              {{ scope.row.snMatchType || '精确匹配' }}
            </template>
          </el-table-column>
          <el-table-column label="机型" width="100">
            <template slot-scope="scope">
              {{ scope.row.deviceModel || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="有效期" width="220">
            <template slot-scope="scope">
              {{ scope.row.date_start }} ~ {{ scope.row.date_end }}
            </template>
          </el-table-column>
          <el-table-column label="播放时间" width="180">
            <template slot-scope="scope">
              {{ scope.row.time_start }} ~ {{ scope.row.time_end }}
            </template>
          </el-table-column>
          <el-table-column label="关联节目" width="150">
            <template slot-scope="scope">
              {{ scope.row.advert ? scope.row.advert.advertname : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="周期" width="200">
            <template slot-scope="scope">
              <el-tag size="mini" :type="scope.row.is_mon ? 'success' : 'info'">一</el-tag>
              <el-tag size="mini" :type="scope.row.is_tue ? 'success' : 'info'">二</el-tag>
              <el-tag size="mini" :type="scope.row.is_wed ? 'success' : 'info'">三</el-tag>
              <el-tag size="mini" :type="scope.row.is_thu ? 'success' : 'info'">四</el-tag>
              <el-tag size="mini" :type="scope.row.is_fri ? 'success' : 'info'">五</el-tag>
              <el-tag size="mini" :type="scope.row.is_sat ? 'success' : 'info'">六</el-tag>
              <el-tag size="mini" :type="scope.row.is_sun ? 'success' : 'info'">日</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.playstatus"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <!-- 添加/编辑播放任务对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="taskForm" :rules="taskRules" ref="taskForm" label-width="140px">
        <el-form-item label="任务名称" prop="playname">
          <el-input v-model="taskForm.playname" placeholder="请输入任务名称"></el-input>
        </el-form-item>

        <el-form-item label="SN匹配方式" prop="snMatchType">
          <el-select v-model="taskForm.snMatchType" placeholder="请选择匹配方式" style="width: 100%;">
            <el-option label="精确匹配" value="exact"></el-option>
            <el-option label="前缀匹配" value="prefix"></el-option>
            <el-option label="全部设备" value="all"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备SN号" prop="sn" v-if="taskForm.snMatchType !== 'all'">
          <el-input v-model="taskForm.sn" placeholder="请输入设备SN号"></el-input>
        </el-form-item>

        <el-form-item label="机型">
          <el-input v-model="taskForm.deviceModel" placeholder="请输入机型"></el-input>
        </el-form-item>

        <el-form-item label="分组">
          <el-input v-model="taskForm.group" placeholder="请输入分组"></el-input>
        </el-form-item>

        <el-form-item label="有效期" prop="dateRange">
          <el-date-picker
            v-model="taskForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="播放时间" prop="timeRange">
          <el-time-picker
            is-range
            v-model="taskForm.timeRange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
            style="width: 100%;"
          ></el-time-picker>
        </el-form-item>

        <el-form-item label="关联节目" prop="advertId">
          <el-select v-model="taskForm.advertId" placeholder="请选择节目" style="width: 100%;">
            <el-option
              v-for="advert in advertList"
              :key="advert.advertid"
              :label="advert.advertname"
              :value="advert.advertid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="周期设置">
          <el-checkbox-group v-model="taskForm.weekDays">
            <el-checkbox label="is_mon">周一</el-checkbox>
            <el-checkbox label="is_tue">周二</el-checkbox>
            <el-checkbox label="is_wed">周三</el-checkbox>
            <el-checkbox label="is_thu">周四</el-checkbox>
            <el-checkbox label="is_fri">周五</el-checkbox>
            <el-checkbox label="is_sat">周六</el-checkbox>
            <el-checkbox label="is_sun">周日</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="taskForm.playstatus" active-text="启用" inactive-text="停用"></el-switch>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="taskForm.description"
            :rows="3"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mockPlayListAPI } from '@/services/mockApi'

export default {
  name: 'PlaySchedule',
  data() {
    return {
      playList: [],
      filteredPlayList: [],
      advertList: [], // 节目列表
      searchForm: {
        taskName: '',
        sn: '',
        status: ''
      },
      dialogVisible: false,
      dialogTitle: '添加播放任务',
      isEdit: false,
      taskForm: {
        playid: '',
        playname: '',
        snMatchType: 'exact',
        sn: '',
        deviceModel: '',
        group: '',
        dateRange: [],
        timeRange: [],
        advertId: '',
        weekDays: ['is_mon', 'is_tue', 'is_wed', 'is_thu', 'is_fri', 'is_sat', 'is_sun'],
        playstatus: true,
        description: ''
      },
      taskRules: {
        playname: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        snMatchType: [
          { required: true, message: '请选择SN匹配方式', trigger: 'change' }
        ],
        sn: [
          { required: true, message: '请输入设备SN号', trigger: 'blur' }
        ],
        dateRange: [
          { required: true, message: '请选择有效期', trigger: 'change' }
        ],
        timeRange: [
          { required: true, message: '请选择播放时间', trigger: 'change' }
        ],
        advertId: [
          { required: true, message: '请选择关联节目', trigger: 'change' }
        ]
      },
      tableHeight: 600
    }
  },
  mounted() {
    this.loadPlayList()
    this.loadAdvertList()
    this.calculateTableHeight()
    window.addEventListener('resize', this.calculateTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTableHeight)
  },
  methods: {
    // 加载播放任务列表
    async loadPlayList() {
      try {
        const response = await mockPlayListAPI.getPlayList()
        this.playList = response.data.playlist || []
        this.filteredPlayList = [...this.playList]
        this.$message.success('播放任务列表加载成功')
      } catch (error) {
        this.$message.error('加载播放任务列表失败')
        console.error(error)
      }
    },

    // 加载节目列表
    async loadAdvertList() {
      try {
        const response = await mockPlayListAPI.getAdvertList()
        this.advertList = response.data || []
      } catch (error) {
        console.error('加载节目列表失败', error)
      }
    },

    // 搜索
    handleSearch() {
      this.filteredPlayList = this.playList.filter(item => {
        let match = true
        if (this.searchForm.taskName) {
          match = match && item.playname.includes(this.searchForm.taskName)
        }
        if (this.searchForm.sn) {
          match = match && (item.sn || '').includes(this.searchForm.sn)
        }
        if (this.searchForm.status !== '') {
          match = match && item.playstatus === this.searchForm.status
        }
        return match
      })
    },

    // 添加任务
    handleAdd() {
      this.dialogTitle = '添加播放任务'
      this.isEdit = false
      this.resetForm()
      this.dialogVisible = true
    },

    // 编辑任务
    handleEdit(row) {
      this.dialogTitle = '编辑播放任务'
      this.isEdit = true
      this.taskForm = {
        playid: row.playid,
        playname: row.playname,
        snMatchType: row.snMatchType || 'exact',
        sn: row.sn || '',
        deviceModel: row.deviceModel || '',
        group: row.group || '',
        dateRange: [row.date_start, row.date_end],
        timeRange: [row.time_start, row.time_end],
        advertId: row.advert ? row.advert.advertid : '',
        weekDays: this.getWeekDays(row),
        playstatus: row.playstatus,
        description: row.description || ''
      }
      this.dialogVisible = true
    },

    // 删除任务
    handleDelete(row) {
      this.$confirm('确定要删除该播放任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await mockPlayListAPI.deletePlayTask(row.playid)
          this.$message.success('删除成功')
          this.loadPlayList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },

    // 状态切换
    async handleStatusChange(row) {
      try {
        await mockPlayListAPI.updatePlayTaskStatus(row.playid, row.playstatus)
        this.$message.success('状态更新成功')
      } catch (error) {
        this.$message.error('状态更新失败')
        row.playstatus = !row.playstatus
      }
    },

    // 提交表单
    handleSubmit() {
      this.$refs.taskForm.validate(async (valid) => {
        if (valid) {
          try {
            const taskData = this.buildTaskData()
            if (this.isEdit) {
              await mockPlayListAPI.updatePlayTask(taskData)
              this.$message.success('更新成功')
            } else {
              await mockPlayListAPI.addPlayTask(taskData)
              this.$message.success('添加成功')
            }
            this.dialogVisible = false
            this.loadPlayList()
          } catch (error) {
            this.$message.error(this.isEdit ? '更新失败' : '添加失败')
          }
        }
      })
    },

    // 构建任务数据
    buildTaskData() {
      const advert = this.advertList.find(a => a.advertid === this.taskForm.advertId)
      const weekDaysObj = {}
      const allWeekDays = ['is_mon', 'is_tue', 'is_wed', 'is_thu', 'is_fri', 'is_sat', 'is_sun']
      allWeekDays.forEach(day => {
        weekDaysObj[day] = this.taskForm.weekDays.includes(day)
      })

      return {
        playid: this.isEdit ? this.taskForm.playid : this.generateId(),
        playname: this.taskForm.playname,
        snMatchType: this.taskForm.snMatchType,
        sn: this.taskForm.sn,
        deviceModel: this.taskForm.deviceModel,
        group: this.taskForm.group,
        date_start: this.taskForm.dateRange[0],
        date_end: this.taskForm.dateRange[1],
        time_start: this.taskForm.timeRange[0],
        time_end: this.taskForm.timeRange[1],
        playstatus: this.taskForm.playstatus,
        ...weekDaysObj,
        advert: advert,
        description: this.taskForm.description
      }
    },

    // 获取周期设置
    getWeekDays(row) {
      const days = []
      const weekDays = ['is_mon', 'is_tue', 'is_wed', 'is_thu', 'is_fri', 'is_sat', 'is_sun']
      weekDays.forEach(day => {
        if (row[day]) {
          days.push(day)
        }
      })
      return days
    },

    // 重置表单
    resetForm() {
      this.taskForm = {
        playid: '',
        playname: '',
        snMatchType: 'exact',
        sn: '',
        deviceModel: '',
        group: '',
        dateRange: [],
        timeRange: [],
        advertId: '',
        weekDays: ['is_mon', 'is_tue', 'is_wed', 'is_thu', 'is_fri', 'is_sat', 'is_sun'],
        playstatus: true,
        description: ''
      }
      if (this.$refs.taskForm) {
        this.$refs.taskForm.clearValidate()
      }
    },

    // 生成ID
    generateId() {
      return 'play_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },

    // 计算表格高度
    calculateTableHeight() {
      this.tableHeight = window.innerHeight - 260
    }
  }
}
</script>

<style scoped>
.play-schedule {
  position: relative;
  top: 60px;
  height: 100%;
  background: #f5f5f5;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
}

.el-tag {
  margin-right: 5px;
}
.el-form{
  height: 550px;
  overflow: auto;
}
</style>
