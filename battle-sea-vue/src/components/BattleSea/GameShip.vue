<template>
  <div
    v-if="gameShip.x == gameShip.ship.x && gameShip.y == gameShip.ship.y && gameShip.drawShips && gameShip.ship.isVisible"
    class="gameGrid__ship"
    :style="shipStyle(gameShip.ship)"
  ></div>
</template>

<script>
// @click="rotateShip(gameShip.ship)"
export default {
  props: ["gameShip"],
  data() {
    return {
      drawShip: true,
      isEditable: true
    };
  },
  methods: {
    shipStyle(k) {
      return {
        width: (k.dir == 0 ? k.size : 1) * 100 + "%",
        height: (k.dir == 1 ? k.size : 1) * 100 + "%"
      };
    },
    rotateShip(ship) {
      if (ship.dir == 0) {
        ship.dir = 1;
      } else {
        ship.dir = 0;
      }
    }
  }
};
</script>

<style>
.gameGrid__ship {
  background: #a600ff3d;
  margin: -2px;
  border: 2px solid #7200af8c;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  transition: all 0.3s ease-out;
  pointer-events: none;
}
</style>