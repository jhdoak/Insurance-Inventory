// This listens for changes to the file input
// and selects the file to be uploaded.
(() => {
  document.getElementById("file-input").onchange = () => {
    const files = document.getElementById('file-input').files;
    const file = files[0];
    if(file == null){
      return alert('No file selected.');
    }
    getSignedRequest(file);
  };
})();

// Retrieves signed request using the file's
// name and MIME type
function getSignedRequest(file){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

// If retrieval of signed request is successful,
// upload the file to the S3 bucket.
function uploadFile(file, signedRequest, url){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        if (document.getElementById('preview')) {
          document.getElementById('preview').src = url;
        } else {
          var imagePreview = document.createElement("img");
          imagePreview.id = "preview";
          imagePreview.src = url;
          document.getElementById('image-upload').appendChild(imagePreview);
        }
        document.getElementById('image-url').value = url;
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}
