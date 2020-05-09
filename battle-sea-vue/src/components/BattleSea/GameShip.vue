<template>
  <div
    v-if="isVisible"
    :class="['gameGrid__ship',
            {'gameGrid__ship--editable':isEditing,
            'gameGrid__ship--layout-green':layoutType=='green',
            'gameGrid__ship--layout-red':layoutType=='red',
            'gameGrid__ship--planning':layoutType=='planning',
            'gameGrid__ship--selected': ship && ship.isSelected}]"
    :style="shipStyle"
    @click="click"
    @dblclick="dblclick"
  ></div>
</template>

<script>
// @click="rotateShip()"
// @mousemove="mousemove"
// @mouseup="mouseup"

export default {
  name: "GameShip",
  props: ["ship", "layoutType", "isEditing"],
  data() {
    return {
      drawShip: true
    };
  },
  methods: {
    click() {
      this.$emit("shipClick", this);
    },
    dblclick() {
      this.$emit("shipDblClick", this);
    },
    rotateShip() {
      if (this.ship.dir == 0) {
        this.ship.dir = 1;
      } else {
        this.ship.dir = 0;
      }
    }
  },
  computed: {
    isVisible() {
      return this.ship.isVisible;
    },
    shipStyle() {
      return {
        width: (this.ship.dir == 0 ? this.ship.size : 1) * 40 + "px",
        height: (this.ship.dir == 1 ? this.ship.size : 1) * 40 + "px"
      };
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
  z-index: 2;
  /* transition: all 0.3s ease-out; */
  pointer-events: none;
}
.gameGrid__ship--layout-green {
  background: #00af1d4d;
  border: 2px solid #36e700;
}
.gameGrid__ship--layout-red {
  background: #af00004d;
  border: 2px solid #e70000;
}
.gameGrid__ship--editable {
  pointer-events: all;
  cursor: pointer;
  transition: none;
}
.gameGrid__ship--dragging {
  pointer-events: fill;
}
.gameGrid__ship--planning {
  position: inherit;
}
.gameGrid__ship--selected {
  background: azure;
}
</style>