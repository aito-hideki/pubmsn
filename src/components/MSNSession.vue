<template>
  <div
    v-if="!sessions[session]"
    class="msn-login d-flex align-center justify-center"
    v-bind="$attrs"
  >
    <v-card class="msn-login__dialog">
      <v-card-title class="d-flex justify-center">
        Login
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="username"
          label="User Name"
          :rules="[() => !!username || 'This field is required to login']"
        />
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn
          color="primary"
          @click="login"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <div
    class="msn__box d-flex flex-column pa-3"
    v-else
  >
    <div class="msn__history flex-grow-1 flex-shrink-1 d-flex flex-column">
      <fragment
        v-for="(msg, idx) in history"
        :key="idx"
        >
        <div
          v-if="!idx || (history[idx - 1].name !== history[idx].name)"
          :class="{
            'align-self-start': msg.name !== sessions[session],
            'align-self-end': msg.name === sessions[session],
            'flex-row-reverse': msg.name !== sessions[session],
            'flex-row': msg.name === sessions[session]
          }"
          class="msg__message__sender mx-2 d-flex align-center pa-2"
        >
          <h3>{{msg.name}}</h3>
          <v-icon size="36">mdi-account-circle-outline</v-icon>
        </div>
        <div
          :class="{
            'align-self-start': msg.name !== sessions[session],
            'align-self-end': msg.name === sessions[session],
            'msn__message__others': msg.name !== sessions[session],
            'msn__message__mine': msg.name === sessions[session]
          }"
          class="msn__message white--text"
        >
          {{msg.text}}
        </div>
      </fragment>
    </div>
    <div class="flex-grow-0 flex-shrink-0 pa-2">
      <v-card class="elevation-0">
        <v-textarea
          v-model="message"
          auto-grow
          outlined
          rounded
          flat
          rows="1"
          solo
          row-height="15"
          hide-details
          @keydown.enter="submit"
        ></v-textarea>
        <v-fab-transition>
          <v-btn
            absolute
            dark
            fab
            top
            right
            small
            color="primary"
            v-show="message.trim()"
            @click="send"
          >
            <v-icon>mdi-telegram</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    username: '',
    message: ''
  }),
  props: {
    sessionNo: Number
  },
  computed: {
    ...mapState(['sessions', 'chatHistory']),
    session () {
      return `session${this.sessionNo + 1}`
    },
    history () {
      return this.chatHistory
        .map(m => m.entry || m.message)
        .filter(m => m.name === this.sessions.session1 || m.name === this.sessions.session2)
    }
  },
  methods: {
    login () {
      this.sessions[this.session] = this.username
      this.username = ''
    },
    send () {
      this.$pnPublish({
        channel: 'vueChat',
        message: {
          text: this.message,
          name: this.sessions[this.session]
        }
      })
      this.message = ''
    },
    submit (e) {
      if (!e.shiftKey) {
        event.preventDefault()
        this.send()
      }
    }
  }
}
</script>

<style lang="scss">
.msn {
  &-login {
    &__dialog {
      width: 300px;
    }
  }
  &__box {
    height: 100%;
  }
  &__history {
    overflow: hidden scroll;
  }
  &__message {
    max-width: 100%;
    hyphens: auto;
    line-break: anywhere;
    word-break: break-all;
    padding: 10px;
    margin: 0 12px;
    border-radius: 10px;

    &__mine {
      background-color: #3ad;
      border: 1px solid #8df;
      margin-left: 40px !important;
    }
    &__others {
      background-color: #f85;
      border: 1px solid #fcb;
      margin-right: 40px !important;
    }

    &__sender {
      min-height: 50px;
    }
  }
}

.v-text-field__slot textarea {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}
</style>
