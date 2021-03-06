const url = "https://script.google.com/macros/s/AKfycbzZjXP4huhmi7PnrRM3nzhl9ytZYL8kE5calPmB0lDPO3lyygQUCgg1/exec"

var currentUserId
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var teamName = $("#teamName").val();
  console.log(teamName)
  if(teamName == ""){
    user_name = profile.getName();
  }else{
    user_name = teamName;
  }
  // console.log('ID: ' + typeof (profile.getId())); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + typeof (profile.getName()));
  // console.log('Image URL: ' + typeof (profile.getImageUrl()));
  // console.log('Email: ' + typeof (profile.getEmail())); // This is null if the 'email' scope is not present.
  currentUserId = profile.getId()
  const data = {
    "id": "users",
    "User Name": user_name,
    "User ID": profile.getId(),
    "Email": profile.getEmail(),
    "Image URL": profile.getImageUrl(),
    "Current Question": 1,
    "No of Tries": 0,
    "Hints Used": 0,
    "Total Points": 0
  }
  $.post(url, data, function () {
    $("#username").html(profile.getName());
    $("#wrapper").css("display","none");
    $(".inputdiv").css("display","table");
    $("#user_name").css("display","block");
    $(".profile-pic").css("display","block");
    $(".profile-pic").css("background-image",'url('+profile.getImageUrl()+')');
    $("#user_name").html(user_name);
    showQuestion(profile.getId());
  });



}
function showQuestion(user_id) {
  var currentQuestion, tries, hintsUsed, totalPoints;

  $.getJSON("https://spreadsheets.google.com/feeds/list/1mYm2bAsjpxF5avkyfdZ1bVNQEV2Nm2kIP0bgMjYG22g/1/public/full?alt=json", function (data) {
    for (var i = 0; i < data.feed.entry.length; i++) {
      if (user_id == data.feed.entry[i].gsx$userid.$t) {
        currentQuestion = data.feed.entry[i].gsx$currentquestion.$t;
        tries = data.feed.entry[i].gsx$nooftries.$t;
        hintsUsed = data.feed.entry[i].gsx$hintsused.$t;
        totalPoints = data.feed.entry[i].gsx$totalpoints.$t;
        break;
      }
    }
    console.log(currentQuestion, tries, hintsUsed, totalPoints, "first print statement");

    $.getJSON("https://spreadsheets.google.com/feeds/list/1mYm2bAsjpxF5avkyfdZ1bVNQEV2Nm2kIP0bgMjYG22g/2/public/full?alt=json", function (data) {
      console.log("i ma here")
      for (var i = 0; i < data.feed.entry.length; i++) {
        if (currentQuestion == data.feed.entry[i].gsx$questionnumber.$t) {
          $("#question").html('<img src="https://drive.google.com/uc?export=view&id=' + data.feed.entry[i].gsx$questionurl.$t + '" class="questionStyle">')
          $("#input").html('<input type="text" id="answer" placeholder="Enter Your Answer">')
          $("#submit").html('<a class="check"><span></span><span></span><span></span><span></span>Check Your Answer</a>')
          $(".check").click(checkAnswer);
          console.log("reached here")
          if (tries >= 20) {
            $("#hint1").html(data.feed.entry[i].gsx$hint1.$t);
            $("#hint2").html(data.feed.entry[i].gsx$hint2.$t);
            $("#hint3").html(data.feed.entry[i].gsx$hint3.$t);
          }
          else if (tries >= 10) {
            $("#hint1").html(data.feed.entry[i].gsx$hint1.$t);
            $("#hint2").html(data.feed.entry[i].gsx$hint2.$t);
          }
          else if (tries >= 5) {
            $("#hint1").html(data.feed.entry[i].gsx$hint1.$t);
          } else {
            $("#hint1").html("");
            $("#hint2").html("");
            $("#hint3").html("");
          }
          break;
        }
      }
    });



  });
}
function checkAnswer() {
  var currentQuestion, tries, hintsUsed, totalPoints;
  $.getJSON("https://spreadsheets.google.com/feeds/list/1mYm2bAsjpxF5avkyfdZ1bVNQEV2Nm2kIP0bgMjYG22g/1/public/full?alt=json", function (data) {
    for (var i = 0; i < data.feed.entry.length; i++) {
      if (currentUserId == data.feed.entry[i].gsx$userid.$t) {
        currentQuestion = data.feed.entry[i].gsx$currentquestion.$t;
        tries = data.feed.entry[i].gsx$nooftries.$t;
        hintsUsed = data.feed.entry[i].gsx$hintsused.$t;
        totalPoints = data.feed.entry[i].gsx$totalpoints.$t;
        break;
      }
    }
    $.getJSON("https://spreadsheets.google.com/feeds/list/1mYm2bAsjpxF5avkyfdZ1bVNQEV2Nm2kIP0bgMjYG22g/2/public/full?alt=json", function (data) {
      for (var i = 0; i < data.feed.entry.length; i++) {
        if (currentQuestion == data.feed.entry[i].gsx$questionnumber.$t) {
          var correctAnswer = data.feed.entry[i].gsx$answer.$t;
          break;
        }
      }

          var userAnswer = $("#answer").val();

          if (userAnswer.toLowerCase() == correctAnswer.toLowerCase()) {
            
            if (tries >= 20) {
              totalPoints = Number(totalPoints) + 10;
            } else if (tries >= 10) {
              totalPoints = Number(totalPoints) + 20;
            } else if (tries >= 5) {
              totalPoints = Number(totalPoints) + 30;
            } else if (tries < 5) {
              totalPoints = Number(totalPoints) + 50;
            }
            currentQuestion = Number(currentQuestion) + 1;
            tries = 0;
            hintsUsed = 0;
            const data = {
              "id": "users",
              "tries": tries,
              "hintsUsed": hintsUsed,
              "answer": "correct",
              "user_id": currentUserId,
              "currentQuestion": currentQuestion,
              "totalPoints": totalPoints
            };
            $.post(url, data, function () {
              showQuestion(currentUserId)
              console.log("Answer Is Correct");
            });

          } else {
            tries = Number(tries) + 1;
            if (tries == 20 || tries == 10 || tries == 5) {
              hintsUsed = Number(hintsUsed) + 1
            }
            const data = {
              "id": "users",
              "tries": tries,
              "hintsUsed": hintsUsed,
              "answer": "wrong",
              "user_id": currentUserId
            };
            $.post(url, data, function () {
              showQuestion(currentUserId)
              showStatus("Answer Was Wrong please try again");
              console.log("Amswer Was Wrong please try again");
            });

          }
    });
  });
}
function showStatus(status) {
  $("#status").html(status)
  $("#status").fadeIn(500, function () {
    $("#status").fadeOut(1000)
  });


}
function signOut() {

  
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  // $("#username").html("");
  // $("#user_image").attr("src", "");
  $("#user_name").css("display","none");
  $("#wrapper").css("display","table");
  $(".inputdiv").css("display","none");
  $(".profile-pic").css("display","none");
  $("#teamName").css("display","block");
}




