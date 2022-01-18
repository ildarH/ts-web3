<template>
  <div class="balance-wrapper my-8">
    <div class="container">
      <div class="balance flex w-full h-52 rounded-xl px-8 justify-between items-center">
        <div class="flex flex-col">
          <div class="balance__title font-semibold">
            {{ $t('balanceCard.title') }}
          </div>
          <div class="balance__value font-bold text-4xl mb-1">
            1232323
          </div>
          <div class="balance__input">
            <AppInput
              v-model="value"
              :name="$t('balanceCard.input.name').toString()"
              :placeholder="$t('balanceCard.input.placeholder')"
              input-classes="rounded-3xl h-10 w-96 px-4"
              :rules="{ validAddress: value }"
            >
              <template #append>
                <span class="copy" @click="copyText">
                  <img :src="GetImgUrl(`${'icon_copy'}.svg`)" width="16" height="16" alt="copy">
                </span>
              </template>
            </AppInput>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import AppInput from '~/components/AppInput/index.vue'
import GetImgUrl from '~/plugins/main'

@Component({
  components: {
    AppInput
  },
  mixins: [GetImgUrl]
})
export default class Balance extends Vue {
  @Prop({ type: String, default: '' }) readonly propValue!: string
  value: number | string = ''
  async copyText (): Promise<void> {
    try {
      console.log('this: ', this)
      await this.$copyText(this.value)
    } catch (e) {
      console.error(e)
    }
  }
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
  &__input {
    display: flex;
    min-height: 60px;
  }
}
.copy {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: absolute;
  bottom: 2px;
  right: 1%;
  width: 36px;
  height: 36px;
  padding: 5px;
  background-color: #E3E3E3;
  cursor: pointer;
}
</style>
