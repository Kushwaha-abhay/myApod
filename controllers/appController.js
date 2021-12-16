const fetch = require("node-fetch");
const { API_KEY } = require("../config/secret");
const download = require("image-downloader");
const path = require("path");
const appModel = require("../model/appModel");

async function getHomePage(req, res) {
  try{
  let { newDate } = req.body;
  let date;
  
  if (newDate) 
  date = newDate;
  else
   date = new Date().toISOString().slice(0, 10);
  
  
  let currentApod = await appModel.find({ date: date });
  let data = {};
  
  if (currentApod.length > 0) {
    console.log("Found data in database");
    data = {
      date: currentApod[0].date,
      copyrights: currentApod[0].copyrights,
      media_Addres: currentApod[0].media_Addres.replace(/\\/g, "/"),
      media_type : currentApod[0].media_type,
      title: currentApod[0].title,
      explanation: currentApod[0].explanation,
    };
  } else {
    console.log("Not Found in database");
    //initiating new request on Nasa APOD API
    data = await initiateNewRequest(date);
  }
  //to determine if its a axios post request
  if(newDate)
  res.status(200).json(data);
  else
  res.render("base.pug", data);

  }
  catch(err){
    res.status(500).json({
      errrr:err
    })
    
}
}

async function initiateNewRequest(date) {
  
  try {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;

  const options = {
    method: "GET",
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((err) => {
      res.status(500).json({
        err : err
        
      })
      
    });

  console.log("Nasa api data ", response);
    if(response.url)
    downloadMedia(response.url);

  let media_Addres = path.join("media",path.parse(response.url).base);

  let data = {
    date: response.date,
    copyrights: response.copyright,
    media_Addres: media_Addres,
    media_type : response.media_type,
    title: response.title,
    explanation: response.explanation,
  };
//storing new data in DB
  await appModel
    .create(data)
    .then((res) => console.log("sucess"))
    .catch((err) => {
      console.error({ error: err });
    });

  return data;
  }
  catch(err)
  {
    res.status(500).json({
      err : err
    })
    

  }
}

function downloadMedia(url) {
  console.log("downloading media");

  const Options = {
    url: url,
    dest: "./public/media",
  };

  download
    .image(Options)
    .then(({ filename }) => {
       console.log('Download success. File saved to', filename)
    })
    .catch((err) => console.error(err));
}
module.exports.getHomePage = getHomePage;
