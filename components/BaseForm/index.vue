<template>
  <div class="form-wrapper my-8">
    <div class="container">
      <validation-observer v-slot="{ handleSubmit, valid }">
        <div class="form flex flex-col w-auto bg-zinc-300 min-h-full rounded-xl p-8">
          <h2 class="form__title text-2xl font-semibold mb-8">
            {{ $t('transferCard.title') }}
          </h2>
          <AppInput
            v-model="amount"
            class="form__amount mb-4"
            :name="$t('transferCard.inputs.amount.label')"
            :placeholder="$t('transferCard.inputs.amount.placeholder')"
            input-classes="min-w-full rounded-3xl h-16 px-4"
            :rules="{greaterThanZero: true, required: true}"
          />
          <AppInput
            v-model="recipient"
            class="form__recipient mb-8"
            :label="$t('transferCard.inputs.recipient.label')"
            :name="$t('transferCard.inputs.recipient.label')"
            :placeholder="$t('transferCard.inputs.recipient.placeholder')"
            input-classes="min-w-full rounded-3xl h-16 px-4"
            label-classes="text-xs font-light ml-3.5 mb-1 text-slate-500"
            spellcheck="false"
            :rules="{validAddress: true, required: true}"
          />
          <div class="form__buttons min-w-full flex items-center justify-end h-10 mb-4">
            <span v-if="allowance"> {{ allowance }} </span>
            <button :disabled="!recipient && !tokenAddress" class="h-10 border border-teal-500 px-5 mx-2 rounded-xl font-semibold" @click="allowanceHandler">
              <img v-if="isRequestAllowance" src="~/assets/img/icon_loading.svg" width="25" height="25" alt="Loading...">
              <span v-else> {{ $t('transferCard.buttons.getAllowance') }} </span>
            </button>
            <button :disabled="!recipient && !tokenAddress && !amount" class="h-10 border border-teal-500 px-5 mx-2 rounded-xl font-semibold" @click="approveHandler">
              <img v-if="isRequestApprove" src="~/assets/img/icon_loading.svg" width="25" height="25" alt="Loading...">
              <span v-else> {{ $t('transferCard.buttons.approve') }} </span>
            </button>
            <button :disabled="!valid && !recipient && !tokenAddress && !amount" class="h-10 border border-teal-500 px-5 mx-2 rounded-xl font-semibold" @click="handleSubmit(transferHandler)">
              <img v-if="isRequestTransfer" src="~/assets/img/icon_loading.svg" width="25" height="25" alt="Loading...">
              <span v-else> {{ $t('transferCard.buttons.transfer') }} </span>
            </button>
          </div>
        </div>
      </validation-observer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import AppInput from '~/components/AppInput/index.vue'
import { TokensModule } from '~/store/modules/tokens'

@Component({
  components: { AppInput }
})
export default class BaseForm extends Vue {
  @Prop({ type: String, default: '' }) readonly tokenAddress!: string

  amount = ''
  recipient = ''
  allowance = ''
  isRequestAllowance = false
  isRequestApprove = false
  isRequestTransfer = false

  @Watch('tokenAddress')
  tokenAddressChanged (newVal: string, oldVal: string): void {
    if (newVal !== oldVal) {
      this.allowance = ''
    }
  }

  private async allowanceHandler (): Promise<void> {
    if (this.recipient && this.tokenAddress) {
      try {
        const requestAllowance = await TokensModule.Allowance({
          recipientAddress: this.recipient,
          tokenAddress: this.tokenAddress
        })
        this.allowance = requestAllowance
      } catch (e) {
        console.log('requestAllowance', e)
      }
    }
  }

  private async approveHandler (): Promise<void> {
    if (this.recipient && this.tokenAddress && this.amount) {
      try {
        await TokensModule.Approve({
          recipientAddress: this.recipient,
          tokenAddress: this.tokenAddress,
          amount: this.amount
        })
      } catch (e) {
        console.log('requestApprove', e)
      }
    }
  }

  private async transferHandler (): Promise<void> {
    console.log('transfer')
    if (this.recipient && this.tokenAddress && this.amount) {
      try {
        const transfer = await TokensModule.Transfer({
          recipientAddress: this.recipient,
          amount: this.amount,
          tokenAddress: this.tokenAddress
        })
        console.log('transfer: ', transfer)
        await TokensModule.TokensData()
        await this.allowanceHandler()
      } catch (e) {
        console.log('requestTransfer', e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  @include container;
}

</style>
