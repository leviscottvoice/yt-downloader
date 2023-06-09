// const yt = require("./youtube-upload")
const express = require("express")
const app = express()
const {google, GoogleApis} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const credentials = require("./client_secret.json")
const cookieparser = require("cookie-parser")
const multer = require("multer")
const form = multer().array()
const session = require("cookie-session")
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
const {channelId,videoId}  = require("@gonetone/get-youtube-id-by-url")
const ytch = require('yt-channel-info')
app.set('view engine', 'ejs')
const axios = require("axios")
const ytdl = require("ytdl-core")
const moment = require("moment")
require("dotenv").config()
const cp = require('child_process');
const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath)
const Long = require("long")
const {v4:uuidv4} = require('uuid');
const download = require("image-downloader")
const cron = require("node-cron")
channelId("https://www.youtube.com/ThapaTechnical".replace("@","")).then((e)=>{
  console.log(e)
}).catch((err)=>{
  console.log(err)
})
 
app.use(cookieparser())
app.use(session({
  secret:"e6VgtiqH1DwSNFnHWOJcQEp4b7FwGEZB",
  saveUninitialized: true,
  resave: true
}))

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((res)=>{
  console.log("connect");
}).catch((err)=>{
  console.log(err);
})
const User = require("./model/users");
const { cloudfunctions } = require("googleapis/build/src/apis/cloudfunctions");
const { request } = require("http");
const { oauth2 } = require("googleapis/build/src/apis/oauth2");
const videoFilePath = "./" + "vid.mp4"
const thumbFilePath = "./" + "thumb.jpg"
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/userinfo.profile'];
const clientSecret = credentials.web.client_secret;
const clientId = credentials.web.client_id;
const redirectUrl = credentials.web.redirect_uris[1];

const oauth2Client = new OAuth2({clientId:clientId, clientSecret:clientSecret,redirectUri:redirectUrl});

var auth = false
const categoryIds = {
  Entertainment: 24,
  Education: 27,
  ScienceTechnology: 28
}

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

const str = "https://www.youtube.com/watch?v=b7DrwqoHAGA"

