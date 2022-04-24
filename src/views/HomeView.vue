<template>
  <div class="home">
    <b-container>
      <audio src="../assets/notification.wav"></audio>
      <b-row align-h="center">
        <b-card tag="article" class="mb-2" :class="backgroundColor">
          <div>
            <b-button-group>
              <button
                @click="onBtnClick('Pomodoro')"
                :class="{ activeBtn: typeOfBtnClicked === 'Pomodoro' }"
              >
                Pomodoro
              </button>
              <button
                @click="onBtnClick('Short Break')"
                :class="{ activeBtn: typeOfBtnClicked === 'Short Break' }"
              >
                Short Break
              </button>
              <button
                @click="onBtnClick('Long Break')"
                :class="{ activeBtn: typeOfBtnClicked === 'Long Break' }"
              >
                Long Break
              </button>
            </b-button-group>
          </div>
          <b-card-text>
            <span id="minuteForTimeCalculation">{{ minuteHTMLValue }}</span
            >:<span id="second">{{ secondHTMLValue }}</span>
          </b-card-text>
          <b-button
            @click="startClicked(intervalId)"
            v-if="!timerStarted"
            pill
            href="#"
            variant="outline-secondary"
            size="lg"
            ><strong>START</strong></b-button
          >
          <b-button
            class="ml-2"
            v-if="timerStarted"
            @click="stopClicked"
            pill
            href="#"
            variant="outline-secondary"
            size="lg"
            ><strong>STOP</strong></b-button
          >
          <b-button
            class="ml-2"
            v-if="timerStarted"
            @click="resetClicked"
            pill
            href="#"
            variant="outline-secondary"
            size="lg"
            ><strong>RESET</strong></b-button
          >
        </b-card>
      </b-row>
    </b-container>
  </div>
</template>

<script>
const worker = window.Worker ? new Worker("/worker.js") : undefined;
export default {
  name: "HomeView",
  data() {
    return {
      timerStarted: false,
      minuteForTimeCalculation: 25,
      secondForTimeCalculation: 60,
      intervalId: NaN,
      minuteHTMLValue: "25",
      secondHTMLValue: "00",
      typeOfBtnClicked: "Pomodoro",
      resetTimer: false,
      stopTimer: false,
      backgroundColor: {
        pomodoro: true,
        shortBreak: false,
        longBreak: false,
      },
    };
  },
  methods: {
    startClicked(intervalId) {
      clearInterval(this.intervalId);
      this.timerStarted = true;
      this.stopTimer = false;
      if (this.resetTimer) {
        intervalId = NaN;
        this.resetTimer = false;
      }
      if (!intervalId) {
        this.minuteForTimeCalculation = this.minuteForTimeCalculation - 1;
        this.minuteHTMLValue = this.returnData(this.minuteForTimeCalculation);
        this.secondForTimeCalculation = this.secondForTimeCalculation - 1;
        this.secondHTMLValue = this.returnData(this.secondForTimeCalculation);
      }
      this.playAudio();
      worker.postMessage(this.$data);
      worker.onmessage = (e) => {
        Object.assign(this.$data, e.data); // override/replace the data properties
        window.document.title = `${this.minuteHTMLValue}:${this.secondHTMLValue}`;
        // resetTimer is true when the timer finishes
        if (this.resetTimer) {
          this.playAudio();
          this.resetClicked();
        }
      };
    },

    playAudio() {
      const audioElement = document.querySelector("audio");
      audioElement.play();
    },

    resetClicked() {
      this.onBtnClick(this.typeOfBtnClicked);
    },

    stopClicked() {
      this.stopTimer = true;
      Object.assign(this.$data, { stopTimer: this.stopTimer });
      worker.postMessage(this.$data);
      worker.onmessage = (e) => {
        Object.assign(this.$data, e.data); // override/replace the data properties
      };
    },

    onBtnClick(typeOfBtnClicked) {
      window.document.title = "Pomodoro";
      this.typeOfBtnClicked = typeOfBtnClicked;
      this.secondForTimeCalculation = 60;
      this.secondHTMLValue = "00";
      this.resetTimer = true;
      if (typeOfBtnClicked === "Pomodoro") {
        this.minuteForTimeCalculation = 25;
        this.minuteHTMLValue = "25";
        this.backgroundColor = {
          pomodoro: true,
          shortBreak: false,
          longBreak: false,
        };
      } else if (typeOfBtnClicked === "Short Break") {
        this.minuteForTimeCalculation = 5;
        this.minuteHTMLValue = "05";
        this.backgroundColor = {
          pomodoro: false,
          shortBreak: true,
          longBreak: false,
        };
      } else if (typeOfBtnClicked === "Long Break") {
        this.minuteForTimeCalculation = 15;
        this.minuteHTMLValue = "15";
        this.backgroundColor = {
          pomodoro: false,
          shortBreak: false,
          longBreak: true,
        };
      }
      this.stopClicked();
      this.intervalId = NaN;
    },

    returnData(input) {
      return input >= 10 && input !== 60
        ? `${input}`
        : input === 60
        ? "00"
        : `0${input}`;
    },
  },

  destroyed() {
    this.resetClicked();
  },
};
</script>
<style scoped>
.card {
  background-color: var(--international-orange-engineering);
  max-width: 40rem;
  color: white;
}
.btn-outline-secondary,
.btn-outline-secondary:hover {
  color: var(--rich-black-fogra-29);
  border-color: var(--ghost-white);
  background-color: var(--ghost-white);
  font-size: 1.5rem;
}
.card-text {
  font-size: 10rem;
  font-weight: bold;
}
.activeBtn {
  background-color: var(--rich-black-fogra-29);
  color: white;
  border-radius: 0.5rem;
}
.pomodoro {
  background-color: var(--international-orange-engineering);
}
.shortBreak {
  background-color: var(--blue-sapphire);
}
.longBreak {
  background-color: forestgreen;
}
</style>
