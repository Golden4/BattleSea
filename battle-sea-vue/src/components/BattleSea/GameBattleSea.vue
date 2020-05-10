<template>
  <div class="gameSeaBattle">
    <div class="gameSeaBattle__view">
      <!-- Ввод имени -->
      <GameWelcome @onStart="startWelcome" v-if="(gameStage == 'welcome')" />
      <!-- Режим игры -->
      <GameMode
        @gameModeSelected="gameModeSelected"
        :gameModeTemplates="gameModeTepmlates"
        v-if="(gameStage == 'mode')"
      />

      <div class="gameCanvas" :key="index" v-for="(n,index) in players">
        <template v-if="gameStage == 'prepare' || gameStage == 'game' || gameStage == 'result'">
          <div class="gameCanvas">
            <div
              :class="['gameCanvas__title',{'gameCanvas__title--active':(index == movePlayer)}]"
            >{{players[index].name}}</div>
            <GameGrid
              @endMove="nextMove"
              @onEndGame="onEndGame"
              @gridMounted="gridMounted"
              :index="index"
              :isActive="(gameStage == 'prepare') || (gameStage == 'game' && movePlayer != index)"
              :drawShips="(gameStage == 'prepare') || (gameStage == 'game' && currentPlayerIndex == index)"
              :gameStage="gameStage"
              :canInteract="((gameStage == 'prepare') || (gameStage == 'game' && currentPlayerIndex != index)) && (gameStage != 'result')"
              ref="gameGrid"
            />
          </div>
        </template>
      </div>

      <template v-if="gameStage == 'prepare'">
        <GamePlanning @startGame="startGame" :player="getCurrentPlayer" />
      </template>
    </div>
    <div
      v-if="gameStage == 'game'"
      class="gameSeaBattle__messageBox"
    >{{movePlayer == currentPlayerIndex?'Ваш ход': 'Делает ход '+ players[movePlayer].name }}</div>

    <div class="gameSeaBattle__bottomCont" v-if="gameStage == 'result'">
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
import GameMode from "@/components/BattleSea/GameMode";

export class Player {
  constructor({ name, index, gameGrid }) {
    this.name = name;
    this.index = index;
    this.gameGrid = gameGrid;
  }
  //выполнятеся когда переходит ход на игрока
  onMove() {}
}

//класс легкого компьютера
export class ComputerEasy extends Player {
  constructor(options) {
    super(options);
    this.name = "Легкий компьютер";
  }

  //выполнятеся когда переходит ход на компьютера
  onMove(enemyGameGrid) {
    //если есть запущенный таймер, то чистим его
    if (this.currentTimeout) clearTimeout(this.currentTimeout);

    //задержка между выстрелами
    this.timerInterval = 1000;

    this.recursivelyTimeout(() => {
      //получаем доступные для выстрела координаты
      const avaiblePoints = enemyGameGrid.getAvaiblePointsToShot();
      //выбираем случайные доступные кординаты
      const pointIndex = Math.floor(Math.random() * avaiblePoints.length);
      const pointToShot = avaiblePoints[pointIndex];
      //стреляем по точке
      //если попали по кораблю продолжаем стрелять
      return enemyGameGrid.shot(pointToShot) != 3;
    });
  }

  // рекурсивный таймер
  recursivelyTimeout(action) {
    this.currentTimeout = setTimeout(() => {
      if (action()) {
        this.recursivelyTimeout(action);
      }
    }, this.timerInterval);
  }
}

//класс средний компьютер
export class ComputerMedium extends Player {
  constructor(options) {
    super(options);
    this.name = "Средний компьютер";
    this.hittedShipPoints = [];
  }

