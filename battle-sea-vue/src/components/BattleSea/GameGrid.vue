<template>
  <div :class="['gameGrid',{'gameGrid--inactive':!isActive}]">
    <template v-for="i in 11">
      <template v-for="j in 11">
        <div v-if="i == 1 && j == 1" class="gameGrid__value" :key="(i+'+'+j)"></div>
        <div v-else-if="i == 1 && j != 1" class="gameGrid__value" :key="(i+'+'+j)">{{letters[j-2]}}</div>
        <div v-else-if="i != 1 && j == 1" class="gameGrid__value" :key="(i+'+'+j)">{{i-1}}</div>
        <GameGridItem
          ref="grid"
          v-else
          :id="'cell'+(j-2)+(i-2)"
          :x="(j-2)"
          :y="(i-2)"
          @cellClick="cellClick"
          @cellMouseOver="cellMouseOver"
          :info="{map:map[i-2][j-2], x:i-2,y:j-2}"
          :key="(i+'+'+j)"
          :canClick="canInteract"
          :needHover="canInteract && gameStage == 1"
        >
          <template v-for="(k,key) in ships">
            <GameShip
              v-if="j-2 == k.x && i-2 == k.y"
              :ship="k"
              :id="'ship'+(j-2)+'+'+(i-2)"
              :isEditing="true"
              :key="key"
            />
          </template>
          <GameShip
            v-if="curEditingShip != null && curEditingShip.ship != null && j-2 == curEditingShip.ship.x && i-2 == curEditingShip.ship.y"
            :ship="curEditingShip.ship"
            :layoutType="curEditingShip.layoutType"
            :key="(i+''+j)"
          />
        </GameGridItem>
      </template>
    </template>
  </div>
</template>

<script>
import GameGridItem from "@/components/BattleSea/GameGridItem";
import GameShip from "@/components/BattleSea/GameShip";

//класс корабля
export class Ship {
  constructor({ x, y, dir, size, isVisible }) {
    this.x = x; //нач. коорд x
    this.y = y; //нач. коорд y
    this.dir = dir; // поворот 0 = гориз. 1 = вертик.
    this.size = size; // размер от 1 до 4
    this.isVisible = isVisible; //видимость
    this.isDead = false; //состояние
  }

  // "убить" корабль и отобразить
  die() {
    this.isVisible = true;
    this.isDead = true;
  }

  //возвращем координты занимаемой области, включая соседние клетки
  getOccupyRange() {
    let sizeX = this.dir == 0 ? this.size : 1;
    let sizeY = this.dir == 1 ? this.size : 1;
    let startX = this.x - 1 >= 0 ? this.x - 1 : 0;
    let startY = this.y - 1 >= 0 ? this.y - 1 : 0;
    let endX = this.x + sizeX + 1 < 10 ? this.x + sizeX + 1 : 10;
    let endY = this.y + sizeY + 1 < 10 ? this.y + sizeY + 1 : 10;
    return { startX, startY, endX, endY };
  }
}

