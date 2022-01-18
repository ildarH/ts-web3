<template>
  <div class="transactionItem-wrapper my-3">
    <div class="transactionItem rounded-xl flex h-20 flex-column min-w-full justify-around items-center bg-zinc-300">
      <div class="h-10">
        icon
      </div>
      <div class="h-10">
        icon
      </div>
      <div class="h-10">
        icon
      </div>
      <div class="h-10">
        icon
      </div>
      <div class="h-10">
        icon
      </div>
      <div class="h-10">
        icon
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class TransactionItem extends Vue {
  @Prop({ type: String, default: '' }) readonly type!: string
  @Prop({ type: String, default: '' }) readonly from!: string
  @Prop({ type: String, default: '' }) readonly to!: string
  @Prop({ type: String, default: '' }) readonly amount!: string
}
</script>

<style scoped>

</style>
