var allUsersPoints = [];
$.getJSON("https://spreadsheets.google.com/feeds/list/1mYm2bAsjpxF5avkyfdZ1bVNQEV2Nm2kIP0bgMjYG22g/1/public/full?alt=json", function (data) {
  for (var i = 0; i < data.feed.entry.length; i++) {
    var currentUser = {
      user_id: data.feed.entry[i].gsx$userid.$t,
      points: data.feed.entry[i].gsx$totalpoints.$t
    }
    if (data.feed.entry[i].gsx$totalpoints.$t > 0) {
      allUsersPoints.push(currentUser);
    }

  }
  var sortedArray = quickSort(allUsersPoints, 0, allUsersPoints.length-1);


  console.log(sortedArray)
});
var items = [5,3,7,6,2,9];
function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}
function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)], //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (Number(items[i].points) < Number(pivot.points)) {
            i++;
        }
        while (Number(items[j].points) > Number(pivot.points)) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}
