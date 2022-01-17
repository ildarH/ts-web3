<template>
  <div class="balance-wrapper my-8">
    <div class="container">
      <div class="balance flex w-full h-52 rounded-xl px-8 justify-between items-center">
        <div class="flex flex-col">
          <div class="balance__title font-semibold">
            {{ $t('balanceCard.title') }}
          </div>
          <div class="balance__value font-bold text-4xl">
            1232323
          </div>
          <div class="balance__input">
            <AppInput
              :name="$t('balanceCard.input.name').toString()"
              :placeholder="$t('balanceCard.input.placeholder')"
              :input-classes="'rounded-xl'"
              :append-icon="'icon_copy'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppInput from '~/components/AppInput/index.vue'

@Component({
  components: {
    AppInput
  }
})
export default class Balance extends Vue {

}
</script>

<style lang="scss" scoped>
.container {
  @include container
}
.balance {
  background-image: url('~/assets/img/balance_background.png'), linear-gradient(253.94deg, #09F2C3 8.37%, #15DCE4 69.71%);
  background-repeat: no-repeat;
  background-position-x: 100%;
}
</style>
