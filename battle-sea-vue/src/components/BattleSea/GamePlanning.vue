<template>
  <div class="gamePlanning">
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
          :disabled="!btn.enabled"
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
  props: ["gameGrid"],
  data() {
    return {
      planingShips: [],
      selectedShip: null,
      buttons: [
        {
          title: "Установка",
          bgImg: require("@/assets/img/ok.png"),
          enabled: this.placeBtnEnabled(),
          event: this.placeBtn
        },
        {
          title: "Поворот",
          bgImg: require("@/assets/img/rotate.png"),
          enabled: this.rotateBtnEnabled(),
          event: this.rotateBtn
        },
        {
          title: "Случайное расположение кораблей",
          bgImg: require("@/assets/img/random.png"),
          enabled: this.randomBtnEnabled(),
          event: this.randomBtn
        },
        {
          title: "Играть",
          bgImg: require("@/assets/img/play.png"),
          enabled: this.playBtnEnabled(),
          event: this.playBtn
        }
      ]
    };
  },
  methods: {
    placeBtn() {
      if (this.gameGrid.placeEditingShip()) {
        this.selectedShip.isVisible = false;
        this.unselectAllShips();
      }
    },
    rotateBtn() {
      this.gameGrid.rotateEditingShip();
    },
    randomBtn() {
      this.gameGrid.deleteEditingShip();
      this.unselectAllShips();
      this.hideAllShips();
      this.gameGrid.createRandomShips();
    },
    playBtn() {
      console.log(this.canStartGame());
      if (this.canStartGame()) this.$emit("startGame", this);
    },
    canStartGame() {
      if (this.planingShips == null) return false;

      for (let i = 0; i < this.planingShips.length; i++) {
        if (this.planingShips[i].isVisible) return false;
      }
      return true;
    },
    selectShip(ship) {
      if (this.selectedShip != null) this.selectedShip.isSelected = false;

      if (ship && ship.ship) {
        ship.ship.isSelected = true;
        this.selectedShip = ship.ship;
        this.gameGrid.setEditingShip(ship.ship);
      }
    },
    unselectAllShips() {
      if (this.selectedShip) {
        this.selectedShip.isSelected = false;
        this.selectedShip = null;
      }
    },
    hideAllShips() {
      for (let i = 0; i < this.planingShips.length; i++) {
        this.planingShips[i].isVisible = false;
      }
    },
    placeBtnEnabled() {
      return true;
    },
    rotateBtnEnabled() {
      return true;
    },
    randomBtnEnabled() {
      return true;
    },
    playBtnEnabled() {
      return this.canStartGame();
    }
  },
  created() {
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
  mounted() {
    this.selectShip(this.planingShips[0]);
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
.gamePlanning__buttonCont {
  text-align: center;
  width: 100px;
}
.gamePlanning__button:hover {
  background-color: #cf3db7;
  border: 2px solid #c949b3;
  transform: scale(1.1);
}
.gamePlanning__button:disabled,
.gamePlanning__button[disabled] {
  background-color: #cccccc;

  border: 2px solid #888888;
  cursor: not-allowed !important;
}
.gamePlanning__button:active {
  transform: scale(1);
}
.gamePlanning__buttonLabel {
}
.gamePlanning__ship {
  margin: 0 20px;
}
.gamePlanning__buttons {
  display: flex;
  margin: 10px 0 0 0;
  justify-content: space-around;
}
</style>