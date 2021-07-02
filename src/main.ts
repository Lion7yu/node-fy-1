import { appId, appSecret } from "./private";

const https = require('https');
const querystring = require('querystring')
const md5 = require('md5')

export const translate = (word)=>{

  const salt = Math.random();
  //random 写在外面和写在里面不一样
  const sign = md5(appId + word + salt + appSecret);

  const query:string =  querystring.stringify({
    q: word,
    from:'en',
    to:'zh',
    appid: appId+1,
    salt: salt,
    sign:sign
    //q=banana&from=en&to=zh&appid=20210701000877422&salt=1435660288&sign=4b807764922dfd52502f285412b0afed
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
        console.log(object.error_code)
        if(object.error_code === '52003'){
          console.error('用户认证失败');
        }
        console.error(object.error_msg);
        //退出当前进程
        process.exit(2)
      }else{
        console.log(object.trans_result[0].dst)
        process.exit(0)
      }
    })
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
  }