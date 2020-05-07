<template>
  <div class="gameSeaBattle">
    <template v-for="n in players">
      <div class="gameCanvas" :key="n.name">
        <div class="gameCanvas__title">{{n.name}}</div>
        <GameGrid />
      </div>
    </template>
  </div>
</template>

<script>
import GameGrid from "@/components/BattleSea/GameGrid";

export default {
  data() {
    return {
      players: [{ name: "Вася Пупкин" }, { name: "Компуктер" }]
    };
  },
  components: {
    GameGrid
  }
};
</script>

<style>
.gameSeaBattle {
  display: flex;
  justify-content: space-around;
}
.gameCanvas {
  display: flex;
  flex-direction: column;
}
.gameCanvas__title {
  text-align: center;
  font-size: 26px;
}
</style>