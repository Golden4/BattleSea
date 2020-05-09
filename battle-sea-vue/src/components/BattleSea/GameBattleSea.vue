<template>
  <div class="gameSeaBattle">
    <div class="gameSeaBattle__view">
      <GameWelcome @onStart="startPrepare" v-if="(gameStage == -1)" />

      <div class="gameCanvas" :key="index" v-for="(n,index) in players">
        <template v-if="gameStage == 0 || gameStage == 1 || gameStage == 2">
          <div class="gameCanvas">
            <div
              :class="['gameCanvas__title',{'gameCanvas__title--active':(index == movePlayer)}]"
            >{{players[index].name}}</div>
            <GameGrid
              @endMove="nextMove"
              @onEndGame="onEndGame"
              @gridMounted="gridMounted"
              :index="index"
              :isActive="(gameStage == 0) || (gameStage == 1 && movePlayer != index)"
              :drawShips="(gameStage == 0) || (gameStage == 1 && currentPlayerIndex == index)"
              :gameStage="gameStage"
              :canInteract="((gameStage == 0) || (gameStage == 1 && currentPlayerIndex != index)) && (gameStage != 2)"
              ref="gameGrid"
            />
          </div>
        </template>
      </div>

      <template v-if="gameStage == 0">
        <GamePlanning @startGame="startGame" :player="getCurrentPlayer" />
      </template>
    </div>
    <div
      v-if="gameStage == 1"
      class="gameSeaBattle__messageBox"
    >{{movePlayer == currentPlayerIndex?'Ваш ход': 'Делает ход '+ players[movePlayer].name }}</div>

    <div class="gameSeaBattle__bottomCont" v-if="gameStage == 2">
      <div
        class="gameSeaBattle__messageBox"
        :style="{fontWeight:'bold'}"
      >{{movePlayer == currentPlayerIndex?'Поздравляю! Вы победили!': 'Победил: '+ players[movePlayer].name }}</div>
      <button class="gameSeaBattle__retryBtn" @click="retryBtn">Повторить</button>
    </div>
  </div>
</template>

<script>
import GameGrid from "@/components/BattleSea/GameGrid";
import GamePlanning from "@/components/BattleSea/GamePlanning";
import GameWelcome from "@/components/BattleSea/GameWelcome";

export class Player {
  constructor({ name, index, gameGrid }) {
    this.name = name;
    this.index = index;
    this.gameGrid = gameGrid;
  }
  //выполнятеся когда переходит ход на игрока
  onMove() {}
}

export class Computer extends Player {
  constructor(options) {
    super(options);
  }

  //выполнятеся когда переходит ход на компьютера
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
      gameStageData: -1, // -1 -ввод имени 0 - расстановка, 1 - игра, 2 - результат
      movePlayer: 0, // индекс игрока, который ходит
      currentPlayerIndex: 0, // индекс текущего игрок

      // режимы игры
      levelTepmlates: [
        { firstPlayer: Player, secondPlayer: Player },
        { firstPlayer: Player, secondPlayer: Computer }
      ],

      // список игроков
      players: [
        // new Computer({ name: "Компуктер", index: 1 })
      ]
    };
  },

  mounted() {
    this.onChangeStage();
  },
  methods: {
    //начать планироавние
    startPrepare(welcomeVue) {
      this.currentPlayerIndex = 0;
      this.players.push(
        new Player({ name: welcomeVue.name || "Безымянный", index: 0 })
      );
      this.gameStage = 0;
    },
    //начать игру
    startGame() {
      this.gameStage = 1;
      for (let i = 0; i < this.$refs.gameGrid.length; i++) {
        this.$refs.gameGrid[i].startGame();
      }
    },
    //вызывается при измении этапа с помощью геттера сеттера
    onChangeStage() {
      if (this.gameStage == 0) {
        if (this.$refs.gameGrid)
          this.players[this.currentPlayerIndex] = {
            ...this.players[this.currentPlayerIndex],
            gameGrid: this.$refs.gameGrid[0]
          };
      }

      if (this.gameStage == 1) {
        //добавлние противника
        this.players.push(new Computer({ name: "Компьютер", index: 1 }));
      }
    },
    gridMounted(grid) {
      if (this.players[grid.index]) {
        this.$set(this.players[grid.index], "gameGrid", grid);
      }
    },
    //при нажатии кнопки повтора
    retryBtn() {
      //меняем этап подготовки
      this.gameStage = 0;
      //оставляем только 1 игрока
      this.players = this.players.slice(0, 1);
      //у грида все очищаем
      this.players[this.currentPlayerIndex].gameGrid.resetAll();
    },
    //сделать следующий ход
    nextMove() {
      const fromPlayer = this.movePlayer;
      this.movePlayer = (this.movePlayer + 1) % this.players.length;
      this.players[this.movePlayer].onMove(this.$refs.gameGrid[fromPlayer]);
    },
    // вызывается при победе одного из игроков, передается индекс програвшего
    onEndGame(index) {
      const enemyIndex = (index + 1) % this.players.length;
      this.gameStage = 2;
    }
  },
  computed: {
    //этап
    gameStage: {
      get: function() {
        return this.gameStageData;
      },
      set: function(value) {
        this.gameStageData = value;
        this.onChangeStage();
      }
    },
    // возр текцщего игрока
    getCurrentPlayer: {
      get: function() {
        console.log(this.players[this.currentPlayerIndex]);
        return this.players[this.currentPlayerIndex];
      }
    }
  },
  components: {
    GameGrid,
    GamePlanning,
    GameWelcome
  }
};
</script>

<style>
.gameSeaBattle__view {
  display: flex;
  justify-content: space-around;
}
.gameSeaBattle__messageBox {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 23px;
}
.gameSeaBattle__retryBtn {
  padding: 10px 15px;
}
.gameCanvas {
  display: flex;
  flex-direction: column;
}
.gameCanvas__title {
  text-align: center;
  font-size: 26px;
  transition: all 0.3s linear;
  padding: 0 20px 5px 20px;
  align-self: center;
  justify-self: center;
}
.gameCanvas__title--active {
  background: rgba(128, 255, 0, 0.253);
  border-radius: 10px;
}
.gameSeaBattle__bottomCont {
  text-align: center;
}
</style>