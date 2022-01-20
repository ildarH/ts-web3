<template>
  <div class="tokenSelect-wrapper">
    <div class="container">
      <div class="tokenSelect flex direction-row">
        <template v-if="isTokensLoading">
          <TokenCardSkeleton v-for="item in 6" :key="item" class="mr-2" />
        </template>
        <template v-else>
          <TokenCard
            v-for="(token, key) in tokensData"
            :key="`${key}_${token.token.symbol}`"
            class="mr-2 cursor-pointer"
            :token="token"
            :class="selectedCard === key ? 'selected' : ''"
            @click.native="selectCard(key)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import TokenCard from '~/components/TokenCard/index.vue'
import TokenCardSkeleton from '~/components/TokenCardSkeleton/index.vue'
import { IBalance } from '~/@types/interfaces'
import { TokensModule } from '~/store/modules/tokens'

@Component({
  components: {
    TokenCard,
    TokenCardSkeleton
  }
})
export default class TokenSelect extends Vue {
  @Prop({ type: Boolean, default: false }) readonly isTokensLoading!: boolean
  selectedCard: number | null = null

  get tokensData (): IBalance[] {
    return TokensModule.tokens
  }

  @Emit('onSelect')
  selectCard (index: number): void {
    console.log('selected card: ', index)
    this.selectedCard = index
  }
}
</script>

<style lang="scss" scoped>
.container {
  @include container
}
.selected {
  border: 1px solid red;
}
</style>
