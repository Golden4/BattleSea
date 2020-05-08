<template>
  <div class="gameSeaBattle">
    <template v-for="(n,index) in players">
      <div class="gameCanvas" :key="index">
        <div class="gameCanvas__title">{{n.name}}</div>
        <GameGrid
          @endMove="nextMove"
          :isActive="movePlayer != index"
          :drawShips="index == 0"
          :canReact="index == 1"
          :index="index"
          ref="gameGrid"
        />
      </div>
    </template>
  </div>
</template>

<script>
import GameGrid from "@/components/BattleSea/GameGrid";

export class Player {
  constructor({ name, index }) {
    this.name = name;
    this.index = index;
  }
  onMove() {}
}

export class Computer extends Player {
  constructor(options) {
    super(options);
  }

  onMove(gameGrid) {
    console.log("onMove");
    this.timerInterval = 500;
    this.recursivelyTimeout(() => {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      console.log(x + " " + y);
      return !gameGrid.cellClick({ x, y });
    });
  }

  recursivelyTimeout(action) {
    setTimeout(() => {
      if (action()) {
        this.recursivelyTimeout(action);
      }
    }, this.timerInterval);
  }
}

export default {
  data() {
    return {
      gameStage: 0,
      movePlayer: 0,
      players: [
        new Player({ name: "Вася Пупкин", index: 0 }),
        new Computer({ name: "Компуктер", index: 1 })
      ]
    };
  },
  methods: {
    nextMove() {
      console.log("nextMove");
      this.movePlayer = (this.movePlayer + 1) % this.players.length;

      this.players[this.movePlayer].onMove(this.$refs.gameGrid[0]);
      // const gameGrid = ;
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