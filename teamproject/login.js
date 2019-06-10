$(document).ready(function() {
	$("#title-pic").click(function() {
		location.href = "/";
	});
});

var config = {
apiKey: "AIzaSyCRzlkwDdJtzmoolOfkLAwi8GJdOF85oxY",
authDomain: "webproject-11050.firebaseapp.com",
databaseURL: "https://webproject-11050.firebaseio.com",
projectId: "webproject-11050",
storageBucket: "webproject-11050.appspot.com",
messagingSenderId: "392526228208",
appId: "1:392526228208:web:a175081aa8807680"
};
var firebaseEmailAuth;
var firebaseDatabase;
var userInfo;

document.addEventListener('DOMContentLoaded', function() {
	firebase.initializeApp(config);
	
	firebaseEmailAuth = firebase.auth();
	firebaseDatabase = firebase.database();

	$(document).on('click', '.join', function() {
		var email = $('#email_regist').val();
		var password = $('#pwd_regist').val();
		name = $('#name_regist').val();

		firebaseEmailAuth.createUserWithEmailAndPassword(email, password).then(function(user) {
			var ref = firebaseDatabase.ref("users/"+firebaseEmailAuth.currentUser.uid);
	   	 	var obj = {
	        name: name,
	    	};
		    ref.set(obj);
	    	logUser(); 
		}, function(error) {
		    var errorCode = error.code;
		    var errorMessage = error.message;
		    alert(errorMessage);
		});
 
		function logUser() {
		    alert("가입이 완료됐습니다.");
		    location.href = "/";
		}
  	});

	$(document).on('click','.login',function() {
		var email = $('#email_login').val();
		var password = $('#pwd_login').val();

		firebaseEmailAuth.signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
			loginSuccess(firebaseUser);
		}).catch(function(error) {
			alert("로그인에 실패했습니다.");
		});

	});
	function loginSuccess(firebaseUser){
		location.href = "/";
	}

});