// ############################################################################
const signs = document.querySelectorAll('.neon')
const randomIn = (min, max) => (
  Math.floor(Math.random() * (max - min + 1) + min)
)

const mixupInterval = el => {
  const ms = randomIn(2000, 4000)
  el.style.setProperty('--interval', `${ms}ms`)
}

signs.forEach(el => {
  mixupInterval(el)
  el.addEventListener('webkitAnimationIteration', () => {
    mixupInterval(el)
  })
})
// #########################################################################################
let linkItems = document.getElementsByTagName("li");
let selector = document.getElementById("selector");

selector.style.left = 3 * 50 - 50 + "px";

for (let linkItem of linkItems) {
  linkItem.addEventListener("click", (e) => {
    let listNum = e.target.dataset.list;
    selector.style.left = listNum * 50 - 50 + "px";
    event.target.classList.add("active");

    // remove active class from other links
    for (let linkItem of linkItems) {
      if (linkItem.dataset.list !== listNum) {
        linkItem.classList.remove("active");
      }
    }
  });
}

function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}
var i=0;
$(".home").click(function(){
  $(".leaderboard").toggle("slow")

});
$(".logout").click(signOut);
$(".top-scores").click(function(){
  var leaderboard = "";
  $(".leaderboard").toggle("slow")
  $.getJSON("https://spreadsheets.google.com/feeds/list/1mYm2bAsjpxF5avkyfdZ1bVNQEV2Nm2kIP0bgMjYG22g/1/public/full?alt=json", function (data) {
    for (var i = 0; i < 5; i++) {
      leaderboard += "<li><mark>"+data.feed.entry[i].gsx$username.$t+"</mark><small>"+data.feed.entry[i].gsx$totalpoints.$t+"</small></li>"  
    }
    $(".leaderboard-list").html(leaderboard)
    
  });
});

$(document).bind("contextmenu",function(e) {
  e.preventDefault();
 });
 $(document).keydown(function(e){
     if(e.which === 123){
        return false;
     }
 });