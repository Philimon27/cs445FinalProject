window.onload = function () {
  if (sessionStorage.getItem("accessToken")) {
    loggedIn();
    fetchMusic();
    fetchPlayList();
  } else {
    notLoggedin();
  }

  document.getElementById("btn").onclick = function () {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let postObj = {
      username: username,
      password: password,
    };
    let jsonString = JSON.stringify(postObj);
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: jsonString,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => loggedInFeatures(json));
  };
  document.getElementById("logout").onclick = function () {
    sessionStorage.removeItem("accessToken");
    notLoggedin();
  };
  search();
};

function loggedInFeatures(json) {
  if (json.status == "error") {
    document.getElementById("errorMessage").innerHTML = json.message;
  } else {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    sessionStorage.setItem("accessToken", json.accessToken);
    fetchMusic();
    fetchPlayList();
    loggedIn();
  }
}
//*****Searching Specific Music By Title******
function search() {
  let searchVal = document.getElementById("searchinput");
  document.getElementById("searchbtn").onclick = function () {
    fetch(`http://localhost:3000/api/music?search=${searchVal.value}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((searched) => {
        let sTable = document.getElementsByTagName("table")[0];
        sTable.innerHTML = "";
        let count = 0;
        let tritem = document.createElement("tr");
        tritem.innerHTML = `<th>#</th>
                            <th>Title</th>
                            <th>Release Date</th>
                            <th>Actions</th> `;
        sTable.append(tritem);
        searched.forEach(function (item) {
          let trElement = document.createElement("tr");

          trElement.innerHTML = `<td>${++count}</td>
                                    <td>${item.title}</td>
                                    <td>${item.releaseDate}</td>`;

          let p = document.createElement("p");
          p.setAttribute("myid", item.id);
          p.innerText = "+";
          trElement.append(p);
          sTable.append(trElement);
          searchVal.value = "";
        });
      });
  };
}

function fetchMusic() {
  fetch("http://localhost:3000/api/music", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then((songs) => {
      let tableElement = document.getElementsByTagName("table")[0];

      let count = 0;
      let tritem = document.createElement("tr");
      tritem.innerHTML = `<th>#</th>
                             <th>Title</th>
                             <th>Release Date</th>
                             <th>Actions</th> `;
      tableElement.append(tritem);
      songs.forEach(function (item) {
        let trElement = document.createElement("tr");
        trElement.innerHTML = `<td>${++count}</td>
                                     <td>${item.title}</td>
                                     <td>${item.releaseDate}</td>
                                     <td> <div myid="${
                                       item.id
                                     }" onclick="add(this)">+</div></td>`;

        tableElement.append(trElement);
      });
    });
}
// *****Adding to Playlist******
function add(obj) {
  let aId = obj.getAttribute("myid");
  fetch("http://localhost:3000/api/playlist/add", {
    method: "POST",
    body: JSON.stringify({
      songId: aId,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then((addie) => {
      let aTable = document.getElementsByTagName("table")[1];
      aTable.innerHTML = "";
      addie.forEach(function (item) {
        let trElement = document.createElement("tr");

        trElement.innerHTML = `<td>${item.orderId}</td>
                                   <td>${item.title}</td>
                                   <td><span rid="${item.songId}" onclick="del(this)">X</span> &nbsp;
                                   <span id="pbtn" play="${item.urlPath}">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                   fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                   <path
                                                       d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                               </svg></span></td>`;
        aTable.append(trElement);
      });
    });
}
//******Fetching From Playlist******
function fetchPlayList() {
  fetch("http://localhost:3000/api/playlist", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then((songs) => {
      let tableElement = document.getElementsByTagName("table")[1];

      let tritem = document.createElement("tr");
      tritem.innerHTML = `<th>Order</th>
                             <th>Title</th>
                             <th>Actions</th> `;
      tableElement.append(tritem);
      songs.forEach(function (item) {
        let trElement = document.createElement("tr");

        trElement.innerHTML = `<td>${item.orderId}</td>
                                      <td>${item.title}</td>
                                      <td><span rid="${item.songId}" onclick="del(this)">X</span> &nbsp;
                                      <span id="pbtn" play="${item.urlPath}" onclick="play(this)">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                      fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                      <path
                                                          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                                  </svg></span></td>`;

        tableElement.append(trElement);
      });
    });
}

// *****Removing from playlist******
function del(obj) {
  let dId = obj.getAttribute("rid");
  fetch("http://localhost:3000/api/playlist/remove", {
    method: "POST",
    body: JSON.stringify({
      songId: dId,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let rTable = document.getElementsByTagName("table")[1];
      rTable.innerHTML = "";

      data.forEach(function (item) {
        let trElement = document.createElement("tr");

        trElement.innerHTML = `<td>${item.orderId}</td>
                                      <td>${item.title}</td>
                                      <td><span rid="${item.songId}" onclick="del(this)">X</span> &nbsp;
                                      <span id="pbtn" play="${item.urlPath}" onclick="play(this)">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                      fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                      <path
                                                          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                                  </svg></span></td>`;
        rTable.append(trElement);
      });
    });
}

function play(obj) {
  let pAtt = obj.getAttribute("play");
  let audioPlayer = document.getElementById("player");
  audioPlayer.innerHTML = `<audio controls autoplay>
         <source  src="http://localhost:3000/${pAtt}" type="audio/mpeg">
     </audio>`;
}

function loggedIn() {
  document.getElementById("searchinput").style.display = "block";
  document.getElementById("searchbtn").style.display = "block";
  document.getElementById("logout").style.display = "block";
  document.getElementById("playlistText").style.display = "block";
  document.getElementById("welcome").innerHTML = "Song you may interest";
  document.getElementById("username").style.display = "none";
  document.getElementById("password").style.display = "none";
  document.getElementById("btn").style.display = "none";
  document.getElementById("player").style.display="block"
}

function notLoggedin() {
  document.getElementById("searchinput").style.display = "none";
  document.getElementById("searchbtn").style.display = "none";
  document.getElementById("logout").style.display = "none";
  document.getElementById("playlistText").style.display = "none";
  document.getElementsByTagName("table")[0].style.display = "none";
  document.getElementsByTagName("table")[1].style.display = "none";
  document.getElementById("welcome").innerHTML = "Welcome to Music Website";
  document.getElementById("username").style.display = "block";
  document.getElementById("password").style.display = "block";
  document.getElementById("btn").style.display = "block";
  document.getElementById("player").style.display="none"
  
}
