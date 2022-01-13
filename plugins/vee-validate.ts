import Vue from 'vue'

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