export default {
  name: "GameGrid",
  props: ["index", "gameStage", "isActive", "drawShips", "canInteract"],
  data() {
    return {
      // isActive: true,
      // drawShips: true,
      // canInteract: true,
      // size: 10, // размер грида
      map: [], //0 = обычный, -1 = мимо, -2 = крест, 1,2,3... = индексы кораблей
      ships: [], // спсиок коаблей
      curEditingShip: null, // планирование корабля
      plasableMap: [], // карта доспночти размещения состоит из true и false
      letters: "АБВГДЕЖЗИК" // буквы клеток по горизотали сверху
    };
  },
  created() {
    // this.createRandomShips();
    this.createMap();
  },
  methods: {
    // при наведении на клетку, cell - это vue component клетки
    cellMouseOver(cell) {},
    setEditingShip(ship) {
      let newShip = new Ship({
        x: 3,
        y: 3,
        dir: ship.dir,
        size: ship.size,
        isVisible: true
      });

      let layoutType = "red";

      if (this.canPlace(newShip)) {
        layoutType = "green";
      }

      this.curEditingShip = { ship: newShip, layoutType };
    },
    editEditingShip({ x, y, dir, size }) {
      if (!this.curEditingShip || !this.curEditingShip.ship) return;

      if (x != null && y != null) {
        this.curEditingShip.ship.x = x;
        this.curEditingShip.ship.y = y;
      }
      if (dir != null) {
        this.curEditingShip.ship.dir = dir;
      }

      let layoutType = "red";

      if (this.canPlace(this.curEditingShip.ship)) {
        layoutType = "green";
      }

      this.curEditingShip.layoutType = layoutType;
    },
    rotateEditingShip() {
      if (this.curEditingShip && this.curEditingShip.ship)
        this.editEditingShip({ dir: (this.curEditingShip.ship.dir + 1) % 2 });
    },
    deleteEditingShip() {
      this.curEditingShip = null;
    },
    placeEditingShip() {
      if (this.curEditingShip && this.curEditingShip.layoutType == "green") {
        this.addShips(this.curEditingShip.ship);
        this.curEditingShip = null;
        return true;
      }
      return false;
    },
    //при нажатии на клетку, передаем координаты нажатой клетки
    cellClick({ x, y }) {
      //если подготовительная стадия игры, то поставить корабль на клетку
      if (this.gameStage == 0) {
        this.editEditingShip({ x, y });
      }
      //если стадия начала игры, то стрелять
      if (this.gameStage == 1) return this.shot({ x, y });
    },
    shot({ x, y }) {
      if (!this.isActive) return false;

      let destoyedShip = false;

      const map = this.map[x][y];
      const newRow = this.map[x].slice(0);
      //ставим маркет либо крест, либо точка
      if (map.state > 0) {
        newRow[y].state = -2;
        destoyedShip = true;
        this.$set(this.map, x, newRow);
      } else if (map.state == 0) {
        newRow[y].state = -1;
        this.$set(this.map, x, newRow);
      } else {
        return false;
      }
      let allShipsCount = 0;
      if (destoyedShip) {
        //Считаем кол-во частей кораблей
        for (let shipIndex = 0; shipIndex < this.ships.length; shipIndex++) {
          const shipCount = 0;
          for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
              if (
                this.map[i][j].state > 0 &&
                this.map[i][j].state == shipIndex + 1
              )
                shipCount++;
            }
          }
          allShipsCount += shipCount;
          //если нету частей и корабль жив, тогда меняем состояние клеток вокруг корабля и "убиваем"
          const ship = this.ships[shipIndex];
          if (shipCount == 0 && !ship.isDead) {
            ship.die();

            const range = ship.getOccupyRange();

            for (let k = range.startX; k < range.endX; k++) {
              for (let l = range.startY; l < range.endY; l++) {
                if (this.map[l][k].state >= 0) {
                  const newRow = this.map[l].slice(0);
                  newRow[k].state = -1;
                  this.$set(this.map, l, newRow);
                }
              }
            }
            break;
          }
        }
      }

      if (destoyedShip && allShipsCount == 0) {
        this.$emit("onWon", this.index);
      }

      if (!destoyedShip) {
        this.$emit("endMove", this.index);
        return true;
      }
      return false;
    },
    createMap() {
      for (let i = 0; i < 10; i++) {
        this.map[i] = [];
        for (let j = 0; j < 10; j++) {
          this.map[i][j] = { state: 0 };
        }
      }

      for (let i = 0; i < this.ships.length; i++) {
        const ship = this.ships[i];
        let sizeX = ship.dir == 0 ? ship.size : 1;
        let sizeY = ship.dir == 1 ? ship.size : 1;
        for (let k = ship.x; k < ship.x + sizeX; k++) {
          for (let l = ship.y; l < ship.y + sizeY; l++) {
            this.map[l][k].state = i + 1;
          }
        }
      }
    },

    //разместить случайным образом корабли
    createRandomShips() {
      this.ships = [];
      for (let size = 4; size >= 1; size--) {
        for (let count = 0; count < 5 - size; count++) {
          let placed = false;

          while (!placed) {
            const ship = new Ship({
              x: Math.floor(Math.random() * 10),
              y: Math.floor(Math.random() * 10),
              dir: Math.random() > 0.5 ? 0 : 1,
              size,
              isVisible: this.drawShips
            });

            if (this.canPlace(ship)) {
              this.addShips(ship);
              placed = true;
            }
          }
        }
      }
    },
    // можно ли разместить корабль
    canPlace(ship) {
      if (
        (ship.dir == 0 && ship.x + ship.size > 10) ||
        (ship.dir == 1 && ship.y + ship.size > 10)
      )
        return false;

      let map = this.plasableMap;
      for (let i = 0; i < 11; i++) {
        map[i] = [];
        for (let j = 0; j < 11; j++) {
          map[i][j] = true;
        }
      }

      for (let i = 0; i < this.ships.length; i++) {
        const ship = this.ships[i];

        const range = ship.getOccupyRange();

        for (let k = range.startX; k < range.endX; k++) {
          for (let l = range.startY; l < range.endY; l++) {
            map[k][l] = false;
          }
        }
      }
      if (ship.dir == 0)
        for (let i = 0; i < ship.size; i++) {
          if (!map[ship.x + i][ship.y]) return false;
        }
      else
        for (let i = 0; i < ship.size; i++) {
          if (!map[ship.x][ship.y + i]) return false;
        }

      return true;
    },

    //добавить корабль в список кораблей
    addShips(...ships) {
      for (let i in ships) {
        if (!this.ships.includes(ships[i])) this.ships.push(ships[i]);
      }
    }
  },
  components: {
    GameGridItem,
    GameShip
  }
};
</script>

<style>
.gameGrid {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(11, 1fr);
  justify-items: stretch;
  align-items: stretch;
  width: 440px;
  height: 440px;
}
.gameGrid--inactive {
  opacity: 0.5;
  pointer-events: none;
  transition: all 0.3s ease;
}

.gameGrid__value {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "comic Sans MS";
  font-size: 28px;
  color: #a600ff;
  pointer-events: none;
  cursor: default;
  user-select: none;
}
</style>