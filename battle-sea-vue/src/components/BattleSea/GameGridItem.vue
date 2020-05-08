<template>
  <div
    :class="['gameGrid__square',{'gameGrid__square--hovered':isHovering}]"
    @mouseover="cellHover(true)"
    @mouseout="cellHover(false)"
    @click="cellClick"
  >
    <div v-if="state == -1" class="gameGrid__mark gameGrid__mark--dead">×</div>
    <div v-if="state == -2" class="gameGrid__mark gameGrid__mark--miss">•</div>
    {{value?value:''}}
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["state", "value", "x", "y"],

  data() {
    return {
      canHover: true,
      isHovering: false
    };
  },
  methods: {
    cellClick: function() {
      console.log(this.x + "  " + this.y);
    },
    cellHover: function(hoverItem) {
      if (this.canHover && hoverItem) this.isHovering = true;
      else this.isHovering = false;
    }
  }
};
</script>

<style>
.gameGrid__square {
  border: 1px solid #a600ff;
  margin: -1px;
  background-color: #fff;
  position: relative;
}

.gameGrid__square--hovered {
  background-color: red;
}

.gameGrid__square--selected {
  background-color: aqua;
}

.gameGrid__mark {
  z-index: 10;
  position: absolute;

  width: 100%;
  height: 100%;
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: center;
  align-content: stretch;
  font-size: 90px;
  cursor: default;
  bottom: 10px;
  user-select: none;
  pointer-events: none;
}

.gameGrid__mark--miss {
  color: black;
  font-size: 40px;
  bottom: 4px;
}

.gameGrid__mark--dead {
  color: red;
}
</style>