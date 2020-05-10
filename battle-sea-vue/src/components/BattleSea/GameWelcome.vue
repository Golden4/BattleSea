<template>
  <div class="startView">
    <h2 class="startView__title">
      Добро пожаловать в игру
      <br />Морской бой!
    </h2>
    <p class="startView__name">Введите имя:</p>
    <p>
      <input
        v-model="name"
        type="text"
        class="startView__nameInput"
        placeholder="Имя"
        @input="change"
      />
    </p>
    <p>
      <button class="startView__startBtn" @click.once="onStart">Играть</button>
    </p>
    <p v-if="isActiveMessage">Привет, {{name}}!</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      isActiveMessage: false
    };
  },
  methods: {
    onStart() {
      this.$emit("onStart", this);
    },
    change() {
      this.isActiveMessage = true;
    }
  }
};
</script>
<style>
.startView {
  width: 900px;
  text-align: center;
}
.startView__startBtn {
  padding: 5px 15px;
}
.startView__nameInput {
  padding: 5px;
  width: 200px;
}
</style>