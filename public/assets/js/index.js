
async function sendRquest(url, formName) {
 try {

  let form = document.querySelector(formName);
  let data = new FormData(form);

  axios.post(url, data)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
 } catch (error) {

 }


}