const {executablePath} = require("puppeteer")
   const login = async() => {
      puppeteerExtra.use(stealthPlugin());
      const browser = await puppeteerExtra.launch({ args: ['--no-sandbox',],
      headless: false,
      ignoreHTTPSErrors: true,
  
      // add this
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", });
      // const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
  
      try {
      await page.goto('https://accounts.google.com/signin/v2/identifier');
      await page.type('[type="email"]', 'leviscottvoices@gmail.com',);
      await page.click('#identifierNext');
      await page.waitForTimeout(5000);
  
      await page.type('[type="password"', "Scott@1234");
      await page.click('#passwordNext');
  
  
      await page.waitForTimeout(6000);
    // Sign in to YouTube
    // await page.goto('https://www.youtube.com/?persist_gl=1&gl=US&persist_hl=1&hl=en');
    // await page.waitForSelector('a[href="/signin"]');
    // await page.click('a[href="/signin"]');
    // await page.waitForSelector('#identifierId');
    // await page.type('#identifierId', 'leviscottvoices@gmail.com'); // Replace with your YouTube username
    // await page.click('#identifierNext');
    // await page.waitForSelector('#password input[name="password"]');
    // await page.type('#password input[name="password"]', 'Scott@1234'); // Replace with your YouTube password
    // await page.click('#passwordNext');
    // await page.waitForNavigation();

    // Go to upload page
    await page.goto('https://www.youtube.com/upload');

    // Select video file
    const fileInput = await page.$("input[type='file']");
    await fileInput.uploadFile('C:/Users/Admin/Desktop/sumit/videoUploader/video2.mp4'); // Replace with the path to your video file

    // Fill in video details
    await page.waitForSelector('#textbox');
    const titlebox = await page.$("#textbox");
    await page.type('#textbox', 'Video Title'); // Replace with your video title
    await page.type('#textbox', 'Video Description'); // Replace with your video description

    // Set privacy
    await page.waitForTimeout(50000)
    const mfk = await page.$("[name='VIDEO_MADE_FOR_KIDS_MFK']")
    await mfk.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const next_btn = await page.waitForSelector('#next-button');
          await next_btn.evaluate((x)=>{
            x.click()
          })
    // await page.click('#next-button');
    
    await page.waitForTimeout(15000)
    const again_next_btn = await page.waitForSelector('#next-button');
    await again_next_btn.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const again_next_btn_2 = await page.waitForSelector('#next-button');
    await again_next_btn_2.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const again_next_btn_3 = await page.waitForSelector('#next-button');
    await again_next_btn_3.evaluate((x)=>{
      x.click()
    })
    
    await page.waitForTimeout(5000)

    await page.click('#done-button');
    // await page.click('#next-button');
    // await page.click('#radioLabel');
    // await page.waitForSelector('#private-label');
    // await page.click('#private-label');

    // Submit the upload

    // Wait for the upload to complete
    await page.waitForNavigation();

    console.log('Video uploaded successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
      // Close the browser
      await browser.close();
    }
  
      await browser.close();
  }


// const {promptLoginAndGetCookies, uploadVideo} = require('node-apiless-youtube-upload')

// (async () => {
//     const youtubeUploader = new uploadVideo()
//     const cookiesPath = process.cwd() + '/cookies_saved.json'

//     // Try loading cookies from disk
//     try {
//         await youtubeUploader.loadCookiesFromDisk(cookiesPath)

//         if (!(await youtubeUploader.checkCookiesValidity())) {
//             throw new Error('Cookies loaded from disk are not valid')
//         }
//     } catch(e) {
//         console.log('Prompting Google login..')

//         // Open a login window for Google account. Cookies will be stored in the youtubeUploader instance
//         await promptLoginAndGetCookies()

//         // Save cookies
//         await youtubeUploader.saveCookiesToDisk(cookiesPath)
//     }
    
//     // Upload a video to youtube
//     await youtubeUploader.uploadVideo({
//         videoPath: 'C:/Users/gladiatortoise/Desktop/testVideo.mp4',
//         title: '📡 Automatically Uploaded Video 📡',
//         description: 'This is a placeholder description.',
//         thumbnailPath: 'C:/Users/gladiatortoise/Desktop/TestThumbnail.jpg',
//         visibility: 'unlisted',
//         monetization: false
//     })
// })()

const {upload} = require('youtube-videos-uploader');
// const onVideoUploadSuccess = (videoUrl) => {
//  console.log(videoUrl)
// }
 const credentialss = { email: 'leviscottvoices@gmail.com', pass: 'Scott@1234', recoveryemail: 'sp43216@gmail.com' }
 const video2 = { path: __dirname + '\/'  + 'video2.mp4', title: 'title 2', description: 'description 2', thumbnail: __dirname +"\/"+'thumbnail.jpg' }
  upload (credentialss, [video2],{headless:false}).then((err) => console.log(err)).catch((e)=>{
   console.log(e)
  })
async function getHTML(productURL) {
  const { data: html } = await  axios.get(productURL, {
  headers: {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
}
})
.catch(function (error) {
  console.log(error.response);

});
return html;
}
app.get("/",async(req,res)=>{
  if(!req?.session?.token){
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      
    });
-    res.render("login",{url:authUrl})
  }else{
    res.render("home",)

  }

})

app.get("/autoupload",(req,res)=>{
  res.render("autoupload")
})
app.get("/linkupload",(req,res)=>{
  res.render("linkupload")

})

function waitforme(millisec) {
  return new Promise(resolve => {
      setTimeout(() => { resolve('') }, millisec);
  })
}


app.get("/uploadpop",(req,res)=>{
  res.render("uploadPop")
})



app.post("/uploadurl",form,async(req,res)=>{
  const urls =  req.body.urls.split(",")
  const startTime =  new Long( new Date(moment(req.body.time)).getTime())
  var timeIsBeing936 = new Date(new Date(moment(req.body.time))).getTime()
  , currentTime = new Date().getTime()
  , subtractMilliSecondsValue = timeIsBeing936 - currentTime;
  const interval = new Long( parseInt(req.body.interval) * 60000)
  console.log(interval.toString())
  setTimeout(async()=>{
    for (let i = 0; i < urls.length; ++i) {
      await waitforme(interval);
      downloadAndUpload(urls[i])
  }
  },subtractMilliSecondsValue)
  res.json({status:1})
})

app.post("/uploadpopular",form,async(req,res)=>{
  
  const channelid = await channelId(req.body.channel)
  
  const data = await getHTML(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBlO79AaaK7z0HsMRYgOb9uS7dfmsF6NPg&type=video&channelId=${channelid}&part=snippet,id&order=viewCount&maxResults=${parseInt(req.body.count)}`)

     console.log(data)
    
   var timeIsBeing936 = new Date(new Date(moment(req.body.time))).getTime()
   , currentTime = new Date().getTime()
   , subtractMilliSecondsValue = timeIsBeing936 - currentTime;
   const interval = new Long( parseInt(req.body.interval) * 60000)
   setTimeout(async()=>{
     for (let i = 0; i < data.items.length; ++i) {
       await waitforme(interval);
       console.log("hey")
       downloadAndUpload(`https://www.youtube.com/watch?v=${data.items[i].id.videoId}`)
   }
   },subtractMilliSecondsValue)
   res.json({status:1})
 
   

})

