<script setup lang="ts">
import ChatWindow from './components/ChatWindow.vue'
import ChatSummary from './components/ChatSummary.vue'
</script>

<template>
  <div>
    <el-row>
      <el-col :span="8">
        <ChatSummary></ChatSummary>
      </el-col>
      <el-col :span="8">
        <ChatWindow></ChatWindow>
      </el-col>
      <el-col :span="8">
        
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

</style>
