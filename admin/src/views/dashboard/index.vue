<script lang="ts" setup>
import { useAuthStore } from "@/store/modules/auth"
import Admin from "./components/Admin.vue"
import Editor from "./components/Editor.vue"

const userStore = useAuthStore()
const isAdmin = userStore.roles.includes("admin")
</script>

<template>
  <component :is="isAdmin ? Admin : Editor" />
</template>
