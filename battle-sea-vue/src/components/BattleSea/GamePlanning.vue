<template>
  <div class="gamePlanning">
    <h2 class="gamePlanning__title">Расположите корабли</h2>
    <div class="gamePlanning__ships">
      <template v-for="line in 4">
        <div class="gamePlanning__ships_line" :key="line">
          <template v-for="(ship,index) in planingShips">
            <div v-if="5 - line == ship.size" class="gamePlanning__ship" :key="index">
              <GameShip
                @shipClick="selectShip"
                :layoutType="'planning'"
                :isEditing="true"
                :ship="ship"
              />
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="gamePlanning__buttons">
      <div class="gamePlanning__buttonCont" v-for="(btn,index) in buttons" :key="index">
        <button
          class="gamePlanning__button"
          @click="btn.event"
          :disabled="btn.enabled"
          :style="{ backgroundImage: 'url(' + btn.bgImg + ')' }"
        ></button>
        <div class="gamePlanning__buttonLabel">{{btn.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import GameShip from "@/components/BattleSea/GameShip";

export default {
  props: ["player"],
  data() {
    return {
      planingShips: [], // макеты караблей
      selectedShip: null, // выбранный корабль
      //кнопки управления
      buttons: [
        {
          title: "Установка",
          bgImg: require("@/assets/img/ok.png"),
          enabled: this.placeBtnEnabled,
          event: this.placeBtn
        },
        {
          title: "Поворот",
          bgImg: require("@/assets/img/rotate.png"),
          enabled: this.rotateBtnEnabled,
          event: this.rotateBtn
        },
        {
          title: "Случайное расположение кораблей",
          bgImg: require("@/assets/img/random.png"),
          enabled: this.randomBtnEnabled,
          event: this.randomBtn
        },
        {
          title: "Играть",
          bgImg: require("@/assets/img/play.png"),
          enabled: this.canStartGameEnabled,
          event: this.playBtn
        }
      ],
      rotateBtnEnabled: true,
      placeBtnEnabled: true,
      randomBtnEnabled: true,
      canStartGameEnabled: true
    };
  },
  methods: {
    //если удалось разместить корабль, то выбранный кораль скрываем
    placeBtn() {
      if (this.player.gameGrid.placeEditingShip()) {
        this.selectedShip.isVisible = false;
        this.unselectAllShips();
      }
    },
    //кнопка Поворот
    rotateBtn() {
      this.player.gameGrid.rotateEditingShip();
    },
    //кнопка Случайное расположение кораблей
    randomBtn() {
      if (this.player.gameGrid) this.player.gameGrid.deleteEditingShip();
      this.unselectAllShips();
      this.hideAllShips();
      if (this.player.gameGrid) this.player.gameGrid.createRandomShips();
    },
    //кнопка Установка
    playBtn() {
      if (this.canStartGame()) this.$emit("startGame", this);
      else alert("Разместите все корабли!");
    },
    //проверка на то, можно ли начать игру
    canStartGame() {
      if (this.planingShips == null) return false;
      //если все макеты кораблей скрыты, то можно начать
      for (let i = 0; i < this.planingShips.length; i++) {
        if (this.planingShips[i].isVisible) return false;
      }
      return true;
    },
    //выбрать корабль, разместить корабль на гриде
    selectShip(ship) {
      if (this.selectedShip != null) this.selectedShip.isSelected = false;

      if (ship && ship.ship) {
        ship.ship.isSelected = true;
        this.selectedShip = ship.ship;
        this.player.gameGrid.setEditingShip(ship.ship);
      }
    },
    //убрать выделение кораблей
    unselectAllShips() {
      if (this.selectedShip) {
        this.selectedShip.isSelected = false;
        this.selectedShip = null;
      }
    },
    //скрыть все макеты кораблей
    hideAllShips() {
      for (let i = 0; i < this.planingShips.length; i++) {
        this.planingShips[i].isVisible = false;
      }
    }
  },
  created() {
    //создание все макетов корблей
    for (let i = 4; i >= 1; i--) {
      for (let j = 1; j <= 5 - i; j++) {
        this.planingShips.push({
          x: 0,
          y: 0,
          size: i,
          dir: 0,
          isSelected: false,
          isVisible: true
        });
      }
    }
  },
  components: {
    GameShip
  }
};
</script>

<style>
.gamePlanning {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 450px;
}

.gamePlanning__ships_line {
  width: 100%;
  height: 40px;
  margin: 20px 0;
  display: flex;
}
.gamePlanning__buttonCont {
  text-align: center;
  width: 100px;
}
.gamePlanning__button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #98007f;
  background-position: center;
  background-size: 50%;
  background-repeat: no-repeat;
  background-color: #cb00a9;
  box-shadow: inset -1px 3px 0px rgba(255, 255, 255, 0.5),
    2px 3px 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.1s;
  outline: none;
}
.gamePlanning__button:hover {
  background-color: #cf3db7;
  border: 2px solid #c949b3;
  transform: scale(1.1);
}
.gamePlanning__button:active {
  transform: scale(1);
}
.gamePlanning__button:disabled,
.gamePlanning__button[disabled] {
  background-color: #cccccc;

  border: 2px solid #888888;
  cursor: not-allowed !important;
}

.gamePlanning__ship {
  margin: 0 20px;
}
.gamePlanning__buttons {
  display: flex;
  margin: 10px 0 0 0;
  justify-content: space-around;
}
.gamePlanning__title {
  text-align: center;
}
</style>