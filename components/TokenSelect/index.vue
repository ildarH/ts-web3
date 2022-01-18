<template>
  <div class="tokenSelect-wrapper">
    <div class="container">
      <div class="tokenSelect flex direction-row">
        <TokenCard v-for="item in 6" :key="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TokenCard from '~/components/TokenCard/index.vue'

@Component({
  components: {
    TokenCard
  }
})
export default class TokenSelect extends Vue {

}
</script>

<style lang="scss" scoped>
.container {
  @include container
}
</style>
