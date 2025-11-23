// Mock API 服务 - 模拟后端接口

// 模拟延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 生成Mock数据
let mockPlayList = [
  {
    playid: 'play_001',
    playname: '早间广告任务',
    snMatchType: 'exact',
    sn: 'SN20231001',
    deviceModel: 'AD-1080P',
    group: '商场一楼',
    date_start: '2025-01-01',
    date_end: '2025-12-31',
    time_start: '08:00:00',
    time_end: '12:00:00',
    playstatus: true,
    is_mon: true,
    is_tue: true,
    is_wed: true,
    is_thu: true,
    is_fri: true,
    is_sat: true,
    is_sun: false,
    advert: {
      advertid: 'adv_001',
      advertname: '早间促销广告',
      fullscreen: false,
      screenwidth: 1920,
      screenheight: 1080,
      duration: 0,
      repeat: 0,
      arealist: [
        {
          areaid: 'area_001',
          areaname: '主视频区',
          areax: 0,
          areay: 0,
          areawidth: 1920,
          areaheight: 1080,
          areatype: 2,
          alpha: 255,
          bkcolor: '#000000',
          reslist: [
            {
              resid: 'res_001',
              file: {
                filename: 'promo_video.mp4',
                fileurl: 'http://example.com/videos/promo_video.mp4',
                filesize: 10485760,
                md5: 'abc123def456'
              },
              show: 0,
              showtime: 0,
              text: null,
              font: null
            }
          ]
        }
      ]
    },
    description: '商场一楼早间促销广告播放'
  },
  {
    playid: 'play_002',
    playname: '下午广告任务',
    snMatchType: 'prefix',
    sn: 'SN2023',
    deviceModel: 'AD-4K',
    group: '商场二楼',
    date_start: '2025-01-01',
    date_end: '2025-06-30',
    time_start: '14:00:00',
    time_end: '18:00:00',
    playstatus: true,
    is_mon: true,
    is_tue: true,
    is_wed: true,
    is_thu: true,
    is_fri: true,
    is_sat: true,
    is_sun: true,
    advert: {
      advertid: 'adv_002',
      advertname: '下午品牌广告',
      fullscreen: true,
      screenwidth: 3840,
      screenheight: 2160,
      duration: 60000,
      repeat: 0,
      arealist: [
        {
          areaid: 'area_002',
          areaname: '全屏图片区',
          areax: 0,
          areay: 0,
          areawidth: 3840,
          areaheight: 2160,
          areatype: 1,
          alpha: 255,
          bkcolor: '#FFFFFF',
          reslist: [
            {
              resid: 'res_002',
              file: {
                filename: 'brand_image.jpg',
                fileurl: 'http://example.com/images/brand_image.jpg',
                filesize: 2097152,
                md5: 'xyz789uvw012'
              },
              show: 0,
              showtime: 5000,
              text: null,
              font: null
            }
          ]
        }
      ]
    },
    description: '商场二楼下午品牌广告展示'
  },
  {
    playid: 'play_003',
    playname: '晚间滚动字幕',
    snMatchType: 'exact',
    sn: 'SN20231002',
    deviceModel: 'AD-1080P',
    group: '商场三楼',
    date_start: '2025-01-01',
    date_end: '2025-12-31',
    time_start: '18:00:00',
    time_end: '22:00:00',
    playstatus: false,
    is_mon: false,
    is_tue: false,
    is_wed: false,
    is_thu: false,
    is_fri: true,
    is_sat: true,
    is_sun: true,
    advert: {
      advertid: 'adv_003',
      advertname: '晚间通知字幕',
      fullscreen: false,
      screenwidth: 1920,
      screenheight: 1080,
      duration: 0,
      repeat: 0,
      arealist: [
        {
          areaid: 'area_003',
          areaname: '底部字幕区',
          areax: 0,
          areay: 980,
          areawidth: 1920,
          areaheight: 100,
          areatype: 0,
          alpha: 200,
          bkcolor: '#000000',
          reslist: [
            {
              resid: 'res_003',
              file: null,
              show: 3,
              showtime: 0,
              text: '欢迎光临！本周末全场8折优惠，敬请关注！',
              font: {
                fontname: 'sans-serif',
                textcolor: '#FFFF00',
                fontsize: 48,
                bold: 1,
                roll: 5
              }
            }
          ]
        }
      ]
    },
    description: '商场三楼晚间滚动字幕通知'
  }
]

