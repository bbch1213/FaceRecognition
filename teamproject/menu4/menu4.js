
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

	showScore(); 
	function showScore() {
		var req = $.ajax({ url:"/json", dataType:"json" });
		req.done(function(data) { 
			//console.log(data);
			// 5, 6월 정보 저장
			var dayMay = data.lscd[8].mscd.g[28]; // seri(점수) or gdte(YYYY-MM-DD날짜)
			var dayJune = data.lscd[9].mscd.g; // dayJune[0].gdte;
			
			// 5월 경기정보 출력
			var tb = $("<table />");
			var gamedate = dayMay.gdte.split('-');
			var row = $("<tr />").append($("<td />").text(gamedate[1]+"-"+(parseInt(gamedate[2])+1)));
			row.append($("<td />").text(dayMay.seri));
			var gswscore = dayMay.v.ta == "GSW"? dayMay.v.s : dayMay.h.s;
			var torscore = dayMay.v.ta == "TOR"? dayMay.v.s : dayMay.h.s;
			row.append($("<td />").text(gswscore + " : " + torscore));
			$("#scorecanvas").html(tb.append(row));
			// 6월 경기정보 출력
			for(var i = 0; i < 6; i++) {
				var mydate = new Date();
				var gamedate = dayJune[i].gdte.split('-');
				var row = $("<tr />").append($("<td />").text(gamedate[1]+"-"+(parseInt(gamedate[2])+1)));
				
				if((parseInt(mydate.getMonth())+1 > parseInt(gamedate[1])) && parseInt(mydate.getFullYear()) == 2019) {
					// 6월이 지났으면 일정이 다 끝난 것 -> 결과 모두 보여줌	
					row.append($("<td />").text(dayJune[i].seri));
					var gswscore = dayJune[i].v.ta == "GSW"? dayJune[i].v.s : dayJune[i].h.s;
					var torscore = dayJune[i].v.ta == "TOR"? dayJune[i].v.s : dayJune[i].h.s;
					row.append($("<td />").text(gswscore + " : " + torscore));
					$("#scorecanvas").html(tb.append(row));
				} else if((parseInt(mydate.getDate())-1 < parseInt(gamedate[2])) && parseInt(mydate.getFullYear()) == 2019) {
					// 아직 경기가 진행되지 않았으면 보여주지 않음
					row.append($("<td colspan=2></td>"));
					$("#scorecanvas").html(tb.append(row));
				} else {
					// 경기가 진행 된 후에는 결과를 보여줌
					row.append($("<td />").text(dayJune[i].seri));
					var gswscore = dayJune[i].v.ta == "GSW"? dayJune[i].v.s : dayJune[i].h.s;
					var torscore = dayJune[i].v.ta == "TOR"? dayJune[i].v.s : dayJune[i].h.s;
					row.append($("<td />").text(gswscore + " : " + torscore));
					$("#scorecanvas").html(tb.append(row));
				}
			}

			// 현재 팀 스코어 출력
			var seritext = dayJune[5].seri;
			var winteam = seritext.substring(0, 3);
			var series_score = seritext.substring(seritext.length-3 ,seritext.length).split('-');
			var show_seri_text;
			if(winteam == "TOR") {
				show_seri_text = series_score[1] + " : " + series_score[0];
			} else {
				show_seri_text = series_score[0] + " : " + series_score[1];
			}
			$("#showseries").html(show_seri_text);
		});
		req.fail(function(jqXHR, textStatus) { 
			alert("failed : " + textStatus); 
		});
	}
	showList();

	$("#write").click(function()
	{
		location.href = "./boardForm.html";
	});

	$(document).on('click', '#save', function()
	{
		var sessionCheck = document.getElementById("menu-login").textContent;
		if(sessionCheck == "로그아웃")
			saveForm();
		else
			alert("로그인을 먼저 해주세요.");
	});
});

// Your web app's Firebase configuration
var config = {
apiKey: "AIzaSyCRzlkwDdJtzmoolOfkLAwi8GJdOF85oxY",
authDomain: "webproject-11050.firebaseapp.com",
databaseURL: "https://webproject-11050.firebaseio.com",
projectId: "webproject-11050",
storageBucket: "webproject-11050.appspot.com",
messagingSenderId: "392526228208",
appId: "1:392526228208:web:a175081aa8807680"
};
// Initialize Firebase

firebase.initializeApp(config);
var firebaseEmailAuth = firebase.auth();
var firebaseDatabase = firebase.database();
var name;
var Overlap;
var loginUserKey;
var userInfo;

function showList()
{
	var ref = firebaseDatabase.ref('board/');
	ref.on('child_added', on_list);
}

function on_list(data)
{
	var key = data.key;
	var Data = data.val();
	var team = Data.team;
	var brdmemo = Data.brdmemo;
	var brdwriter = Data.brdwriter;
	var brddate = Data.brddate;

	var html = "<div class=\"media-body\" id=\"\">" +
        "<h4 class=\"media-heading\">" + brdwriter +
        "님의 응원 <span STYLE=\"color: black; font-size: 8pt\">" + brddate + "</span></h4>" +
        "<p>" + brdmemo + "</p></div></div>";

    if(team=="gds")
    	$("#gdsList").append(html);
    else
    	$("#trtList").append(html);
}

function saveForm()
{
	var team = $('input[name="tab"]:checked').val();
	var brdwriter = name;
	var brdmemo = $("#brdmemo").val();
	if(brdmemo=="")
	{
		alert("내용을 입력해주세요");
		return;
	}
	var now = new Date();
	var month = now.getMonth()+1;
	var s = now.getFullYear() + ' ' + month + ' ' + now.getDate();
	var brddate = s;
	OverlapCheck(name);
	if(Overlap<0)
	{
		alert("중복응원은 불가능합니다.");
		return;
	}
	else
	{
		
		var ref = firebaseDatabase.ref("board/");
		var board = ref.push();
		var obj = {
			team: team,
			brdwriter: brdwriter,
			brdmemo: brdmemo,
			brddate: brddate
		};
		board.set(obj);
		log();
		function log()
		{
			alert("등록이 완료됐습니다.");
			$('#brdmemo').val("");
		}
	}
	
}

function OverlapCheck(name)
{
	console.log("중복검사");
	var ref = firebaseDatabase.ref();
	ref.child('board').orderByChild('brdwriter').equalTo(name).once('value', function(data)
		{
			var Data = data.val();
			if(Data==null)
				Overlap = 1;
			else
				Overlap = -1;
		});
}

document.addEventListener('DOMContentLoaded', function() {
	//firebase.initializeApp(firebaseConfig);

	$("#menu-login").click(function() {
		if($("#menu-login").text() == "로그인")
			location.href = "/login";
		else
			logout();
	});

	function logout() {
		firebaseEmailAuth.signOut().then(function() {
			location.href = "/menu4";
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
				$('#brdmemo').val("로그인이 필요한 기능입니다.");
				return false
			}
		});
	}

});