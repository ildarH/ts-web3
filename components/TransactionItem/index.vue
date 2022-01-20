<template>
  <div class="transactionItem-wrapper my-3">
    <div class="transactionItem rounded-xl flex h-20 flex-column min-w-full justify-around items-center bg-zinc-300">
      <div class="h-10 w-10 flex justify-center items-center bg-white rounded-xl">
        <img :src="require(`~/assets/img/icon_${type}.svg`)" class="transactionItem__icon h-5 w-5" :alt="type">
      </div>
      <div class="h-10">
        <span class="capitalize"> {{ type }} </span>
      </div>
      <div class="h-10">
        <div class="transactionItem__label">
          {{ $t('transactionsTable.labels.from') }}
        </div>
        <div class="transactionItem__value">
          {{ from }}
        </div>
      </div>
      <div class="h-10">
        <div class="transactionItem__label">
          {{ $t('transactionsTable.labels.to') }}
        </div>
        <div class="transactionItem__value">
          {{ to }}
        </div>
      </div>
      <div class="h-10">
        <div class="transactionItem__label">
          {{ $t('transactionsTable.labels.amount') }}
        </div>
        <div class="transactionItem__value">
          {{ amount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class TransactionItem extends Vue {
  @Prop({ type: String, default: 'transfer' }) readonly type!: string
  @Prop({ type: String, default: '' }) readonly from!: string
  @Prop({ type: String, default: '' }) readonly to!: string
  @Prop({ type: String, default: '' }) readonly amount!: string
}
</script>

<style scoped>

</style>
