<template>
  <div id="app">
    <el-header style="background: #409eff; color: white; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;">
      <h2 style="margin: 0;">广告设计系统</h2>
      <el-menu
        mode="horizontal"
        background-color="#409eff"
        text-color="white"
        active-text-color="white"
        router
        style="border: none;"
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/designer">广告设计器</el-menu-item>
      </el-menu>
    </el-header>
    <router-view style="height: calc(100vh - 60px);"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}

body {
  margin: 0;
  padding: 0;
}
</style>
