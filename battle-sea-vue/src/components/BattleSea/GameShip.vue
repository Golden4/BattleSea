<template>
  <div
    v-if="isVisible"
    :class="['gameGrid__ship',
            {'gameGrid__ship--editable':isEditing,
            'gameGrid__ship--layout-green':layoutType=='green',
            'gameGrid__ship--layout-red':layoutType=='red',
            'gameGrid__ship--dragging': isDragging}]"
    :style="shipStyle"
    @mousedown="mousedown"
    @dragstart.stop
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
      isDragging: false,
      drawShip: true
    };
  },
  methods: {
    mousedown(e) {
      const elem = e.srcElement;
      elem.style.position = "absolute";
      this.moveAt(e, elem);
      document.body.appendChild(elem);
      elem.style.zIndex = 1000;
      this.isDragging = true;

      document.onmousemove = function(e) {
        this.moveAt(e, elem);
        console.log("sadadad");
        // elem.hidden = true;
        // let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        // elem.hidden = false;
      }.bind(this);

      elem.onmouseup = function() {
        console.log("sadadad");
        document.onmousemove = null;
        elem.onmouseup = null;
        this.isDragging = false;
      }.bind(this);
    },
    moveAt(e, elem) {
      elem.style.left = e.pageX - elem.offsetWidth / 2 + "px";
      elem.style.top = e.pageY - elem.offsetHeight / 2 + "px";
      // console.log("moving" + elem.style.left + "  " + elem.style.top);
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
  transition: all 0.3s ease-out;
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
  cursor: move;
  transition: none;
}
.gameGrid__ship--dragging {
  pointer-events: fill;
}
</style>