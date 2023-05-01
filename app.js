const yt = require("./youtube-upload")
const express = require("express")
const app = express()
const {google, GoogleApis} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const credentials = require("./client_secret.json")
const cookieparser = require("cookie-parser")
const multer = require("multer")
const form = multer().array()
const session = require("express-session")
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
const {channelId,videoId}  = require("@gonetone/get-youtube-id-by-url")
const ytch = require('yt-channel-info')
const youtubesearchapi = require('youtube-search-api')
app.set('view engine', 'ejs')
const axios = require("axios")
const ytdl = require("ytdl-core")
const moment = require("moment")
require("dotenv").config()
const Long = require("long")



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
const User = require("./model/users")
const videoFilePath = "./" + "vid.mp4"
const thumbFilePath = "./" + "thumb.jpg"
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/userinfo.profile'];
const clientSecret = credentials.web.client_secret;
      const clientId = credentials.web.client_id;
       const redirectUrl = credentials.web.redirect_uris[0];
      const oauth2Client = new OAuth2(clientId, clientSecret,redirectUrl);
var auth = false
const categoryIds = {
  Entertainment: 24,
  Education: 27,
  ScienceTechnology: 28
}

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

const str = "https://www.youtube.com/watch?v=b7DrwqoHAGA"

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
      scope: SCOPES
    });
-    res.render("login",{url:authUrl})
  }else{
    res.render("home",)

  }
  
})
app.get("/get",(req,res)=>{

      if(!req?.session?.token){

        const authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES
        });

      }else{

        // const youtube = google.youtube({
        //   version:"v3",
        //   auth:oauth2Client
        // })
        // const title = "demol"
        // const description = "demo description"
        // const tags = ["1","2","3"]

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
        //       privacyStatus: "private",
        //       selfDeclaredMadeForKids:true
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
app.get("/autoupload",(req,res)=>{
  res.render("autoupload")
})
app.get("/linkupload",(req,res)=>{
  res.render("linkupload")

})

app.post("/uploadurl",form,async(req,res)=>{
  const urls =  req.body.urls.split(",")
  const startTime =  new Long( new Date(moment(req.body.time)).getTime())
  var timeIsBeing936 = new Date(new Date(moment(req.body.time))).getTime()
  , currentTime = new Date().getTime()
  , subtractMilliSecondsValue = timeIsBeing936 - currentTime;
  const interval = new Long( parseInt(req.body.interval) * 60000)
  console.log(interval.toString())
  setTimeout(()=>{

    for (let i = 0; i < urls.length-1; i++) {
      setTimeout( ()=> downloadAndUpload(urls[1],interval.toString()), interval.toString());
    }
    // urls.map(async(e)=>{
      
      
      
    // })
  },subtractMilliSecondsValue)
})
function timer(ms) { return new Promise(res => setTimeout(res, ms)); }
const downloadAndUpload = async(e,interval) =>{
    // await timer(interval)
  const videoId = e.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1]
  const info =  await ytdl.getBasicInfo(videoId,{downloadURL: true}) 
  console.log(info)
}
app.post("/selectchannel",form,async(req,res)=>{
  console.log(req.session.token)
  oauth2Client.setCredentials(req.session.token);
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

var uploadVideo = async()=>{

  const users = await User.find()
  console.log(users)
  if(users.length>0){
    users.map(async(e)=>{
      const channelid = await channelId(e.url)

    
    ytch.getChannelInfo({channelId:channelid}).then(async(response) => {

      if (!response.alertMessage) {
        // console.log(response)
      
      const data = await getHTML(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBlO79AaaK7z0HsMRYgOb9uS7dfmsF6NPg&type=video&channelId=${channelid}&part=snippet,id&order=date&maxResults=20`)
      
      // const file = await ytdl.getInfo(data.items[0].id.videoId,{})
      // console.log(file)
      // const video = await ytdl.chooseFormat(file.formats,{quality:"highest"})
      // console.log(video)
      if(moment(data.items[0].snippet.publishedAt).local()>moment().local().subtract(30,"m")){

      
     const s = await  ytdl.getBasicInfo(data.items[0].id.videoId,{downloadURL: true})
      // console.log(s)
      //  res.json({status:1,message:"Channel Found",result:response})
    }
  }
     else {
       console.log('Channel could not be found.')
       // throw response.alertMessage
    }
 }).catch((err) => {
    console.log(err)
 })
    })
  }
}



app.post("/findchannel",form,async(req,res)=>{
  // setTimeout(()=>{
  //   setInterval(()=>{

  //     uploadVideo()
  //   },1000)
  // },10000)
  videoUpload()
  
  const channelid = await channelId(req.body.channel)
  console.log(channelid)
  // const s = await youtubesearchapi.GetChannelById(channelid)
  ytch.getChannelInfo({channelId:channelid}).then(async(response) => {

    if (!response.alertMessage) {
      // console.log(response)
    
    const data = await getHTML(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBlO79AaaK7z0HsMRYgOb9uS7dfmsF6NPg&type=video&channelId=${channelid}&part=snippet,id&order=date&maxResults=20`)
    // const file = await ytdl.getInfo(data.items[0].id.videoId,{})
    // console.log(file)
    // const video = await ytdl.chooseFormat(file.formats,{quality:"highest"})
    // console.log(video)
   const s = await  ytdl.getBasicInfo(data.items[0].id.videoId,{downloadURL: true})

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
app.get("/callback",(req,res)=>{
    const token = req.query.code
    // const infor = axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`)
    // console.log(infor);
    if(token){

    +-
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
const videoUpload = () =>{
  console.log("hey")
const title = "demol"
const description = "demo description"
const tags = ["1","2","3"]

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
      categoryId: categoryIds.ScienceTechnology,
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
  })
});
// yt.uploadVideo("demo","no desc","multipleg tage")
}

app.listen(5000,()=>{
    console.log("running on 5000")
})
