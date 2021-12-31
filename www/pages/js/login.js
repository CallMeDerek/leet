var Login = function() {
    var handleLogin = function() {
        $('.input-div').validate({
            submitHandler: function(form) {
               $.ajax({
    				dataType : "json",
    				url : "/cgi-bin/login.cgi",
    				type : "post",
    				data : {
    					userId : $('#loginUserId').val(),
    					password : $('#loginPassword').val()
    				},
    				success : function(data) {
    					if (data== 1) {
                            document.location.href = "index.html";
    					} else {
    						if (data.result == -1) {
    							alert("用户名有误或已被禁用！");
        					} else if (data.result == -2) {
        						alert("密码错误！");
        					} else {
        						alert("服务器错误！");
        					}
    					}
    				}
    			});
            }
        });
    }
    return {
        init: function() {
            handleLogin();
        }
    };
}();


