export const getDataUri = async function (targetUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        // console.log(reader.result);
        resolve(reader.result as string);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(xhr.response);
    };
    // var proxyUrl = "https://cors-anywhere.herokuapp.com/";
    xhr.open("GET", targetUrl);
    xhr.responseType = "blob";
    xhr.send();
  });
};