const downloadAndUpload = async(e) =>{
    // await timer(interval)
  const videoId = e.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1]

  const randomname = uuidv4() + ".mp4"
  const randvid = uuidv4() + ".mp4"
  const randAudio = uuidv4() + ".mp3"
  const randothumb = __dirname +"/" +  uuidv4() + ".jpg"
   const video =   ytdl(videoId,{quality:'highestvideo'}).pipe(fs.createWriteStream(randomname))
   const audio =   ytdl(videoId,{quality:"highestaudio"}).pipe(fs.createWriteStream(randAudio))


function merge(video, audio) {
  ffmpeg()
      .addInput(video)
      .addInput(audio)
      .addOptions(['-map 0:v', '-map 1:a', '-c:v copy'])
      .format('mp4')
      .on('error', error => console.log(error))
      .on('end', res => {fs.unlink(__dirname + "\/" + randomname,(err)=>{console.log(err)});fs.unlink(__dirname + "\/" + randAudio,(err)=>{console.log(err)})})
      .saveToFile(randvid)
}
await waitforme(10000)
merge( `${__dirname}` +  `\/${randomname}`,__dirname + "\/" + randAudio)

  let info = await ytdl.getInfo("https://www.youtube.com/watch?v="+videoId);
  // console.log(info.videoDetails)
  download.image({
    url: info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url ? info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url : info.videoDetails.thumbnails[0].url,
    dest:randothumb
  }).then((e)=>{
    console.log(e)
  }).catch((err)=>{
    console.log(err)
  })
  const title = info.videoDetails.title
  const description = info.videoDetails.description
  const keywords = info.videoDetails.keywords
  const mfk = info.videoDetails.age_restricted
  const category = {
     "Film & Animation":1	 ,
     "Autos & Vehicles":2	 ,
     "Music":10,
     "Pets & Animals":15,
     "Sports":17,
     "Short Movies":18,
     "Travel & Events":19,
     "Gaming":20,
     "Videoblogging":21,
     "People & Blogs":22,
     "Comedy":23,
     "Entertainment":24,
     "News & Politics":25,
     "Howto & Style":26,
     "Education":27,
     "Science & Technology":28,
     "Nonprofits & Activism":29,
     "Movies":30,
     "Anime/Animation":31,
     "Action/Adventure":32,
     "Classics":33,
     "Comedy":34,
     "Documentary":35,
     "Drama":36,
     "Family":37,
     "Foreign":38,
     "Horror":39,
     "Sci-Fi/Fantasy":40,
     "Thriller":41,
     "Shorts":42,
     "Shows":43,
     "Trailers":44,
  }
  fs.unlink(__dirname + "/"+  randomname,(err)=>{
    console.log(err)
  })
  fs.unlink(__dirname +"/" +randAudio,(err)=>{
    console.log(err)
  })
    const cat_id = category[info.videoDetails.category]
    videoUpload({title,description,tags:keywords,thumbFilePath:__dirname+"/"+randothumb,categoryId:cat_id,videoFilePath:__dirname +"/"+ randvid})
}
// downloadAndUpload("https://www.youtube.com/watch?v=iZ6MdFTSl5c")
// downloadAndUpload("https://www.youtube.com/watch?v=QCTtc36u-Kk")
app.post("/selectchannel",form,async(req,res)=>{
  console.log(req.session.token)
  oauth2Client.setCredentials(req.session.token);
  // oauth2Client.get
    var oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });
  oauth2.userinfo.get(async (err, res) => {
    if (err) {
      console.log(err);
    }
      const findUser = await User.findOneAndUpdate({google_id:res.data.id},{url:req.body.url,sort:req.body.sort})
  });
})

