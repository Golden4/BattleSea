<template>
  <div class="page">
    <div class="content">
      <div class="module">
        <GameBattleSea />
      </div>
      <div class="module">© Special for Tensor by Alsynbaev F.</div>
    </div>
  </div>
</template>

<script>
import Module from "@/components/Module";
import GameBattleSea from "@/components/BattleSea/GameBattleSea";

export default {
  name: "Page",
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
}
.content__coloumn-main {
  grid-row-start: 1;
}
.module {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e9e9e9;
  padding: 15px;
  margin: 10px 5px;
  box-shadow: 0 3px 6px 0px #c8c8c8a8;
}
</style>