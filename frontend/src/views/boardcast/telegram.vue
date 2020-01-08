<template>
  <div class="telegram-boardcast">
    <p>将会发送到以下绑定了 Telegram 的 Matataki 用户: {{ getNameOfTheList }}</p>
    <editor :initial-value="content" :init="editorInit" api-key="no-api-key" />
    <el-row :gutter="20" class="boardcast-confirm">
      <el-col :span="12">
        <el-checkbox v-model="isSilent">静音模式</el-checkbox>
        <el-checkbox v-model="confirmation">我确认以上消息无误</el-checkbox>
      </el-col>
      <el-col :span="12">
        <el-button
          :disabled="!confirmation"
          :type="sendButtonStatus.type"
          :loading="sendButtonStatus.isSending"
          round
          @click="boardcastMessage"
        >{{ sendButtonStatus.btnText }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
// import Tinymce from '@/components/Tinymce'
export default {
  name: 'Telegram',
  components: {
    Editor
  },
  data: () => ({
    targets: [],
    confirmation: false,
    isSilent: true,
    sendButtonStatus: {
      isSending: false,
      btnText: '广播提醒',
      type: 'primary'
    },
    editorInit: {
      height: 300,
      menubar: false,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar: `
        undo redo | formatselect | bold italic backcolor | 
        alignleft aligncenter alignright alignjustify | 
        bullist numlist outdent indent | removeformat | help`
    },
    content: `目前消息可用的元素：
      <b>粗体</b>, <strong>bold</strong>
      <i>斜体</i>, <em>italic</em>
      <u>下划线</u>, <ins>underline</ins>
      <s>删除线</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
      <b>粗体开始 <i>斜体开始 <s>开始删除线italic bold strikethrough结束删除线</s> <u>开始下划线 italic bold 下划线结束</u>斜体结束</i> 粗体结束</b>
      <a href="http://www.example.com/">inline URL</a>
      <code>inline fixed-width code</code>
      <pre>pre-formatted fixed-width code block</pre>
      <pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>`
  }),
  computed: {
    getNameOfTheList() {
      return this.targets
        .map(user => user.nickname || user.username)
        .join(', ')
    }
  },
  watch: {
    isSilent(val) {
      this.sendButtonStatus = {
        isSending: false,
        type: val ? 'primary' : 'danger',
        btnText: val ? '广播提醒' : '大声宣布'
      }
    },
    confirmation(val) {
      if (val) {
        this.sendButtonStatus = {
          isSending: false,
          type: this.isSilent ? 'primary' : 'danger',
          btnText: this.isSilent ? '广播提醒' : '大声宣布'
        }
      }
    }
  },
  created() {
    this.getAllBindTgUsers()
  },
  methods: {
    async getAllBindTgUsers() {
      this.request({
        url: this.apis.getAllTelegramBindedUser,
        method: 'get'
      }).then(({ result }) => {
        this.targets = result
        console.info(result)
      })
    },
    async boardcastMessage() {
      // sending stat for btn
      this.sendButtonStatus = {
        isSending: true,
        type: 'primary',
        btnText: '正在发送'
      }

      // the real send happened here

      // after
      this.sendButtonStatus = {
        isSending: false,
        type: 'success',
        btnText: '发送成功'
      }
      this.confirmation = false // 重置状态，防止多次发送
    }
  }
}
</script>

<style scoped>
.telegram-boardcast {
  margin: 20px;
}
.boardcast-confirm {
  margin: 20px;
}
</style>
