<script lang="ts" setup>
import { useChatStore } from '../stores/chat'

const chat = useChatStore()

</script>

<template>
  <div class="chat-summary">
    <p>
      <strong>Summary:</strong>
      <br>
      {{ chat.summary }}
    </p>
    <p>
      <strong>Topics:</strong>
      <br>
      {{ chat.topics }}
    </p>
  </div>
</template>

<style scoped>
.chat-summary {
  height: calc(100vh - 20px);
  overflow-y: auto;
}
</style>