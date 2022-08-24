import Vue from 'vue'
import VeeValidate,{ Validator } from 'vee-validate'
//import zh_CN from 'vee-validate/dist/locale/zh_CN'

Vue.use(VeeValidate,{
    classes: true,
    fieldsBagName: 'fieldBags',
    strict: true,
    events: 'input|blur|change',
});

// 配置中文
//Validator.locale ==="zh_CN" ? "zh_CN" : "en";
Validator.localize(Validator.locale,{
    //messages: zh_CN.messages,
    messages: {
        required: (field,args) => args==1 ? '请选择' + field : '请输入' + field,
        email: () => '请输入正确的邮箱格式',
        min:(field,args)=>field+'长度不能少于'+args+'位',
        max:(field,args)=>field+'长度不能超过'+args+'位',
        min_value:(field,args)=>field+'最小数值为'+args,
        max_value:(field,args)=>field+'最大数值为'+args,
        length:(field,args)=>field+'长度为'+args+'位',
        digits:(field,args)=>field+'长度为'+args+'位数字',
        decimal:(field,args)=>field+'最大长度为'+args+'位数字',
        numeric:(field)=>field+'为数字格式',
        confirmed:(field,args)=>field+'与'+args+'不一致',
      },
        attributes:{
            //loginName:'登录名',
            //repeatPassword:'重复密码'
        }
});

//自定义验证
Validator.extend('mobile', {
    getMessage: (field, [args]) => `请输入正确的手机号`,
    validate: (value, [args]) =>{
        // const reg = /^(1\d{10})$/;
        const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        return reg.test(value) 
    }  
});

Validator.extend('selected', {
    getMessage: (field, [args]) => `请选择${field}`,
    validate: (value, [args]) =>{
        return !!value
    }  
});
Validator.extend('after_dot', {
    getMessage: (field, [args]) => {
        let text = `${field}仅支持输入数字类型，且最多保留${args}位小数位数`;
        if(args==0)text=`${field}只允许输入正整数`
        return text;
    },
    validate: (value, [args]) =>{
        var reg = new RegExp("^(\\d+)(.\\d{0,"+args+"})?$");
        return reg.test(value);        
    }  
});

//名称输入验证格式
Validator.extend('check_name', {
    getMessage: (field, [args]) => `请输入格式正确的${field}`,
    validate: (value, [args]) =>{
        const reg = /^[\u4E00-\u9FA5-.#\w]+$/g;
        return reg.test(value) 
    }  
});

//密码输入验证格式
Validator.extend('check_password', {
    getMessage: (field, [args]) => `请输入格式正确的${field}`,
    validate: (value, [args]) =>{
        const reg = /^[^\u4E00-\u9FA5\s]*$/g;
        return reg.test(value) 
    }  
});

//验证字符串字节长度
Validator.extend('check_byte_length', {
    getMessage: (field, [args]) => `${field}字节长度不超过${args}`,
    validate: (value, [args]) =>{
        let str = new String(value);  
        let bytesCount = 0;  
        for (let i = 0 ,n = str.length; i < n; i++) {  
            let c = str.charCodeAt(i);  
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {  
                bytesCount += 1;  
            } else {  
                bytesCount += 3;  
            }  
        }
        return bytesCount<=args
    }  
});

