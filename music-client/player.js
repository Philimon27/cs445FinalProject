
   
  window.onload=function(){

    if (sessionStorage.getItem('accessToken')) {
        loggedIn();
    } else {
        notLoggedin();
    }




      document.getElementById("btn").onclick= function(){
    let username=document.getElementById("username").value;
    let password=document.getElementById("password").value;
    

    let postObj={
        username:username,
        password:password
    };
    let jsonString=JSON.stringify(postObj);
    fetch("http://localhost:3000/api/auth/login", {
     method: 'POST',
     body: jsonString,
     headers: {
         'Content-Type': 'application/json; charset=UTF-8',
     },
 })
 .then(response => response.json())
 .then(json => loggedInFeatures(json));
    
}
document.getElementById('logout').onclick = function() {
    sessionStorage.removeItem('accessToken');
    notLoggedin();
}
} 
 function loggedInFeatures(json){
     if(json.status){
        document.getElementById("errorMessage").innerHTML=data.message;
     }else{
        document.getElementById("username").value="";
        document.getElementById("password").value="";
        sessionStorage.setItem("accessToken", json.accessToken);
         loggedIn()
    }
    

 }
  function fetchMusic(){
      

    fetch("http://localhost:3000/api/music",{
        headers:{
            "Authorization" : `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    }).then(response=>response.json())
    .then(songs=>{
        let tableElement = document.getElementsByTagName("table")[0];
              
            let count=0;
            let tritem = document.createElement("tr");
            tritem.innerHTML=`<th>#</th>
                             <th>Title</th>
                             <th>Release Date</th>
                             <th>Actions</th> `
            tableElement.append(tritem);
            songs.forEach(function (item) {
                let trElement = document.createElement("tr");
                // trElement.setAttribute("myId",item.id);
                trElement.innerHTML =`<td>${++count}</td>
                                     <td>${item.title}</td>
                                     <td>${item.releaseDate}</td>`;
                  
                let p = document.createElement("label");
                p.onclick =action;
                p.innerText = "+";
                trElement.append(p);
                
                tableElement.append(trElement);

        })

    }
    
    )
    
  }
  function fetchPlayList(){
       
  } 
  

  function action(){

  }
  function search(){
      let searchVal=document.getElementById("searchinput").value;

    document.getElementById("searchbtn").onclick=function(){
         fetch(`http://localhost:3000/api/music?search==${searchVal}`,
         {
             headers:{
                 "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
             }
         }
         ).
         then(response=>response.json()).
         then(searched=>console.log(searched))
  }
}
function loggedIn(){
    fetchMusic();
    fetchPlayList();
    search();
  document.getElementById("searchinput").style.display="block";
  document.getElementById("searchbtn").style.display="block";
  document.getElementById("logout").style.display="block";
  document.getElementById("welcome").innerHTML="Song you may interest";
  document.getElementById("username").style.display="none";
  document.getElementById("password").style.display="none";
  document.getElementById("btn").style.display="none";
}
function notLoggedin(){
    document.getElementById("searchinput").style.display="none";
    document.getElementById("searchbtn").style.display="none";
    document.getElementById("logout").style.display="none";
    document.getElementById("welcome").innerHTML="Welcome to Music Website";
    document.getElementById("username").style.display="block";
    document.getElementById("password").style.display="block";
    document.getElementById("btn").style.display="block";
}