app.get("/getusers",async(req,res)=>{
  if(req.session.token){
    var oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    oauth2.userinfo.get(async (err, data) => {
      if (err) {
        console.log(err);
      }

        const users = await User.find()
        if(users.length>0){
          console.log(users)
          res.json({status:1,data:users,current:data.data.id})
        }
      });
  }
})

// var uploadVideo = async()=>{

//   const users = await User.find()
//   console.log(users)
//   if(users.length>0){
//     users.map(async(e)=>{
//       const channelid = await channelId(e.url)


//     ytch.getChannelInfo({channelId:channelid}).then(async(response) => {

//       if (!response.alertMessage) {
//         // console.log(response)

//       const data = await getHTML(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBlO79AaaK7z0HsMRYgOb9uS7dfmsF6NPg&type=video&channelId=${channelid}&part=snippet,id&order=date&maxResults=20`)

//       // const file = await ytdl.getInfo(data.items[0].id.videoId,{})
//       // console.log(file)
//       // const video = await ytdl.chooseFormat(file.formats,{quality:"highest"})
//       // console.log(video)
//       if(moment(data.items[0].snippet.publishedAt).local()>moment().local().subtract(30,"m")){


//      const s = await  ytdl.getBasicInfo(data.items[0].id.videoId,{downloadURL: true})
//       // console.log(s)
//       //  res.json({status:1,message:"Channel Found",result:response})
//     }
//   }
//      else {
//        console.log('Channel could not be found.')
//        // throw response.alertMessage
//     }
//  }).catch((err) => {
//     console.log(err)
//  })
//     })
//   }
// }



app.post("/findchannel",form,async(req,res)=>{
  // setTimeout(()=>{
  //   setInterval(()=>{

  //     uploadVideo()
  //   },1000)
  // },10000)
  // videoUpload()

  const channelid = await channelId(req.body.channel)
  
  
  // const s = await youtubesearchapi.GetChannelById(channelid)
  ytch.getChannelInfo({channelId:channelid}).then(async(response) => {
      console.log(response)
    if (!response.alertMessage) {
      // console.log(response)

    // const data = await getHTML(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBlO79AaaK7z0HsMRYgOb9uS7dfmsF6NPg&type=video&channelId=${channelid}&part=snippet,id&order=date&maxResults=20`)
    // const file = await ytdl.getInfo(data.items[0].id.videoId,{})
    // console.log(file)
    // const video = await ytdl.chooseFormat(file.formats,{quality:"highest"})
    // console.log(video)
  //  const s = await  ytdl.getBasicInfo(data.items[0].id.videoId,{downloadURL: true})

    // console.log($("#contents ytd-rich-grid-media div ytd-thumbnail a").attr())
    // $('ytd-rich-item-renderer div ').each((idx,el)=>{
    //   const shelf = $(el)
    //   console.log(shelf.find("ytd-rich-grid-media div ytd-thumbnail a").attr())
    //   console.log(shelf)

    // })
     res.json({status:1,message:"Channel Found",result:response})
  } else {
     console.log('Channel could not be found.')
     // throw response.alertMessage
  }
}).catch((err) => {
  console.log(err)
})
  //
  {/* const youtube = google.youtube({
    version:"v3",
    auth:oauth2Client
  })
  youtube.search.list({ auth: oauth2Client, part: 'snippet',
  channelId: channelid, type:'video',
  order:'date', maxResults:10
},
function(err, response) {
  console.log(err)
  // console.log(response)
}
); */}

})
app.post("/switch",form,async(req,res)=>{
  
  const user = await User.find({google_id:req.body.id})
  console.log(user)
  if(user.length>0){
      oauth2Client.setCredentials({access_token:'none',refresh_token:user[0].token})
      var oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });
      oauth2.userinfo.get(async (err, resp) => {
          if(err) return console.log(err)
              console.log(resp)
      })

      return res.json({status:1,message:"swiched"})
      
  }
})
app.get("/queues",(req,res)=>{
  return res.render("history")
})

