<template>
  <validation-provider
    v-slot="{errors, valid, invalid, validated}"
    :rules="rules"
    :name="name"
    v-bind="$attrs"
  >
    <div
      class="form-group"
      :class="{'is-invalid': validated && invalid}"
    >
      <slot name="label">
        <label
          v-if="label"
          :class="labelClasses"
        >
          {{ label }}
        </label>
      </slot>
      <div
        :class="[
          {'input-group': hasIcon},
          {'focused': focused},
          {'input-group-alternative': alternative},
          {'has-label': label || $slots.label},
          inputGroupClasses
        ]"
      >
        <div
          v-if="prependIcon || $slots.prepend"
          class="input-group-prepend"
        >
          <span class="input-group-text">
            <slot name="prepend">
              <img :src="GetImgUrl(`${prependIcon}.svg`)" :alt="name">
              <!--              <i :class="prependIcon" />-->
            </slot>
          </span>
        </div>
        <slot v-bind="slotData">
          <input
            :type="type"
            v-bind="$attrs"
            :valid="valid"
            :required="required"
            class="form-control"
            :class="[{'is-valid': valid && validated && successMessage}, {'is-invalid': invalid && validated}, inputClasses]"
            v-on="listeners"
          >
        </slot>
        <div
          v-if="appendIcon || $slots.append"
          class="input-group-append"
        >
          <span class="input-group-text">
            <slot name="append">
              <img :src="GetImgUrl(`${appendIcon}.svg`)" :alt="name">
              <!--              <i :class="appendIcon" />-->
            </slot>
          </span>
        </div>
        <slot name="infoBlock" />
      </div>
      <slot name="success">
        <div
          v-if="valid && validated"
          class="valid-feedback"
        >
          {{ successMessage }}
        </div>
      </slot>
      <slot name="error">
        <div
          v-if="errors[0]"
          class="invalid-feedback"
          style="display: block;"
        >
          {{ errors[0] }}
        </div>
      </slot>
    </div>
  </validation-provider>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import GetImgUrl from '~/plugins/main'

@Component({
  mixins: [GetImgUrl]
})
export default class AppInput extends Vue {
  @Prop({ type: Boolean }) readonly required!: boolean
  @Prop({ type: Boolean }) readonly group!: boolean
  @Prop({ type: Boolean }) readonly alternative!: boolean
  @Prop({ type: String, default: '' }) readonly label!: string
  @Prop({ type: String, default: '' }) readonly error!: string
  @Prop({ type: String, default: '' }) readonly successMessage!: string
  @Prop({ type: String, default: '' }) readonly labelClasses!: string
  @Prop({ type: String, default: '' }) readonly inputClasses!: string
  @Prop({ type: String, default: '' }) readonly inputGroupClasses!: string
  @Prop({ type: String, default: '' }) readonly appendIcon!: string
  @Prop({ type: String, default: '' }) readonly prependIcon!: string
  @Prop({ type: String, default: '' }) readonly name!: string
  @Prop({ type: [String, Array, Object], default: '' }) readonly rules!: string
  @Prop({ type: String, default: 'text' }) readonly type!: string

  focused = false

  get listeners (): Record<any, any> {
    return {
      ...this.$listeners,
      input: this.updateValue,
      focus: this.onFocus,
      blur: this.onBlur
    }
  }

  get slotData (): Record<any, any> {
    return {
      focused: this.focused,
      error: this.error,
      ...this.listeners
    }
  }

  get hasIcon (): boolean {
    const { append, prepend } = this.$slots
    return (
      append !== undefined ||
      prepend !== undefined ||
      this.appendIcon !== undefined ||
      this.prependIcon !== undefined ||
      this.group
    )
  }

  updateValue (evt: Event): void {
    const { value } = (evt.target as HTMLInputElement)
    this.$emit('input', value)
  }

  onFocus (evt: Event): void {
    this.focused = true
    this.$emit('focus', evt)
  }

  onBlur (evt: Event): void {
    this.focused = false
    this.$emit('blur', evt)
  }
}
</script>

<style scoped>

</style>
