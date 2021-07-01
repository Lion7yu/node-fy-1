const https = require('https');
const querystring = require('querystring')
const md5 = require('md5')

export const translate = (word)=>{
  console.log('word')
  console.log(word)

  const appId = '???';
  const appSecret = '???';
  const salt = Math.random();
  //random 写在外面和写在里面不一样
  const sign = md5(appId + word + salt + appSecret);

  const query:string =  querystring.stringify({
    q: word,
    from:'en',
    to:'zh',
    appid: appId,
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

  const req = https.request(options, (res) => {

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
  }