  //выполнятеся когда переходит ход на компьютера
  onMove(enemyGameGrid) {
    //если есть запущенный таймер, то чистим его
    if (this.currentTimeout) clearTimeout(this.currentTimeout);
    //задержка между выстрелами
    this.timerInterval = 1000;

    //последние точки куда попали
    this.recursivelyTimeout(() => {
      let pointToShot = -1;
      //получаем доступные для выстрела координаты
      const avaiblePoints = enemyGameGrid.getAvaiblePointsToShot();

      //если есть последние попадания
      if (this.hittedShipPoints.length > 0) {
        let neighborPoints = [];

        //есть есть 1 попадание
        if (this.hittedShipPoints.length == 1) {
          //текущая точка
          const currentPoint = this.hittedShipPoints[0];
          //координыты соседних точек
          neighborPoints = [
            { x: currentPoint.x, y: currentPoint.y + 1 },
            { x: currentPoint.x, y: currentPoint.y - 1 },
            { x: currentPoint.x - 1, y: currentPoint.y },
            { x: currentPoint.x + 1, y: currentPoint.y }
          ];
        }

        //если несколько поаданий
        if (this.hittedShipPoints.length > 1) {
          console.log(this.hittedShipPoints.length > 1);
          let xPoints = [];
          let yPoints = [];

          //делим на координаты на x и y
          for (let i = 0; i < this.hittedShipPoints.length; i++) {
            const hittedShipPoint = this.hittedShipPoints[i];
            xPoints.push(hittedShipPoint.x);
            yPoints.push(hittedShipPoint.y);
          }

          //ищем макс и мин точки по координатам
          const maxPointX = Math.max.apply(Math, xPoints);
          const minPointX = Math.min.apply(Math, xPoints);
          const maxPointY = Math.max.apply(Math, yPoints);
          const minPointY = Math.min.apply(Math, yPoints);

          if (maxPointY != minPointY) {
            //берем соседние точки по вертикали верхних и нижних точек
            neighborPoints = [
              { x: maxPointX, y: minPointY - 1 },
              { x: maxPointX, y: maxPointY + 1 }
            ];
          }

          if (maxPointX != minPointX) {
            //берем соседние точки по горизонтали левых и правых точек
            neighborPoints = [
              { x: minPointX - 1, y: maxPointY },
              { x: maxPointX + 1, y: maxPointY }
            ];
          }
        }

        //отбираем координаты куда можо выстрелить
        let canShotPoints = [];

        for (let i = 0; i < neighborPoints.length; i++) {
          const point = neighborPoints[i];

          for (let j = 0; j < avaiblePoints.length; j++) {
            const avaiblePoint = avaiblePoints[j];
            if (JSON.stringify(avaiblePoint) == JSON.stringify(point)) {
              canShotPoints.push(point);
              break;
            }
          }
        }

        if (canShotPoints) {
          //выбираем случайную доступную сосднюю точку
          const canShotPointIndex = Math.floor(
            Math.random() * canShotPoints.length
          );
          pointToShot = canShotPoints[canShotPointIndex];
        } else {
          this.hittedShipPoints = [];
        }
      }

      if (pointToShot == -1) {
        //выбираем случайные доступные кординаты
        const pointIndex = Math.floor(Math.random() * avaiblePoints.length);
        pointToShot = avaiblePoints[pointIndex];
      }

      //стреляем по координте
      const shotResult = enemyGameGrid.shot(pointToShot);

      //ели попали по караблю
      if (shotResult == 2) {
        //сохраняем последнее попапдние
        this.hittedShipPoints.push(pointToShot);
      }

      //если уничтожили корабль
      if (shotResult == 3) {
        //чистим точки попадний
        this.hittedShipPoints = [];
      }
      //если попали по караблю или уничтожили, то продолжаем
      return shotResult == 3 || shotResult == 2;
    });
  }

  // рекурсивный таймер
  recursivelyTimeout(action) {
    this.currentTimeout = setTimeout(() => {
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
      // 'welcome' - ввод имени
      // 'mode' - выбор режима игры
      // 'prepare' - расстановка,
      // 'game' - игра,
      // 'result' - результат
      gameStageData: "welcome",
      movePlayer: 0, // индекс игрока, который ходит
      currentPlayerIndex: 0, // индекс текущего игрок
      gameModeTepmlateIndex: 1,
      // режимы игры
      gameModeTepmlates: [
        {
          firstPlayer: { comp: Player, type: "Игрок" },
          secondPlayer: { comp: ComputerEasy, type: "Легкий компьютер" }
        },
        {
          firstPlayer: { comp: Player, type: "Игрок" },
          secondPlayer: { comp: ComputerMedium, type: "Средний компьютер" }
        }
      ],

      // список игроков
      players: [],
      enteredName: "Безымянный"
    };
  },

  mounted() {
    this.onChangeStage();
  },
  methods: {
    startWelcome(welcomeVue) {
      this.currentPlayerIndex = 0;

      if (welcomeVue.name) this.enteredName = welcomeVue.name;

      this.gameStage = "mode";
    },
    gameModeSelected(index) {
      this.gameModeTepmlateIndex = index;
      const component = this.gameModeTepmlates[this.gameModeTepmlateIndex]
        .firstPlayer.comp;
      this.players.push(new component({ name: this.enteredName, index: 0 }));
      this.gameStage = "prepare";
    },
    //начать игру
    startGame() {
      this.gameStage = "game";
      for (let i = 0; i < this.$refs.gameGrid.length; i++) {
        this.$refs.gameGrid[i].startGame();
      }
    },
    //вызывается при измении этапа с помощью геттера сеттера
    onChangeStage() {
      if (this.gameStage == "prepare") {
        if (this.$refs.gameGrid)
          this.players[this.currentPlayerIndex] = {
            ...this.players[this.currentPlayerIndex],
            gameGrid: this.$refs.gameGrid[0]
          };
      }

      if (this.gameStage == "game") {
        const component = this.gameModeTepmlates[this.gameModeTepmlateIndex]
          .secondPlayer.comp;
        //добавлние противника
        this.players.push(
          new component({
            index: 1
          })
        );
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
      this.gameStage = "prepare";
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
      this.gameStage = "result";
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
        return this.players[this.currentPlayerIndex];
      }
    }
  },
  components: {
    GameGrid,
    GamePlanning,
    GameWelcome,
    GameMode
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