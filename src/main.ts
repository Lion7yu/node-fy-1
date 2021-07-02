import { appId, appSecret } from "./private";

const https = require('https');
const querystring = require('querystring')
const md5 = require('md5')

const errorMap = {
  52001:'请求超时',
  52002:'系统错误',
  52003:'未授权用户',
  54000:'必填参数为空',
  54001:'前面错误',
  54003:'访问频率受限',
  54005:'长 query 请求频繁',
  58000:'客户端IP非法',
  58001:'译文语言方向不支持',
  58002:'服务当前已关闭',
  90107:'认证未通过或未生效',
  unknown:'服务器繁忙'
}

export const translate = (word)=>{

  const salt = Math.random();
  //random 写在外面和写在里面不一样
  const sign = md5(appId + word + salt + appSecret);
  let from, to;

  if(/[a-zA-Z]/.test(word[0])){
    // 英译中
    from = 'en'
    to = 'zh'
  }else{
    // 中译英
    from = 'zh',
    to = 'en'
  }
  
  const query:string =  querystring.stringify({
    q: word,
    from: from,
    to: to,
    appid: appId,
    salt: salt,
    sign: sign,
  })

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };

  const request = https.request(options, (response) => {
    //一块代码
    let chunks = [];
    //每次下载的数据
    response.on('data', (chunk) => {
      chunks.push(chunk)
    });
    response.on('end',()=>{
      //合并数据，生成JSON字符串
      const string = Buffer.concat(chunks).toString()
      //声明类型
      type BaiduResult = {
        //？：可能为空
        error_code?: string,
        error_msg?: string,
        from: string,
        to: string,
        trans_result: {
          src:string,
          dst:string;
        }[]
      }
      const object: BaiduResult = JSON.parse(string)
      if(object.error_code){
          console.error(errorMap[object.error_code] || object.error_msg);
        //退出当前进程
        process.exit(2)
      }else{
        object.trans_result.map(obj=>{
          console.log(obj.dst)
        })
        process.exit(0)
      }
    })
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
  }