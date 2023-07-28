<script lang="ts" setup>
import { ref } from 'vue'
import { useChatStore } from '../stores/chat'
import { axiosInstance } from '../utils/axiosInstance'

const reply = ref('')
const chat = useChatStore()
const history = ref<Record<string,any>[]>([])
const counter = ref(0)
const chathistory = ref('chathistory');

const getResponse = () => {
  history.value.push({
    author: 'Patient',
    content: reply.value
  })

  reply.value = '';

  console.log(import.meta.env.OPEN_AI_KEY)

  scrollToElement();

  const payload = {
    value: chat.summary,
    inputs: [{
      key: 'summary',
      value: chat.summary
    }, {
      key: 'history',
      value: generateLastHistory()
    }]

  }
  axiosInstance.post('skills/MySkill/invoke/Therapist', payload)
  .then(({ data }) =>{
    if(data && data.value) {
      history.value.push({
        author: 'Therapist',
        content: data.value.replace('Therapist: ','')
      })

      scrollToElement();

      counter.value++;

      if(counter.value === 3) {
        getSummary();
        getTopics();
        counter.value = 0;
      }
    }
  })
}

const getSummary = () => {
  const payload = {
    value: generateLastHistory(),
  }

  axiosInstance.post('skills/ConversationSummarySkill/invoke/SummarizeConversation', payload)
  .then(({ data }) =>{
    if(data && data.value) {
      combineSummary(data.value);
    }
  })
}

const combineSummary = (summary: string) => {
  const payload = {
    value: chat.summary + ' ' + summary,
  }

  axiosInstance.post('skills/SummarizeSkill/invoke/Summarize', payload)
  .then(({ data }) =>{
    if(data && data.value) {
      chat.setSummary(data.value);
    }
  })
}

const getTopics = () => {
  const payload = {
    value: generateLastHistory(),
  }

  axiosInstance.post('skills/ConversationSummarySkill/invoke/GetConversationTopics', payload)
  .then(({ data }) =>{
    if(data && data.value) {
      formatTopics(data.value);
    }
  })
}

const formatTopics = (topics: string) => {
  const topicsJson = JSON.parse(
    '[' +
    topics
      .split('}\n\n{')
      .map((item, index, array) => {
        if (array.length === 1) {
          return item;
        } else if (index === 0) {
          return item + '}';
        } else if (index === array.length - 1) {
          return '{' + item;
        } else {
          return '{' + item + '}';
        }
      })
      .join(',') +
    ']',
  );

  const topicsList = topicsJson.reduce((acc: any, cur: any) => {
    return acc.concat(cur.topics);
  }, []);

  chat.addTopics(topicsList);
}

const scrollToElement = () => {
    const el = document.getElementById(chathistory.value);

    if (el) {
      el.scrollTop = el.scrollHeight;
    }
}

const generateLastHistory = () => {
  const lastHistory = history.value.length > 6 ? history.value.slice(-6) : history.value
  return lastHistory.map((c) => (`${c.author}: ${c.content}`)).join('\n')
}
</script>

<template>
  <div>
    <el-card class="full-height-calc" :body-style="{ 
      height: '100%',
      padding: '0'
    }">
      <div class="chat-box">
        <div class="chat-history" id="chathistory">
          <div class="chat-item" v-for="item in history">
            <div v-if="item.author === 'Patient'" class="chat-patient">
              <div class="chat-content">
                {{ item.content }}
              </div>
              <div>
                <el-icon>
                  <User/>
                </el-icon>
              </div>
            </div>
            <div v-else class="chat-therapist">
              <div>
                <el-icon>
                  <User/>
                </el-icon>
              </div>
              <div class="chat-content">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
        <div class="reply-box">
          <div class="reply-input">
            <el-input v-model="reply"></el-input>
          </div>
          <div class="reply-button">
            <el-button type="primary" circle @click="getResponse">
              <el-icon>
                <Position/>
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style>
.chat-item .el-icon {
  width: 50px;font-size: 24px;
  margin-top: 5px;
}
</style>

<style scoped>
.full-height-calc {
  height: calc(100vh - 20px);
}
.chat-box {
  height: 100%;
  position: relative;
}
.chat-history {
  height: calc(100% - 70px);
  overflow-y: scroll;

}
.chat-item {
  margin: 10px;
}
.chat-content {
  width: 90%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid lightgray;
}
.chat-therapist, .chat-patient {
  display: flex;
}
.chat-therapist .chat-content {
  background-color: lightblue;
}
.chat-patient .chat-content {
  background-color: lightpink;
}
.reply-box {
  background-color: lightcyan;
  position: absolute;
  bottom: 0;
  display: flex;
  padding: 20px;
  width: calc(100% - 35px);
}
.reply-input {
  width: 100%
}
.reply-button {
  width: 50px;
  text-align: right;
}
</style>