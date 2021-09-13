<template>
  <span class="vue-notify"> {{ message }}</span>
</template>

<script>
export default {
  name: "notification-template",
  props: ["message"]
};
</script>
