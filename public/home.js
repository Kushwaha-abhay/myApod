let selectedDate = document.querySelector("#newDate");
selectedDate.value = new Date().toISOString().slice(0, 10);

selectedDate.addEventListener("change", async function (e) {
  e.preventDefault();
  let newDate = selectedDate.value;
  console.log("inside", newDate);

  let ob = await axios.post("http://localhost:3000/", { newDate: newDate });
  console.log(ob);

  if (ob) {
    window.location.reload();
  }
});
