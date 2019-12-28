const getUrlParameter = (name) => {
  return new Promise ((resolve, reject) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    console.log(results);
    resolve(results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' ')));
  });
}

exports.getUrlParameter = getUrlParameter;
