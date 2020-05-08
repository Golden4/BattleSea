<template>
  <div class="gameSeaBattle">
    <template v-for="(n,index) in players">
      <div class="gameCanvas" :key="index">
        <div class="gameCanvas__title">{{n.name}}</div>
        <GameGrid
          :index="index"
          :isActive="movePlayer == index"
          :drawShips="index == 0"
          :canReact="index == 1"
          @endMove="nextMove"
        />
      </div>
    </template>
  </div>
</template>

<script>
import GameGrid from "@/components/BattleSea/GameGrid";

export default {
  data() {
    return {
      gameStage: 0,
      movePlayer: 0,
      players: [{ name: "Вася Пупкин" }, { name: "Компуктер" }]
    };
  },
  methods: {
    nextMove() {
      this.movePlayer = (this.movePlayer + 1) % this.players.length;
    }
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