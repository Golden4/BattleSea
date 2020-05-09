<template>
  <div
    :id="id"
    :class=" ['gameGrid__square',{'gameGrid__square--hovered':isHovering}]"
    @mouseover="cellMouseOver"
    @click="cellClick"
    @mouseout="cellMouseOut"
  >
    <transition name="gameGrid__mark--transition">
      <div v-if="info.map.state == -1" class="gameGrid__mark gameGrid__mark--miss">•</div>
    </transition>

    <transition name="gameGrid__mark--transition">
      <div v-if="info.map.state == -2" class="gameGrid__mark gameGrid__mark--dead">×</div>
    </transition>
    {{info.value}}
    <slot />
  </div>
</template>

<script>
export default {
  props: ["id", "info", "canClick", "needHover", "x", "y"],

  data() {
    return {
      isHovering: false
    };
  },
  methods: {
    //при нахождении мышки на элементе
    //отображаем эффект наведения
    cellMouseOver(e) {
      if (this.canClick && this.needHover && this.info.map.state >= 0)
        this.cellHover(true);
      this.$emit("cellMouseOver", this);
    },
    //при выходе мышки из элемента
    //убираем эффект наведения
    cellMouseOut() {
      if (this.canClick && this.needHover) this.cellHover(false);
    },
    //при клике вызываем эвент клика
    cellClick() {
      if (this.canClick) this.$emit("cellClick", this);
    },
    cellHover(hoverItem) {
      if (this.canClick && hoverItem && this.info.map.state >= 0) {
        this.isHovering = true;
      } else this.isHovering = false;
    }
  }
};
</script>

<style>
.gameGrid__mark--transition-enter-active {
  animation: bounce-in 0.5s;
}
.gameGrid__mark--transition-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.gameGrid__square {
  border: 1px solid #a600ff;
  margin: -1px;
  background-color: #fff;
  position: relative;
  pointer-events: all;
}

.gameGrid__square--hovered {
  background: rgba(255, 0, 0, 0.384);
  transition: all 0.3s ease;
  cursor: crosshair;
}

.gameGrid__square--selected {
  background-color: aqua;
}
.gameGrid__clickable {
  width: 100%;
  height: 100%;
  pointer-events: all;
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
  transition: all 0.5s ease-in-out;
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