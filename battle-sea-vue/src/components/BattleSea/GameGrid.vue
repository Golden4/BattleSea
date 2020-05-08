<template>
  <div :class="['gameGrid',{'gameGrid--inactive':!isActive}]">
    <template v-for="i in size">
      <template v-for="j in size">
        <div v-if="i == 1 && j == 1" class="gameGrid__value" :key="(i+'+'+j)"></div>
        <div v-else-if="i == 1 && j != 1" class="gameGrid__value" :key="(i+'+'+j)">{{letters[j-2]}}</div>
        <div v-else-if="i != 1 && j == 1" class="gameGrid__value" :key="(i+'+'+j)">{{i-1}}</div>
        <GameGridItem
          ref="grid"
          v-else
          :state="gridItems[i-2][j-2]"
          :x="j-1"
          :y="i-1"
          :key="(i+'+'+j)"
        >
          <template v-for="k in ships">
            <div
              v-if="(j-2) == k.x && (i-2) == k.y"
              class="gameGrid__ship"
              :style="shipStyle(k)"
              :key="k.x + ' ' + k.y"
            ></div>
          </template>
        </GameGridItem>
      </template>
    </template>
    <!-- <div class="gameGrid__ship"></div> -->
  </div>
</template>

<script>
import GameGridItem from "@/components/BattleSea/GameGridItem";

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
      size: 11, // размер грида
      letters: "АБВГДЕЖЗИК",
      gridItems: [], //0 = обычный, -1 = мимо, -2 = крест, 1... и т.д индексы кораблей
      ships: [],
      marks: [],
      plasableMap: []
    };
  },
  created() {
    //инициализация карты нулями
    for (let i = 0; i < this.size; i++) {
      this.gridItems[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.gridItems[i][j] = 0;
      }
    }
    this.addShips(new Ship({ x: 0, y: 0, dir: 0, size: 4 }));
    this.addShips(new Ship({ x: 5, y: 5, dir: 0, size: 2 }));

    this.addShips(new Ship({ x: 8, y: 5, dir: 1, size: 3 }));
    this.getCanPlace(5, 6);
  },
  methods: {
    createShips() {
      for (let size = 1; size <= 4; size++) {
        for (let count = 1; count <= size; count++) {
          this.addShips(new Ship({ x: 0, y: 0, dir: 0, size }));
        }
      }
    },
    getCanPlace(x, y) {
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
      return map[x][y];
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
    },
    shipStyle(k) {
      return {
        width: (k.dir == 0 ? k.size : 1) * 100 + "%",
        height: (k.dir == 1 ? k.size : 1) * 100 + "%"
      };
    }
  },
  components: {
    GameGridItem
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

.gameGrid__ship {
  background: #a600ff3d;
  margin: -2px;
  border: 2px solid #7200af8c;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
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