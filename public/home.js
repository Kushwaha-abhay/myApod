let selectedDate = document.querySelector("#newDate");
selectedDate.value = new Date().toISOString().slice(0, 10);

selectedDate.addEventListener("change", async function (e) {
  e.preventDefault();
  let newDate = selectedDate.value;
  console.log("inside", newDate);

  let ob = await axios.post("http://localhost:3000/myapod", {
    newDate: newDate,
  });

  if (ob.data) {
    document.querySelector("#title").innerHTML = ob.data.title;

    document.querySelector("#explanation").innerHTML = ob.data.explanation;
    if (ob.data.media_type == "image") {
      if (document.querySelector("#apodImage"))
        document.querySelector("#apodImage").src = ob.data.media_Addres;
      else {
        var img = document.createElement("img");
        img.id = "apodImage";
        img.src = ob.data.media_Addres;
        document.querySelector("#videosrc").remove();
        document.querySelector("#mediaPara").appendChild(img);
      }
    } else {
      if (document.querySelector("#videosrc"))
        document.querySelector("#videosrc").src = ob.data.media_Addres;
      else {
        var video = document.createElement("video");
        video.width = 1000;
        video.height = 500;
        video.controls = true;
        video.id = "videosrc";

        video.src = ob.data.media_Addres;

        document.querySelector("#media").remove();
        document.querySelector("#mediaPara").appendChild(video);
      }
    }
  }
});
