/**
 * Initial Authentication Check
 * Executes immediately to ensure unauthorized users are redirected.
 */
auth();

app.controller("loginController", function($scope, $window) {
    // Initializing View State
    $scope.step = 1; // 1: Credentials, 2: OTP
    $scope.msg = "";
    $scope.generatedOtp = null;

    /**
     * User Registration Logic
     */
    $scope.register = function() {
        if (!$scope.email || !$scope.password) {
            $scope.msg = "Please fill in all fields.";
            return;
        }

        let user = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password
        };

        let user_exist = getUser(user.email);
        if (user_exist) {
            $scope.msg = "User already exists. Use a different email.";
            return;
        }

        let all_users = JSON.parse(localStorage.getItem("users") || "[]");
        all_users.push(user);
        localStorage.setItem('users', JSON.stringify(all_users));
        
        $scope.msg = "User Registered Successfully!";
        
        // Optional: Redirect to login after registration
        setTimeout(() => { $window.location.hash = "#!/login"; }, 1500);
    };
    
    /**
     * Login Logic - Step 1: Credential Verification & OTP Dispatch
     */
    $scope.login = function() {
        let user = getUser($scope.email);
        
        if (!user) {
            $scope.msg = 'User does not exist!';
            return;
        }
        
        if (user.email === $scope.email && user.password === $scope.password) {
            $scope.msg = "Verifying... Sending OTP to your email.";
            
            // Generate 6-digit secure OTP
            $scope.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            const templateParams = {
                user_email: $scope.email,
                otp_code: $scope.generatedOtp,
                reply_to: 'noreply@musicspa.com'
            };

            // EmailJS Integration
            emailjs.send(
                'service_m7eugzd', 
                'template_5cg8n2c', 
                templateParams
            ).then(function() {
                $scope.$apply(function() {
                    $scope.msg = "OTP sent to " + $scope.email;
                    $scope.step = 2; // Transition UI to OTP input
                });
            }).catch(function(error) {
                $scope.$apply(function() {
                    $scope.msg = "Error sending email. Check console.";
                    console.error("EmailJS Error:", error);
                });
            });
        } else {
            $scope.msg = "Invalid email or password!";
        }
    };

    /**
     * Login Logic - Step 2: OTP Validation
     */
    $scope.verifyOtp = function() {
        if ($scope.otp === $scope.generatedOtp) {
            localStorage.setItem("isLogined", 'true');
            localStorage.setItem("currentUser", $scope.email); // Track active session
            $scope.msg = "Login successful!";
            $window.location.replace("#!/"); 
        } else {
            $scope.msg = "Invalid OTP. Please try again.";
        }
    };
});

/**
 * Global Helper: Route Protection
 */
function auth() {
    let all_users = JSON.parse(localStorage.getItem("users") || "[]");
    let isLogined = JSON.parse(localStorage.getItem("isLogined"));

    if (all_users.length === 0) {
        window.location.replace(`#!/register/`);
        return;
    }

    if (!isLogined) {
        // Prevent redirect loop if already on login or register
        if (!window.location.hash.includes('login') && !window.location.hash.includes('register')) {
            window.location.replace(`#!/login/`);
        }
    }
}

/**
 * Global Helper: Data Retrieval
 */
function getUser(email) {
    let all_users = JSON.parse(localStorage.getItem("users") || "[]");
    if (!all_users) return false;

    for (let i = 0; i < all_users.length; i++) {
        if (all_users[i].email === email) {
            return all_users[i];
        }
    }
    return false;
}