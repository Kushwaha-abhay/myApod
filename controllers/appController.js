const fetch = require("node-fetch");
const { API_KEY } = require("../config/secret");
const download = require("image-downloader");
const path = require("path");
const appModel = require("../model/appModel");

async function getHomePage(req, res) {
  let { newDate } = req.body;
  let date;

  if (newDate) date = newDate;
  else date = new Date().toISOString().slice(0, 10);

  let currentApod = await appModel.find({ date: date });
  let data = {};

  if (currentApod.length > 0) {
    console.log("Found");
    data = {
      date: currentApod[0].date,
      copyrights: currentApod[0].copyrights,
      imgAddres: currentApod[0].imgAddres,
      title: currentApod[0].title,
      explanation: currentApod[0].explanation,
    };
  } else {
    console.log("Not Found");
    data = await initiateNewRequest(date);
  }

  res.render("base.pug", data);
}

async function initiateNewRequest(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;

  const options = {
    method: "GET",
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((err) => {
      console.error({ error: err });
    });

  //console.log(response);

  downloadImage(response.url);

  let imgAddres = path.join(
    __dirname,
    "..",
    "public",
    "img",
    path.parse(response.url).base
  );

  let data = {
    date: response.date,
    copyrights: response.copyright,
    imgAddres: imgAddres,
    title: response.title,
    explanation: response.explanation,
  };

  await appModel
    .create(data)
    .then((res) => console.log("sucess"))
    .catch((err) => {
      console.error({ error: err });
    });

  return data;
}

function downloadImage(url) {
  const imgOptions = {
    url: url,
    dest: "./public/img",
  };

  download
    .image(imgOptions)
    .then(({ filename }) => {
      // console.log('Saved to', filename)
    })
    .catch((err) => console.error(err));
}
module.exports.getHomePage = getHomePage;
