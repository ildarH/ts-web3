import Vue from 'vue'
import Web3 from 'web3'

import {
  ValidationProvider,
  ValidationObserver,
  extend,
  configure,
  setInteractionMode
} from 'vee-validate'

import * as rules from 'vee-validate/dist/rules'

Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)
setInteractionMode('eager')

for (const [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation
  })
}

export default ({ app }: { app: any }): void => {
  configure({
    defaultMessage: (_field_, values) => {
      return app.i18n.t(`messages.${values._rule_}`, { ...values, _field_: values._field_.split('__')[0] })
    }
  })
}

extend('validAddress', {
  validate: (value) => {
    try {
      return Web3.utils.isAddress(value)
    } catch {
      return false
    }
  }
})

extend('greaterThanZero', {
  validate: value => value > 0
})

extend('maxDecimals', {
  validate: (value, params) => {
    const arr = value.toString().trim().split('.')
    if (arr.length === 2) {
      const { decimals } = <{decimals: string}> params
      return +arr[1].length <= +decimals
    }
    return true
  },
  params: ['decimals']
})