app.get("/callback",(req,res)=>{
    const token = req.query.code
    // const infor = axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`)
    // console.log(infor);
    if(token){
        oauth2Client.getToken(token,(err,tokens )=>{
          if(err) throw err

          oauth2Client.setCredentials(tokens)
          var oauth2 = google.oauth2({
            auth: oauth2Client,
            version: "v2",
          });
          oauth2.userinfo.get(async (err, res) => {
            if (err) {
            } else {
              const findUser = await User.find({google_id:res.data.id})
                console.log(findUser)
                console.log(res.data)
              if(findUser.length>0){
                await User.findOneAndUpdate({google_id:res.data.id},{token:tokens.refresh_token})

              }else{

                let user_data = new User({
                  name: res.data.name,
                  google_id: res.data.id,
                  token:tokens.refresh_token
                });
                 await user_data.save();
              }
            }
          });
          req.session.token = tokens
          res.redirect("/autoupload")
        })


        const title = "demol"
        const description = "demo description"
        const tags = ["1","2","3"]

        const youtube = google.youtube({
          version:"v3",
          auth:oauth2Client
        })
        // youtube.videos.insert({
        //   part: 'snippet,status',
        //   requestBody: {
        //     snippet: {
        //       title,
        //       description,
        //       tags,
        //       categoryId: categoryIds.ScienceTechnology,
        //       defaultLanguage: 'en',
        //       defaultAudioLanguage: 'en'
        //     },
        //     status: {
        //       privacyStatus: "private"
        //     },

        //   },
        //   media: {
        //     body: fs.createReadStream(videoFilePath),
        //   },
        // }, function(err, response) {
        //   if (err) {
        //     console.log('The API returned an error: ' + err);
        //     return;
        //   }
        //   console.log(response.data)

        //   console.log('Video uploaded. Uploading the thumbnail now.')
        //   youtube.thumbnails.set({
        //     videoId: response.data.id,
        //     media: {
        //       body: fs.createReadStream(thumbFilePath)
        //     },
        //   }, function(err, response) {
        //     if (err) {
        //       console.log('The API returned an error: ' + err);
        //       return;
        //     }
        //     console.log(response.data)
        //   })
        // });
    }
})
const videoUpload = ({title,description,tags,categoryId,videoFilePath,thumbFilePath}) =>{
  console.log("hey")

const youtube = google.youtube({
  version:"v3",
  auth:oauth2Client
})
youtube.videos.insert({
  part: 'snippet,status',
  requestBody: {
    snippet: {
      title,
      description,
      tags,
      categoryId: categoryId,
      defaultLanguage: 'en',
      defaultAudioLanguage: 'en'
    },
    status: {
      privacyStatus: "public"
    },

  },
  media: {
    body: fs.createReadStream(videoFilePath),
  },
}, function(err, response) {
  if (err) {
    console.log('The API returned an error: ' + err);
    return;
  }
  console.log(response.data)

  fs.unlink(videoFilePath,(err)=>{
    if(err) console.log(err)
  })

  console.log('Video uploaded. Uploading the thumbnail now.')
  youtube.thumbnails.set({
    videoId: response.data.id,
    media: {
      body: fs.createReadStream(thumbFilePath)
    },
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log(response.data)
    fs.unlink(thumbFilePath,(err)=>{
      if(err) console.log(err)
    })
  })
});
// yt.uploadVideo("demo","no desc","multipleg tage")
}

app.listen(5000,()=>{
    console.log("running on 5000")
})
