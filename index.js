const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
};


const loadPage = (pwd) => {

  console.log(pwd);

  var hash = simpleHash(pwd);
  var url = hash + "/index.html";

  var request = new XMLHttpRequest();
  request.onerror = function() {
    parent.location.hash= hash;

    var passwordHolder = document.getElementById("password");
    passwordHolder.placeholder = "wrong password";
    passwordHolder.innerHTML = "";
  };
  request.onload = function () {

    if (this.status >= 200 && this.status < 400) {
        // Success!
        window.location = url;
      } else {
        // We reached our target server, but it returned an error
        parent.location.hash= hash;

        var passwordHolder = document.getElementById("password");
        passwordHolder.value = "";
        var wrongPassword = document.getElementById("wrongPassword");
        wrongPassword.style.visibility = "visible";
      }
  }
  request.open('GET', url);
  request.send();
}


const login = () => {
  let password = document.getElementById("password").value;
  loadPage(password);
}