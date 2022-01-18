<template>
  <div class="transactions-wrapper">
    <div class="container">
      <div class="transactions">
        <h2 class="form__title text-2xl font-semibold mb-8">
          {{ $t('transactionsTable.title') }}
        </h2>
        <TransactionItem v-for="item in 5" :key="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TransactionItem from '~/components/TransactionItem/index.vue'

@Component({
  components: {
    TransactionItem
  }
})
export default class Transactions extends Vue {

}
</script>

<style lang="scss" scoped>
.container {
  @include container;
}
</style>
