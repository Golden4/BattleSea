<template>
  <div class="gameGrid">
    <template v-for="i in size">
      <template v-for="j in size">
        <template v-if="i == 1 && j == 1">
          <div class="gameGrid__value" :key="(i+''+j)"></div>
        </template>
        <template v-else-if="i == 1 && j != 1">
          <div
            class="gameGrid__value"
            style="border-bottom: 2px solid #000;"
            :key="(i+''+j)"
          >{{letters[j-2]}}</div>
        </template>
        <template v-else-if="i != 1 && j == 1">
          <div class="gameGrid__value" style="border-right: 2px solid #000;" :key="(i+''+j)">{{i-1}}</div>
        </template>
        <template v-else>
          <div
            @click="gridClick(i-1,j-1)"
            class="gameGrid__square gameGrid__square--selected"
            style="border-bottom: 2px solid #000;border-right: 2px solid #000;"
            :key="(i+''+j)"
          ></div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import GameGrid from "@/components/BattleSea/GameGrid";

export default {
  data() {
    return {
      size: 11,
      letters: "АБВГДЕЖЗИК"
    };
  },
  methods() {
    return {
      gridClick: (i, j) => {
        console.log(i + "  " + j);
      }
    };
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
.gameGrid__square--selected {
  background-color: aqua;
}
.gameGrid__value {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "comic Sans MS";
  font-size: 26px;
}
</style>