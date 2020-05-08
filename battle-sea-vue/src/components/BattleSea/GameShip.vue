<template>
  <div
    v-if="gameShip.x == gameShip.ship.x && gameShip.y == gameShip.ship.y && gameShip.drawShips && drawShip"
    class="gameGrid__ship"
    @click="rotateShip(gameShip.ship)"
    :style="shipStyle(gameShip.ship)"
  ></div>
</template>

<script>
//
export default {
  props: ["gameShip"],
  data() {
    return {
      drawShip: true,
      isEditable: true
    };
  },
  mounted() {},
  methods: {
    // dragStart: e => {
    //   const target = e.target;

    //   e.dataTransfer.setData("ship_id", target.id);
    //   setTimeout(() => {
    //     target.style.display = "none";
    //   }, 0);

    //   console.log(target);
    // },
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
  /* pointer-events: none; */
}
</style>