<template>
  <div
    :class="['gameGrid__square',{'gameGrid__square--hovered':isHovering}]"
    @mouseover="cellHover(true)"
    @mouseout="cellHover(false)"
  >
    <div
      v-if="canReact && info.map.state >= 0"
      class="gameGrid__clickable"
      @click="$emit('cellClick', { x: info.x, y: info.y })"
    ></div>

    <div v-if="info.map.state == -1" class="gameGrid__mark gameGrid__mark--miss">•</div>
    <div v-if="info.map.state == -2" class="gameGrid__mark gameGrid__mark--dead">×</div>
    {{info.value?info.value:''}}
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["info", "canReact"],

  data() {
    return {
      isHovering: false
    };
  },
  methods: {
    cellHover: function(hoverItem) {
      if (this.canReact && hoverItem && this.info.map.state >= 0)
        this.isHovering = true;
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
  transition: all 0.2s ease;
}

.gameGrid__square--hovered {
  background: red;
}

.gameGrid__square--selected {
  background-color: aqua;
}
.gameGrid__clickable {
  width: 100%;
  height: 100%;
  position: absolute;
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