// Mock节目列表
let mockAdvertList = [
  {
    advertid: 'adv_001',
    advertname: '早间促销广告',
    fullscreen: false,
    screenwidth: 1920,
    screenheight: 1080
  },
  {
    advertid: 'adv_002',
    advertname: '下午品牌广告',
    fullscreen: true,
    screenwidth: 3840,
    screenheight: 2160
  },
  {
    advertid: 'adv_003',
    advertname: '晚间通知字幕',
    fullscreen: false,
    screenwidth: 1920,
    screenheight: 1080
  },
  {
    advertid: 'adv_004',
    advertname: '周末特惠广告',
    fullscreen: false,
    screenwidth: 1920,
    screenheight: 1080
  }
]

// Mock API 接口
export const mockPlayListAPI = {
  // 获取播放任务列表 (模拟7001接口)
  async getPlayList() {
    await delay()
    return {
      success: true,
      method: 7001,
      data: {
        playlist: mockPlayList
      }
    }
  },

  // 获取节目列表
  async getAdvertList() {
    await delay(300)
    return {
      success: true,
      data: mockAdvertList
    }
  },

  // 添加播放任务
  async addPlayTask(taskData) {
    await delay()
    mockPlayList.push(taskData)
    // 模拟7002通知
    console.log('模拟7002通知 - 添加任务:', {
      method: 7002,
      params: {
        type: 1,
        playlist: [taskData]
      }
    })
    return {
      success: true,
      message: '添加成功'
    }
  },

  // 更新播放任务
  async updatePlayTask(taskData) {
    await delay()
    const index = mockPlayList.findIndex(item => item.playid === taskData.playid)
    if (index !== -1) {
      mockPlayList[index] = taskData
      // 模拟7002通知
      console.log('模拟7002通知 - 更新任务:', {
        method: 7002,
        params: {
          type: 1,
          playlist: [taskData]
        }
      })
      return {
        success: true,
        message: '更新成功'
      }
    }
    throw new Error('任务不存在')
  },

  // 删除播放任务
  async deletePlayTask(playid) {
    await delay()
    const index = mockPlayList.findIndex(item => item.playid === playid)
    if (index !== -1) {
      mockPlayList.splice(index, 1)
      // 模拟7002通知
      console.log('模拟7002通知 - 删除任务:', {
        method: 7002,
        params: {
          type: 0,
          playlist: [{ playid }]
        }
      })
      return {
        success: true,
        message: '删除成功'
      }
    }
    throw new Error('任务不存在')
  },

  // 更新播放任务状态
  async updatePlayTaskStatus(playid, status) {
    await delay(200)
    const task = mockPlayList.find(item => item.playid === playid)
    if (task) {
      task.playstatus = status
      // 模拟7002通知
      console.log('模拟7002通知 - 更新状态:', {
        method: 7002,
        params: {
          type: 1,
          playlist: [task]
        }
      })
      return {
        success: true,
        message: '状态更新成功'
      }
    }
    throw new Error('任务不存在')
  },

  // 模拟设备请求播放列表 (7001)
  async deviceRequestPlayList(sn) {
    await delay()
    // 根据SN筛选适用的播放任务
    const filteredList = mockPlayList.filter(task => {
      if (!task.playstatus) return false
      
      if (task.snMatchType === 'all') return true
      if (task.snMatchType === 'exact') return task.sn === sn
      if (task.snMatchType === 'prefix') return sn.startsWith(task.sn)
      
      return false
    })

    return {
      success: true,
      method: 7001,
      data: {
        playlist: filteredList
      }
    }
  },

  // 模拟推送变更通知 (7002)
  async pushPlayListChange(type, playlist) {
    await delay(100)
    console.log('推送7002通知到设备:', {
      method: 7002,
      params: {
        type, // 0-删除, 1-添加/修改
        playlist
      }
    })
    return {
      success: true,
      message: '推送成功'
    }
  }
}

// 导出Mock数据供其他地方使用
export const getMockData = () => ({
  playList: mockPlayList,
  advertList: mockAdvertList
})
