$(document).ready(function() {
	$("#title-pic").click(function() {
		location.href = "/";
	});
	$(".menu1").click(function() {
		location.href = "/menu1";
	});
	$(".menu2").click(function() {
		location.href = "/menu2";
	});
	$(".menu3").click(function() {
		location.href = "/menu3";
	});
	$(".menu4").click(function() {
		location.href = "/menu4";
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
var name;
var loginUserKey;
var userInfo;
document.addEventListener('DOMContentLoaded', function() {
	firebase.initializeApp(config);
	
	firebaseEmailAuth = firebase.auth();
	firebaseDatabase = firebase.database();

	$("#menu-login").click(function() {
		if($("#menu-login").text() == "로그인")
			location.href = "/login";
		else
			logout();
	});

	function logout() {
		firebaseEmailAuth.signOut().then(function() {
			location.href = "/menu3";
		}).catch(function(error) {
			if(error) {
				alert("로그인 실패");
			}
		});
	}

	userSessionCheck();
	function userSessionCheck() {
		firebaseEmailAuth.onAuthStateChanged(function (user) {
			if (firebaseEmailAuth.currentUser) {
				firebaseDatabase.ref("users/" + firebaseEmailAuth.currentUser.uid).once('value').then(function (snapshot) {
					document.getElementById("menu-login").textContent = "로그아웃";
					document.getElementById("menu-userinfo").textContent = snapshot.val().name + " 님";
					document.getElementById("menu-userinfo").href = "#";

					name = snapshot.val().name;
					loginUserKey = snapshot.key;
					userInfo = snapshot.val();
					return true
				});
			} else {

				return false
			}
		});
	}

});