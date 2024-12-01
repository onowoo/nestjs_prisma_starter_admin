<script lang="ts" setup>
import { ref } from "vue"

defineOptions({
  // 命名当前组件
  name: "SystemConfig"
})

const loading = ref<boolean>(false)
</script>

<template>
  <div class="app-container">
    {{ loading }}
  </div>
</template>
