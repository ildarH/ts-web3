import { Component, Vue } from 'vue-property-decorator'

@Component
class MainMixin extends Vue {
  public GetShortString = (str: string, size = 5): string => {
    const stringConversion = str.toString()
    return `${stringConversion.slice(0, size + 2)}...${stringConversion.slice(stringConversion.length - size)}`
  }

  public GetImgUrl = (img: string): string => {
    const name = typeof img !== 'undefined' ? img : 'light'
    return require(`~/assets/img/${name}`)
  }

  public CopyText = async (text: string | number): Promise<void> => {
    try {
      await this.$copyText(text)
      // const title = this.$t('notification.header.success')
      // const message = `${text} ${this.$t('notification.content.copy')}`
      // const type = 'success'
      // this.$notify(
      //   { group: type, title, text: message },
      //   2000
      // ) // 2s
    } catch (e) {
      console.error(e)
    }
  }
}

export default MainMixin
