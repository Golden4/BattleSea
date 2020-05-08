<template>
  <div
    @dragover.prevent
    @drop.prevent="drop"
    :class="['gameGrid',{'gameGrid--inactive':!isActive}]"
  >
    <template v-for="i in size">
      <template v-for="j in size">
        <div v-if="i == 1 && j == 1" class="gameGrid__value" :key="(i+'+'+j)"></div>
        <div v-else-if="i == 1 && j != 1" class="gameGrid__value" :key="(i+'+'+j)">{{letters[j-2]}}</div>
        <div v-else-if="i != 1 && j == 1" class="gameGrid__value" :key="(i+'+'+j)">{{i-1}}</div>
        <GameGridItem
          ref="grid"
          v-else
          @cellClick="cellClick"
          :state="map[i-2][j-2]"
          :x="i-2"
          :y="j-2"
          :key="(i+'+'+j)"
        >
          <template v-for="(k,key) in ships">
            <GameShip :gameShip="{x:j-2, y:i-2, ship:k, drawShips}" :key="key" />
          </template>
        </GameGridItem>
      </template>
    </template>
  </div>
</template>

<script>
import GameGridItem from "@/components/BattleSea/GameGridItem";
import GameShip from "@/components/BattleSea/GameShip";

//класс корабля
class Ship {
  constructor({ x, y, dir, size }) {
    this.x = x; //нач. коорд x
    this.y = y; //нач. коорд y
    this.dir = dir; // поворот 0 = гориз. 1 = вертик.
    this.size = size; // размер от 1 до 4
  }
}

export default {
  data() {
    return {
      isActive: true,
      drawShips: true,
      size: 11, // размер грида
      map: [], //0 = обычный, -1 = мимо, -2 = крест, 1 = корабль
      ships: [],
      marks: [],
      plasableMap: [],
      letters: "АБВГДЕЖЗИК"
    };
  },
  created() {
    this.createRandomShips();
    this.createMap();
  },
  methods: {
    cellClick({ x, y }) {
      if (this.map[x][y] > 0) {
        this.map[x][y] = -2;
      } else if (this.map[x][y] == 0) {
        this.map[x][y] = -1;
      }
    },
    createMap() {
      for (let i = 0; i < this.size; i++) {
        this.map[i] = [];
        for (let j = 0; j < this.size; j++) {
          this.map[i][j] = 0;
        }
      }

      for (let i = 0; i < this.ships.length; i++) {
        const ship = this.ships[i];
        let sizeX = ship.dir == 0 ? ship.size : 1;
        let sizeY = ship.dir == 1 ? ship.size : 1;
        for (let k = ship.x; k < ship.x + sizeX; k++) {
          for (let l = ship.y; l < ship.y + sizeY; l++) {
            this.map[l][k] = i + 1;
          }
        }
      }
    },
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
              size
            });

            if (this.canPlace(ship)) {
              this.addShips(ship);
              placed = true;
            }
          }
        }
      }
    },

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

        let sizeX = ship.dir == 0 ? ship.size : 1;
        let sizeY = ship.dir == 1 ? ship.size : 1;
        let startX = ship.x - 1 >= 0 ? ship.x - 1 : 0;
        let startY = ship.y - 1 >= 0 ? ship.y - 1 : 0;
        let endX =
          ship.x + sizeX + 1 < this.size ? ship.x + sizeX + 1 : this.size;
        let endY =
          ship.y + sizeY + 1 < this.size ? ship.y + sizeY + 1 : this.size;

        for (let k = startX; k < endX; k++) {
          for (let l = startY; l < endY; l++) {
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
    addMarks(...marks) {
      for (let i in marks)
        if (!this.marks.includes(marks[i])) this.marks.push(marks[i]);
    },
    addShips(...ships) {
      //добавить корабль в массив
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
  width: 450px;
  height: 450px;
}
.gameGrid--inactive {
  opacity: 0.4;
  pointer-events: none;
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