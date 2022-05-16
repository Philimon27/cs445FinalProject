
   
  window.onload=function(){

    if (sessionStorage.getItem('accessToken')) {
        loggedIn();
        fetchMusic();
        fetchPlayList();
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
document.getElementById("searchbtn").onclick=search;
} 


 function loggedInFeatures(json){
     if(json.status=="error"){
        document.getElementById("errorMessage").innerHTML=json.message;
     }else{
        document.getElementById("username").value="";
        document.getElementById("password").value="";
        sessionStorage.setItem("accessToken", json.accessToken);
         loggedIn()
    } 
 }


 function search(){
    let searchVal=document.getElementById("searchinput");

  document.getElementById("searchbtn").onclick=function(){
       fetch(`http://localhost:3000/api/music?search=${searchVal.value}`,
       {
           headers:{
               "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
           }
       }
       ).
       then(response=>response.json()).
       then(searched=>{
           let sTable= document.getElementsByTagName("table")[0];
           sTable.innerHTML="";
           let count=0;
           let tritem = document.createElement("tr");
           tritem.innerHTML=`<th>#</th>
                            <th>Title</th>
                            <th>Release Date</th>
                            <th>Actions</th> `
           sTable.append(tritem);
           searched.forEach(function (item) {
               let trElement = document.createElement("tr");
               // trElement.setAttribute("myId",item.id);
               trElement.innerHTML =`<td>${++count}</td>
                                    <td>${item.title}</td>
                                    <td>${item.releaseDate}</td>`;
                 
               let p = document.createElement("p");
               p.setAttribute("myid",item.id)
               p.innerText = "+";

               trElement.append(p);
               
               sTable.append(trElement);
              searchVal.value=""
       })
})
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
                                     <td>${item.releaseDate}</td>
                                     <td> <div myid="${item.id}" onclick="add(this)">+</div></td>`;
                  
                // let p = document.createElement("p");
                // p.setAttribute("myid",item.id)
                // p.innerText = "+";
                // p.onclick=add(this)

                //trElement.append(p);
                
                tableElement.append(trElement);
        })
    }) 
  }

  function add(obj){

    let aId=obj.getAttribute("myid")
    fetch("http://localhost:3000/api/playlist/add", {
         method: 'POST',
         body: JSON.stringify({
             songId: aId,
         }),
         headers: {
             'Content-type': 'application/json; charset=UTF-8',
             "Authorization" : `Bearer ${sessionStorage.getItem("accessToken")}`,
         },
     })
     .then(response => response.json())
     .then(addie =>{
         let aTable=document.getElementsByTagName("table")[1]
         aTable.innerHTML=""
         addie.forEach(function (item) {
             let trElement = document.createElement("tr");
             // trElement.setAttribute("myId",item.id);
             trElement.innerHTML =`<td>${item.orderId}</td>
                                   <td>${item.title}</td>
                                   <td><span rid="${item.songId}" onclick="remove(this)">X</span> &nbsp;
                                   <span id="pbtn" play="${item.songId}">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                   fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                   <path
                                                       d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                               </svg></span></td>`
            aTable.append(trElement);

     });
     })
 }



  function fetchPlayList(){

    fetch("http://localhost:3000/api/playlist",{
        headers:{
            "Authorization" : `Bearer ${sessionStorage.getItem("accessToken")}`
        }
    }).then(response=>response.json())
    .then(songs=>{
        let tableElement = document.getElementsByTagName("table")[1];
              
           
            let tritem = document.createElement("tr");
            tritem.innerHTML=`<th>Order</th>
                             <th>Title</th>
                             <th>Actions</th> `
            tableElement.append(tritem);
            songs.forEach(function (item) {
                let trElement = document.createElement("tr");
                // trElement.setAttribute("myId",item.id);
                trElement.innerHTML =`<td>${item.orderId}</td>
                                      <td>${item.title}</td>
                                      <td><span rid="${item.songId}"  onclick="remove(this)">X</span> &nbsp;
                                      <span id="pbtn" play="${item.title}">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                      fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                      <path
                                                          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                                  </svg></span></td>`;
                // let p = document.createElement("label");
                // p.onclick =remove(this);
                // p.innerText = "X";
                // trElement.append(p);
            
                tableElement.append(trElement);

        })
       
  }) 
}




  function remove(obj){
      let dId= obj.getAttribute("rid");
    fetch('http://localhost:3000/api/playlist/remove',{
        method: 'POST',
        body: JSON.stringify({
            songId: dId,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${sessionStorage.getItem('acessToken')}`
        }
    }).then(response => response.json())
        .then(out=> {
            let rTable=document.getElementsByTagName("table")[1];
              rTable.innerHTML="";
           
            out.forEach(function (item) {
                let trElement = document.createElement("tr");
                // trElement.setAttribute("myId",item.id);
                trElement.innerHTML =`<td>${item.orderId}</td>
                                      <td>${item.title}</td>
                                      <td><span rid="${item.songId}" onclick="remove(this)">X</span> &nbsp;
                                      <span id="pbtn" play="${item.title}">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                      fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                      <path
                                                          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                                  </svg></span></td>`
               rTable.append(trElement);
        })
    })
  }

function loggedIn(){
   
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
    document.getElementsByTagName("table")[0].style.display="none";
    document.getElementsByTagName("table")[1].style.display="none";
    document.getElementById("welcome").innerHTML="Welcome to Music Website";
    document.getElementById("username").style.display="block";
    document.getElementById("password").style.display="block";
    document.getElementById("btn").style.display="block";
   
}
  