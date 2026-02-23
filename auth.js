auth()

app.controller("loginController", ($scope)=>{
    let all_users = JSON.parse(localStorage.getItem("users") || "[]");


    $scope.register = function(){
        let user = {
            username : $scope.username,
            email : $scope.email,
            password : $scope.password
        }

        let user_exist = getUser(user.email);
        console.log(user_exist)
        if(user_exist){
            $scope.msg = "User already Exist. Use diff Email.";
            return;
        }

        all_users.push(user)
        localStorage.setItem('users', JSON.stringify(all_users));
        $scope.msg = "User Registered"
    }
    
    $scope.login = function(){
        
        let user = getUser($scope.email);
        if(!user){
            $scope.msg = 'User Does not Exist !';
            return;
        }
        if(user.email == $scope.email && user.password == $scope.password ){
            localStorage.setItem("isLogined", 'true');
            console.log("User logined ", user.email);
            $scope.msg = "User logined";
        }else{
            $scope.msg = "email or password is wrong !";
        }

    }
});


function auth(){
    let all_users = JSON.parse(localStorage.getItem("users") || "[]");
    if(all_users.length == 0){
        window.location.replace(`#!/register/`);
    }
    let isLogined = JSON.parse(localStorage.getItem("isLogined"));
    if(!isLogined){
        window.location.replace(`#!/login/`);
    }else{
        window.location.replace("#!/")
    }
}

function getUser(email){
    let all_users = JSON.parse(localStorage.getItem("users") || "[]");
    if(!all_users){
        return false
    }

    for(let i=0; i< all_users.length ; i++){
        if(all_users[i].email == email){
            return all_users[i]
        }
    }
    return false
}