const yt = require("./youtube-upload")
const express = require("express")
const app = express()
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const credentials = require("./client_secret.json")
const cookieparser = require("cookie-parser")
const multer = require("multer")
const form = multer().array()
const session = require("express-session")
const fs = require("fs")
const path = require("path")
const {channelId,videoId}  = require("@gonetone/get-youtube-id-by-url")
const ytch = require('yt-channel-info')
app.set('view engine', 'ejs')


app.use(cookieparser())
app.use(session({
  secret:"e6VgtiqH1DwSNFnHWOJcQEp4b7FwGEZB",
  saveUninitialized: true,
  resave: true
}))

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
app.get("/",(req,res)=>{
  if(!req?.session?.token){
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    res.render("login",{url:authUrl})
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
app.post("/findchannel",form,async(req,res)=>{
  const channelid = await channelId(req.body.channel)
  ytch.getChannelInfo({channelId:channelid}).then((response) => {
    if (!response.alertMessage) {
       console.log(response)
    } else {
       console.log('Channel could not be found.')
       // throw response.alertMessage
    }
 }).catch((err) => {
    console.log(err)
 })
})
app.get("/callback",(req,res)=>{
    const token = req.query.code
    if(token){
        oauth2Client.getToken(token,(err,tokens )=>{
          if(err) throw err
          oauth2Client.setCredentials(tokens)
          req.session.token = token
          res.redirect("/")
        })
      

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
              privacyStatus: "private"
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
    }
})

// yt.uploadVideo("demo","no desc","multipleg tage")
app.listen(5000,()=>{
    console.log("running")
})
