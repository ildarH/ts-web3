<template>
  <div class="form-wrapper">
    <div class="container" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BaseForm extends Vue {

}
</script>

<style lang="scss" scoped>

.container {
  @include container;
}

</style>
