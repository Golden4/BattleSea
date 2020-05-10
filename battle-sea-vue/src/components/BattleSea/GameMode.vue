<template>
  <div class="gameMode">
    <h2 class="gameMode__title">Выберите сложность</h2>
    <div class="gameMode__players">
      <div class="gameMode__player" v-for="(gameMode,index) in gameModeTemplates" :key="index">
        <button
          class="gameMode__playerBtn"
          @click="selectGameMode(index)"
        >{{gameMode.firstPlayer.type}} vs {{gameMode.secondPlayer.type}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["gameModeTemplates"],
  data() {
    return {
      selectedMode: 0
    };
  },
  methods: {
    // onStart() {
    //   this.$emit("onStart", this);
    // },
    selectGameMode(index) {
      this.selectedMode = index;
      this.$emit("gameModeSelected", this.selectedMode);
    }
  }
};
</script>
<style>
.gameMode {
  width: 900px;
  text-align: center;
}
.gameMode__players {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.gameMode__player {
  margin: 15px 0;
}
.gameMode__playerBtn {
  padding: 20px;
}
</style>