<template>
  <div class="page">
    <div class="content">
      <Module v-for="(comp,index) in componentTemplates" :key="index" :title="comp.title">
        <component :is="comp.Comp"></component>
      </Module>

      <Module>© Specially for the Tensor from Alsynbaev Fanis.</Module>
    </div>
  </div>
</template>

<script>
import Module from "@/components/Module";
import GameBattleSea from "@/components/BattleSea/GameBattleSea";

export default {
  name: "Page",
  data() {
    return {
      componentTemplates: [
        {
          title: "Морской бой",
          Comp: "GameBattleSea"
        }
      ]
    };
  },
  components: {
    Module,
    GameBattleSea
  }
};
</script>

<style>
.page {
  width: 100%;
  position: relative;
  min-width: 300px;
  max-width: 1200px;
  margin: 0 0 50px 0;
  padding: 0 10px;
}
.content {
  padding: 0 10px;
  display: grid;
  width: 100%;
}
.content__coloumn-main {
  grid-row-start: 1;
}
button {
  border: 2px solid #98007f;
  background-position: center;
  background-size: 50%;
  background-repeat: no-repeat;
  background-color: #cb00a9;
  box-shadow: inset -1px 3px 0px rgba(255, 255, 255, 0.5),
    2px 3px 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.1s;
  outline: none;
  border-radius: 10px;
  color: white;
  font-size: 20px;
}
button:hover {
  background-color: #cf3db7;
  border: 2px solid #c949b3;
  transform: scale(1.1);
}
button:active {
  transform: scale(1);
}
</style>