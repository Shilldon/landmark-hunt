import * as database from './database-query'

export async function foundLandmarkMessage(payload) {
    let landmarkNumber = payload.new.current_landmark;
    const landmark = await database.getCurrentLandmark(landmarkNumber);
    console.log(landmark)
    const { data: { user } } = await database.getUser();
    const userId = user.id;
    let playerDetails = await database.getPlayerDetails(userId);
    let landmarksFound = playerDetails.landmarks_found.split(",");
    if(!landmarksFound.includes(landmark.toLowerCase())) {
        document.getElementsByClassName("clue-message")[0].innerHTML = `${titleCase(landmark)} has been found!`;
        document.getElementById("landmark-image").src = `./images/${landmark.replace(/ /g, "-").toLowerCase()}-large.jpg`;
        document.getElementById("landmark-image").style.display = "block";                  
    }
}

export function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

export function compare(a, b) {
    if (a.score > b.score) {
        return -1;
    }
    if (a.score < b.score) {
        return 1;
    }
    return 0;
}


