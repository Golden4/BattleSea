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
      <GamePlanning @startGame="startGame" :gameGrid="getCurrentPlayer.gameGrid" />
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
import GamePlanning from "@/components/BattleSea/GamePlanning";

export class Player {
  constructor({ name, index, gameGrid }) {
    this.name = name;
    this.index = index;
    this.gameGrid = gameGrid;
  }
  onMove() {}
}

export class Computer extends Player {
  constructor(options) {
    super(options);
  }

  //выполнятеся когда переходит ход на этого игрока
  onMove(enemyGameGrid) {
    this.timerInterval = 1000;
    this.recursivelyTimeout(() => {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      console.log(this.name + ":" + x + " " + y);
      return !enemyGameGrid.shot({ x, y });
    });
  }

  // рекурсивный таймер
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
      gameStage: 0, // 0 - расстановка, 1 - игра, 2 - результат
      movePlayer: 0, // индекс игрока, который ходит
      currentPlayerIndex: 0, // индекс текущего игрок

      // режимы игры
      levelTepmlates: [
        { firstPlayer: Player, secondPlayer: Player },
        { firstPlayer: Player, secondPlayer: Computer }
      ],

      // список игроков
      players: [
        new Player({ name: "Вася Пупкин", index: 0 }),
        new Computer({ name: "Компуктер", index: 1 })
      ]
    };
  },
  mounted() {
    this.getCurrentPlayer.gameGrid = this.$refs.gameGrid;
    console.log(this.getCurrentPlayer.gameGrid);
  },
  methods: {
    startGame() {
      // for (let i = 0; i < this.players.length; i++) {
      //   this.players[i].gameGrid = this.$refs.gameGrid[i];
      //   console.log(this.$refs);
      // }
    },
    //следущий ход
    nextMove() {
      const fromPlayer = this.movePlayer;
      this.movePlayer = (this.movePlayer + 1) % this.players.length;
      this.players[this.movePlayer].onMove(this.$refs.gameGrid[fromPlayer]);
    },
    // вызывается при победе одного из игроков
    onWon(index) {
      console.log(this.players[index].name + " won!");
      gameStage = 3;
    }
  },
  computed: {
    // возр текцщего игрока
    getCurrentPlayer() {
      return this.players[this.currentPlayerIndex];
    }
  },
  components: {
    GameGrid,
    GamePlanning
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