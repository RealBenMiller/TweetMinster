//Setting all Variables
//URL Variables
const postCodeURL = 'https://api.postcodes.io/postcodes/';
const parliamentConsituencySearch = "https://data.parliament.uk/membersdataplatform/services/mnis/members/query/constituency="
const parliamentTwitterSearch = "https://lda.data.parliament.uk/members/";

//Return Variables
let postCode = ''; //user input
let searchURL = ''; //Creates search URL with Postcode input
let constituency = ''; //using postcode to find constituency
let mpConsituencySearchURL = ''; //uses constituency variable to return URL to identify MP
let mpTwitterSearchURL = ''; //uses MP ID generated from constituency API search to find MP information
let membersNode = ''; //navigating XML data to find Members Name 1
let membersNameValue = ''; //navigating XML data to find Members Name 2
let membersName = ''; //navigating XML data to find Members Name 3
let partyNode = ''; //navigating XML data to find Party Name 1
let partyNameValue = ''; //navigating XML data to find Pary Name 2
let partyName = ''; //navigating XML data to find Party Name 3
let memberIDNode = ''; //navigating XML data to find Members ID Number 1
let memberID = ''; //navigating XML data to find Members ID Number 2 - for MPtwittersearch URL

//HTML Variables
let yourMPisHTML = '';
let successMessage = '</br>Use the button above to tweet ';
let twitterButton = '';
let failMessage = "I'm sorry, it looks like your MP doesn't have Twitter.  We are working on new ways to contact your MP. Check Back Soon";

let $twitterWebsite = ''; //return from Members API call
let twitterhandleindex = ''; //finds start of twitter handle in web address
let twitterhandle = ''; //generates MP twitter handle

//Functions
//Find constituency from post code
const postCodeSearch = function() {
  searchURL = postCodeURL + postCode;
  $.get(searchURL, function(returns){
    if (returns.status === 200){
    constituency = returns.result.parliamentary_constituency;

  //Uses constituency to create URL for Get REQUESt for MP information
  mpConsituencySearchURL = parliamentConsituencySearch + constituency;
  //GET Request for MP info
  $.get(mpConsituencySearchURL, function(data){
    //Searches XML data to get MP name printed out
    membersNode = data.getElementsByTagName("FullTitle")[0];
    membersNameValue = membersNode.childNodes[0];
    membersName = membersNameValue.nodeValue;

    //Get Pary Name
    partyNode = data.getElementsByTagName("Party")[0];
    partyNameValue = partyNode.childNodes[0];
    partyName = partyNameValue.nodeValue;

    //Gets MPs ID Number
    memberIDNode = data.getElementsByTagName("Member")[0];
    memberID = memberIDNode.getAttribute("Member_Id")


    //Sets and prints HTML
    yourMPisHTML = "Your Member of Parliament is ";
    yourMPisHTML += membersName;
    yourMPisHTML += ', the ';
    yourMPisHTML += partyName;
    yourMPisHTML += ' MP for ';
    yourMPisHTML += constituency;
    yourMPisHTML += '.'
    yourMPisHTML += '</br>'
    $('.YourMPis').html(yourMPisHTML);

    mpTwitterSearchURL = parliamentTwitterSearch + memberID + '.json';
    $.get(mpTwitterSearchURL, function(data){

      if(data.result.primaryTopic.twitter){
      $twitterWebsite = data.result.primaryTopic.twitter._value
      twitterhandleindex = $twitterWebsite.lastIndexOf("/") + 1;
      let twitterName = $twitterWebsite.slice(twitterhandleindex);
      twitterhandle = '@' + twitterName;
      successMessage += membersName;
      $('.tweetmessage').html(successMessage);
      twitterButton = '<div class="twitterButton"><a href="https://twitter.com/intent/tweet?screen_name=' + twitterName + '&hashtags=TweetYourMP"><i class="fab fa-twitter"></i>  Tweet to ' + twitterhandle + '</a></div>';
      $('.ResponseMessage').html(twitterButton);
      } else {
      $('.ResponseMessage').html(failMessage);
      }
      });
    });
    } else {
      alert('Please try again');
    }
  });
}

$(".modal").click( function(){
  $(".modal").css("display", "none");
});

$(document).ready(function(){


  $(".postCodefinder").click(function(){
      $(".main").removeAttr("hidden");
      const $element = document.getElementById("main");
      $element.scrollIntoView({behavior: "smooth"});
      postCode = $('.postCodeInput').val();
      postCodeSearch();
  });

     $('.startAgain').click(function(){
       $(".postCodeInput").val("");
       $('html, body').animate({scrollTop : 0},800);
       return false;
  });
});
