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
}

export default MainMixin
