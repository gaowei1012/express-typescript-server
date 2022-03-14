import { QwdError } from '@/controllers/helper';
import { errorCode } from '@/config';
import bcrypt from 'bcryptjs';

export default {
    //判断sessionId是否合法
   isValidSessionId:(userInfo,sessionId)=>{
        if (!userInfo) {throw new QwdError(errorCode.SessionNotFoundError, '未找到登陆信息，请重新登陆');}
        if (JSON.parse(userInfo).sessionID !== sessionId) {throw new QwdError(errorCode.SessionInvalidError, '会话非法，会话被服务器拒绝')}      
    },
    //判断登录信息是否合法
   isValidLoginInfo:(accountInfo,password)=>{
    if(!accountInfo) {throw new QwdError(errorCode.UsernameNotFound, '用户名不存在!')}
    if (!bcrypt.compareSync(password, accountInfo.password)) {throw new QwdError(errorCode.PasswordError, '密码错误!')};
    if (accountInfo.is_active === 0) {throw new QwdError(errorCode.AccountDisable, '账户已被禁用，请联系业务经理!');}
  },
 };
