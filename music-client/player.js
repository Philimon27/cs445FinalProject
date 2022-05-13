

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
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(response => response.json())
    .then(json => console.log(json));



       
   }

  