<template>
  <div>{{ test }}</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Index extends Vue {
  test = 'test'
}
</script>
