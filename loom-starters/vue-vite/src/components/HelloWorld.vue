<template>
  <div>
    <p>{{ msg }}</p>
  </div>
</template>

<script setup>
defineProps({
  msg: String,
});
</script>
