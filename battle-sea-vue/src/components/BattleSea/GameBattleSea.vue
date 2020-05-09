<template>
  <div class="gameSeaBattle">
    <template v-if="gameStage == 0">
      <div class="gameCanvas">
        <div class="gameCanvas__title">{{getCurrentPlayer.name}}</div>
        <GameGrid
          :isActive="true"
          :drawShips="true"
          :gameStage="gameStage"
          :canInteract="true"
          ref="gameGrid"
        />
      </div>
    </template>

    <template v-if="gameStage == 1">
      <div class="gameCanvas" :key="index" v-for="(n,index) in players">
        <div class="gameCanvas__title">{{n.name}}</div>
        <GameGrid
          @endMove="nextMove"
          @onWon="onWon"
          :isActive="movePlayer == index"
          :drawShips="index == 0"
          :gameStage="gameStage"
          :canInteract="index == 1"
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
  //выполнятеся когда переходит ход
  onMove(gameGrid) {
    this.timerInterval = 1000;
    this.recursivelyTimeout(() => {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      console.log(this.name + ":" + x + " " + y);
      return !gameGrid.shot({ x, y });
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
  name: "GameBattleSea",
  data() {
    return {
      gameStage: 0, //
      movePlayer: 0,
      currentPlayerIndex: 0,

      levelTepmlates: [
        { firstPlayer: Player, secondPlayer: Player },
        { firstPlayer: Player, secondPlayer: Computer }
      ],
      players: [
        new Player({ name: "Вася Пупкин", index: 0 }),
        new Computer({ name: "Компуктер", index: 1 })
      ]
    };
  },
  methods: {
    nextMove() {
      this.movePlayer = (this.movePlayer + 1) % this.players.length;
      this.players[this.movePlayer].onMove(this.$refs.gameGrid[0]);
    },
    onWon(index) {
      console.log(this.players[index].name + " won!");
      gameStage = 3;
    }
  },
  computed: {
    getCurrentPlayer() {
      return this.players[this.currentPlayerIndex];
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