import validator from 'validator';
import { QwdError } from '@/controllers/helper';
import { errorCode } from '@/config';

export default { 
    // 检查字符串是否是手机号码
 isMobilePhone:(phone)=>{
    if (!validator.isMobilePhone(phone,"zh-CN")) 
    throw new QwdError(errorCode.phoneFormatError, '手机号码格式错误');
  },
  
  // 检查字符串是否是电子邮件
  isEmail:(email)=> {
    if (!validator.isEmail(email))
    throw new QwdError(errorCode.emailFormatError, '邮箱格式错误');
  },
  // 检查字符串是否是有效的身份证代码
   isIdentityCard:(str)=>{
    if (!validator.isIdentityCard(str, 'any'))
    throw new QwdError(errorCode.IdCardFormatError, '身份证格式错误');
  }
};
