<template>
  <v-app>
    <v-app-bar
      app
      class="elevation-0"
      color="primary"
      dark
    >
      <v-row class="d-none d-md-flex flex-nowrap">
        <v-col
          class="d-flex flex-row align-center"
          md="4"
        >
          <v-icon
            v-if="sessions.session1"
            size="36"
          >mdi-account-circle</v-icon>
          <span
            v-if="sessions.session1"
            class="mx-2"
          >{{sessions.session1}}</span>
        </v-col>
        <v-col
          class="d-none d-md-flex flex-row align-center justify-center"
          cols="4"
        >
          <h2 class="mx-3">Duo Messenger</h2>
          <v-icon size="28">
            mdi-telegram
          </v-icon>
        </v-col>
        <v-col
          class="d-flex flex-row-reverse align-center"
          md="4"
        >
          <v-icon
            v-if="sessions.session2"
            size="36"
          >mdi-account-circle</v-icon>
          <span
            v-if="sessions.session2"
            class="mx-2"
          >{{sessions.session2}}</span>
        </v-col>
      </v-row>
      <v-row class="d-md-none">
        <v-col
          class="d-flex flex-row align-center"
          cols="2"
        >
          <v-btn
            :disabled="!sessions.selected"
            icon
            @click="sessions.selected = 0"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-col>
        <v-col
          class="d-flex align-center justify-center"
          cols="8"
        >
          <h2 v-if="sessions.selected === 0"> {{ sessions.session1 || 'Session1' }} </h2>
          <h2 v-if="sessions.selected === 1"> {{ sessions.session2 || 'Session2' }} </h2>
        </v-col>
        <v-col
          class="d-flex flex-row-reverse align-center"
          cols="2"
        >
          <v-btn
            :disabled="!!sessions.selected"
            icon
            @click="sessions.selected = 1"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-row
        class="msn align-stretch"
        :class="sessions.selected ? 'session1' : 'session2'"
        no-gutters
      >
        <v-col
          class="height-limit d-flex flex-row justify-center"
          md="6"
        >
          <msn-session
            class="flex-grow-1"
            :sessionNo="0"
          />
        </v-col>
        <v-col
          class="height-limit d-flex flex-row justify-center"
          md="6"
        >
          <msn-session
            class="flex-grow-1"
            :sessionNo="1"
          />
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import PubNubVue from 'pubnub-vue'

export default {
  computed: {
    ...mapState(['sessions'])
  },
  methods: {
    ...mapMutations(['addMessage', 'initMessages'])
  },
  mounted () {
    this.initMessages(this.$pnGetMessage('vueChat'))
    this.$pnSubscribe({
      channels: ['vueChat']
    })

    PubNubVue.getInstance().history(
      {
        channel: 'vueChat',
        count: 30,
        stringifiedTimeToken: true
      },
      (status, response) => {
        if (status.error) {
          // Exception handling
        } else {
          const { messages } = response
          messages.forEach(msg => this.addMessage(msg))
        }
      }
    )
  }
}
</script>

<style lang="scss">
html {
  overflow: hidden;
}

.v-content__wrap {
  overflow: hidden;
  position: relative;
}

.msn {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  width: 200%;

  transition: left .5s;

  &.session1 {
    left: -100%;
  }
  &.session2 {
    left: 0;
  }
}

@media screen and (min-width: 960px) {
  .msn {
    width: 100%;

    &.session1 {
      left: 0;
    }
    &.session2 {
      left: 0;
    }
  }
}

// Scrollbar customization
::-webkit-scrollbar {
  background: #fff8;
  width: 10px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
  -webkit-border-radius: 4px;
  border-radius: 4px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #0004;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.3);
}
::-webkit-scrollbar-thumb:hover {
  background-color: #08f8;
}

.tapable {
  user-select: none;
  cursor: pointer;
}

.height-limit {
  max-height: 100%;
  overflow: hidden;
}
</style>
