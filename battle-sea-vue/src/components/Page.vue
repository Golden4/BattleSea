<template>
  <div class="page">
    <div class="content">
      <Module :title="componentTemplates[0].title">
        <component :is="componentTemplates[0].Comp"></component>
      </Module>

      <Module>© Special for Tensor by Alsynbaev F.</Module>
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
</style>