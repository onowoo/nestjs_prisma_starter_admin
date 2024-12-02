<script lang="ts" setup>
import { useLayoutMode } from "@/hooks/useLayoutMode"
import logo from "@/assets/layouts/wy.png?url"

interface Props {
  collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapse: true
})

const { isLeft, isTop } = useLayoutMode()
</script>

<template>
  <div class="layout-logo-container" :class="{ collapse: props.collapse, 'layout-mode-top': isTop }">
    <transition name="layout-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
        <img :src="logo" class="layout-logo bg-white p-0.5 rounded-md" />
      </router-link>
      <router-link v-else key="expand" to="/">
        <div v-if="isLeft" flex="~ justify-center items-center gap-3" text="30px white">
          <img :src="logo" class="layout-text bg-light-300 p-1 rounded-md w-10 h-10" />
          <div font="bold">Wanapp</div>
        </div>
        <div v-else flex="~ justify-center items-center gap-3" text="30px dark-400">
          <img :src="logo" class="layout-text bg-gray-200 p-1 rounded-md w-10 h-10" />
          <div font="bold">Wanapp</div>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  position: relative;
  width: 100%;
  height: var(--v3-header-height);
  line-height: var(--v3-header-height);
  text-align: center;
  overflow: hidden;
  .layout-logo {
    display: none;
  }
  .layout-logo-text {
    vertical-align: middle;
  }
}

.layout-mode-top {
  height: var(--v3-navigationbar-height);
  line-height: var(--v3-navigationbar-height);
}

.collapse {
  .layout-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .layout-logo-text {
    display: none;
  }
}
</style>
