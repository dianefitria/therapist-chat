import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', () => {
  const summary = ref('')
  const topics = ref<string[]>([])

  function setSummary(data: string) {
    summary.value = data
  }

  function addTopics(items: string[]) {
    const uniqueItems = items.filter((item) => !topics.value.includes(item))
    topics.value = topics.value.concat(uniqueItems)
  }

  return { summary, topics, setSummary, addTopics }
});