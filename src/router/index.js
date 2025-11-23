import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AdDesigner from '@/components/AdDesigner'
import PlaySchedule from '@/components/PlaySchedule'
import PlayListViewer from '@/components/PlayListViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/designer',
      name: 'AdDesigner',
      component: AdDesigner
    },
    {
      path: '/schedule',
      name: 'PlaySchedule',
      component: PlaySchedule
    },
    {
      path: '/viewer',
      name: 'PlayListViewer',
      component: PlayListViewer
    }
  ]
})
