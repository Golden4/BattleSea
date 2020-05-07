<template>
  <div id="app">
    <Page />
  </div>
</template>

<script>
import Page from "@/components/Page";

export default {
  name: "App",
  components: {
    Page
  }
};
</script>

<style>
body {
  text-align: left;
  font-family: "Segoe UI", sans-serif;
  font-size: 16px;
  flex-direction: column;
  align-items: center;
  display: flex;
  background: #f8f8fa;
}
</style>
