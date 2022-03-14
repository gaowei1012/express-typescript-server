let smsHost: string = "";
if (process.env.NODE_ENV === 'docker') {
    smsHost = "sms-service:4001"
} else if (process.env.NODE_ENV === 'dev') {
    smsHost = "127.0.0.1:4001"
}else{
    smsHost = "127.0.0.1:4001"
}


export default {
    smsTemplate:{
        OTP:"694036",//短信验证码模板， TemplateParamSet: ["验证码", "有效时长"]
    },
    smsHost:smsHost
}
  