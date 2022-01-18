<template>
  <div class="tokenCard bg-zinc-300 h-24 w-44">
    <div class="tokenCard__header">
      <token-image :token-address="tokenAddress" :token-name="symbol" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TokenImage from '~/components/TokenImage/index.vue'

@Component({
  components: {
    TokenImage
  }
})
export default class TokenCard extends Vue {
  @Prop({ type: String, default: '' }) readonly tokenAddress!:string
  @Prop({ type: String, default: '' }) readonly symbol!: string
  @Prop({ type: [String, Number], default: '' }) readonly balance!: string | number
}
</script>

<style scoped>

</style>
