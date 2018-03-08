// Declare app level module which depends on views, and components
angular.module('myApp', [])
    .filter('trusted', ['$sce', function ($sce) {
    return $sce.trustAsResourceUrl;
    }])

    .controller('View1Ctrl', function ($scope, $http) {
        $scope.videolist = new Array();

        $scope.getVideos = function () {
            var search = document.getElementById("Search_bar").value; //search query
            var max = checkvalue(document.getElementById("Max_results").value); //check given number of max search results

            if (search != null && search != "") {

                //YoutubeAPI handler
                var handler = $http.get("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults="+max+"&q=" +search + "&key=AIzaSyCjNDnxY16ksYxAx9P-6Pt69DdGvmAlqtw");
                //success code
                handler.success(function (data) {
                   //check if data is not empty and that we have data to use
                    if (data != null && data.items != null && data.items != null) {
                         $scope.videolist = []; //array storage
                         var videos = data.items; //get items from the api
                         //go through all the size of the given data
                         for(var i = 0; i < videos.length; i++){
                             //Set the default values
                             var temp ={ tag: "none", title: "No Title Data", image: "none",channelId: "no data", channel_name: "No Channel Name Data", description: "Description is missing"};
                             //check if we have the information needed
                             //if so add it to the temp value
                             if(videos[i].id.videoId != null){
                                 temp.tag = "https://www.youtube.com/watch?v=" + videos[i].id.videoId;
                             }
                             if(videos[i].snippet.title != null){
                                 temp.title = videos[i].snippet.title;
                             }
                             if(videos[i].snippet.thumbnails.medium.url != null){
                                 temp.image = videos[i].snippet.thumbnails.medium.url;
                             }
                             if(videos[i].snippet.channelId != null){
                                 temp.channelId = videos[i].snippet.channelId;
                             }
                             if(videos[i].snippet.channelTitle != null){
                                 temp.channel_name = videos[i].snippet.channelTitle;
                             }
                             if(videos[i].snippet.description != null){
                                 temp.description = videos[i].snippet.description;
                             }
                             //push the temp value to the array
                             $scope.videolist.push(temp);
                         }
                    }
                });
                handler.error(function (data) {
                    alert("There was some error processing your request. Please try after some time.");
                });
            }
        }
    });
//checks if we have a valid max result for the api
function checkvalue(x){
    if(x != null && x !== "" && x < 50){
        return x;
    }
    else if(x > 50){
        return 50;
    }
    else{
        return 10;
    }
}