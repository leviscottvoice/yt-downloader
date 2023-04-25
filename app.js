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
const youtubesearchapi = require('youtube-search-api')
app.set('view engine', 'ejs')
const axios = require("axios")
const cherrio = require("cheerio")

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

async function getHTML(productURL) {
  const { data: html } = await  axios.get(productURL, {
  headers: {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
}
})
.catch(function (error) {
  console.log(error);
});
return html;
}
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
  const s = await youtubesearchapi.GetChannelById(channelid)
  
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
  ytch.getChannelInfo({channelId:channelid}).then(async(response) => {
    if (!response.alertMessage) {
      // console.log(response)
      const data = await getHTML(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBlO79AaaK7z0HsMRYgOb9uS7dfmsF6NPg&type=video&channelId=${channelid}&part=snippet,id&order=date&maxResults=20`)
      console.log(data)
    
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
