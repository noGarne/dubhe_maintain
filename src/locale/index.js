
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import zh_CN from './locale.constant-zh_CN'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh_CN', 
  messages:{
    'zh_CN': zh_CN
  }
})

export default i18n