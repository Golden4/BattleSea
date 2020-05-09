<template>
  <div class="module">
    <div v-if="title" class="module__title">{{title}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["title", "content"]
};
</script>

<style>
.module {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e9e9e9;
  padding: 15px;
  margin: 10px 5px;
  box-shadow: 0 3px 6px 0px #c8c8c8a8;
}

.module__title {
  font-size: 30px;
  color: black;
  border-bottom: 1px solid #ececec;
  text-align: center;
}
</style>