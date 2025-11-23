import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AdDesigner from '@/components/AdDesigner'

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
    }
  ]
})
