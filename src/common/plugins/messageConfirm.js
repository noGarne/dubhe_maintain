
/**
 * <!-- 确认提示框 -->
 */

import MessageConfirm from './MessageConfirm.vue';

const obj = {}

obj.install = function(Vue){
  const MessageConfirmContrustor = Vue.extend(MessageConfirm);
  const messageConfirmContrustor = new MessageConfirmContrustor();
  messageConfirmContrustor.$mount(document.createElement('div'));
  document.body.appendChild(messageConfirmContrustor.$el);
  
  Vue.prototype.$messageConfirm = messageConfirmContrustor;
}

export default obj;
