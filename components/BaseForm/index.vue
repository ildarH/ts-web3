<template>
  <div class="form-wrapper my-8">
    <div class="container">
      <div class="form flex flex-col w-auto bg-zinc-300 h-96 rounded-xl p-8">
        <h2 class="form__title text-2xl font-semibold mb-8">
          {{ $t('transferCard.title') }}
        </h2>
        <AppInput
          v-model="amount"
          class="form__amount mb-4"
          :name="$t('transferCard.inputs.amount.label')"
          :placeholder="$t('transferCard.inputs.amount.placeholder')"
          input-classes="min-w-full rounded-3xl h-16 px-4"
        />
        <AppInput
          v-model="recipient"
          class="form__recipient mb-8"
          :label="$t('transferCard.inputs.amount.label')"
          :name="$t('transferCard.inputs.amount.label')"
          :placeholder="$t('transferCard.inputs.amount.placeholder')"
          input-classes="min-w-full rounded-3xl h-16 px-4"
          label-classes="text-xs font-light ml-3.5 mb-1 text-slate-500"
        />
        <div class="form__buttons min-w-full flex justify-end">
          <button class="h-10 border border-teal-500 px-5 mx-2 rounded-xl font-semibold">
            {{ $t('transferCard.buttons.getAllowance') }}
          </button>
          <button class="h-10 border border-teal-500 px-5 mx-2 rounded-xl font-semibold">
            {{ $t('transferCard.buttons.approve') }}
          </button>
          <button class="h-10 border border-teal-500 px-5 mx-2 rounded-xl font-semibold">
            {{ $t('transferCard.buttons.transfer') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppInput from '~/components/AppInput/index.vue'

@Component({
  components: { AppInput }
})
export default class BaseForm extends Vue {
  amount: string | number = ''
  recipient: string = ''
}
</script>

<style lang="scss" scoped>

.container {
  @include container;
}

</style>
