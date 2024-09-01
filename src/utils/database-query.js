import supabase from '../utils/supabase'

export async function getUser() {
    let res = await supabase.auth.getUser();
    return res;
}

export async function getAnswers(questionNumber) {
    let res = await supabase
    .from("landmarks")
    .select("answer")
    .eq("id",questionNumber)

    return res.data[0].answer;
}

export async function playersFoundLandmark() {
  let res = await supabase
  .from("current-landmark")
  .select("times_found")
  .eq("id",1)

  return res.data[0].times_found;
}


export async function checkQuestionNumber() {
    let res = await supabase
    .from("current-landmark")
    .select("current_landmark")
    .eq("id",1)

    return res.data[0].current_landmark;
}

export async function getCurrentLandmark(questionNumber) {
  let res = await supabase
  .from("landmarks")
  .select("landmark")
  .eq("id",questionNumber)

  return res.data[0].landmark;
}

export async function setCurrentLandmark() {
  let res = await supabase
  .from("current-landmark")
  .select("current_landmark")
  .eq("id",1)
  console.log(res)
  let currentLandmark = res.data[0].current_landmark+1;
console.log("CURRENT ",currentLandmark)
  await supabase
  .from("current-landmark")
  .update([{"current_landmark":currentLandmark,"times_found":""}])
  .eq("id",1)

}


export async function getClues(questionNumber) {
    let res = await supabase
    .from("landmarks")
    .select("clues")
    .eq("id",questionNumber)

    return res.data[0].clues;
}

export async function getCoords(landmark) {
    let res = await supabase
    .from("landmarks")
    .select()
    .eq("id",landmark)

    return {
        "coords":[res.data[0].lat,res.data[0].lng],
        "zoom":res.data[0].zoom,
        "landmark":res.data[0].landmark,
        "radius":res.data[0].radius,
        "geojson":res.data[0].geojson,
        "clue":res.data[0].landmark_clue
    }
    ;
}

export async function getPlayers() {
    let res = await supabase
    .from("players")
    .select()
    .eq("logged_in", true)

    return res;
}

export async function foundLandmark(player) {
  //increment the number of times the landmark has been found
  let res = await supabase
  .from("current-landmark")
  .select("times_found")
  .eq("id",1)

  let finders = res.data[0].times_found;
  if(finders!="") {
    finders = finders.split(",")
    finders.push(player);
  }
  else {
    finders = [player];
  }
  let findersString = finders.toString()
  res = await supabase
  .from("current-landmark")
  .update({"times_found":findersString})
  .eq("id",1)

  return finders;
}


export async function getPlayerDetails(user) {
    let res = await supabase
    .from("players")
    .select()
    .eq("user_id",user)

    return res.data[0];
}

export async function getScore(user) {
    let res = await supabase
    .from("players")
    .select("score")
    .eq("user_id",user)

    return res.data[0].score;
}

export async function setScore(user,score) {

  let res = await supabase
  .from("players")
  .select("score")
  .eq("user_id",user)

    let newScore = res.data[0].score+score;

    res = await supabase
    .from("players")
    .update({"score" : newScore })
    .eq("user_id",user)

    return res;
}

export async function updateHintsUsed(user,hintsUsed,score) {
    let res = await supabase
    .from("players")
    .update({"hints_used":hintsUsed,"score":score})
    .eq("user_id",user)

    return res;
}

export async function resetPlayer(user,landmark,position) {
  let res = await supabase
  .from("players")
  .select("landmarks_found")
  .eq("user_id",user)

  let medal;
  switch(position) {
    case 1: medal = "gold"; break;
    case 2: medal = "silver"; break;
    default: medal = "bronze"; break;
  }
  
  let landmarksFound = res.data[0].landmarks_found;
  let landmarksDict = {};
  if(landmarksFound === "") {
    landmarksDict[`"${landmark}"`] = `"${medal}"`;
  }
  else {
    landmarksDict = JSON.parse(landmarksFound);
    landmarksDict[landmark] = medal;
  }


  res = await supabase
  .from("players")
  .update({"hints_used":"0,0,0","landmarks_found":landmarksDict})
  .eq("user_id",user)

  return res;
}

supabase.auth.onAuthStateChange((event, session) => {
    
  
    if (event === 'INITIAL_SESSION') {
      // handle initial session
      if(session) {
        confirmSignIn(session.user.id)

      }
     // confirmSignIn(session.user.id)
    } else if (event === 'SIGNED_IN') {
      // handle sign in event
      if(session) {
        confirmSignIn(session.user.id)
      }
     // 
    } else if (event === 'SIGNED_OUT') {
      // handle sign out event
    } else if (event === 'PASSWORD_RECOVERY') {
      // handle password recovery event
    } else if (event === 'TOKEN_REFRESHED') {
      // handle token refreshed event
    } else if (event === 'USER_UPDATED') {
      // handle user updated event
    }
  })

async  function confirmSignIn(user) {

    await supabase
    .from("players")
    .update({"logged_in":true})
    .eq("user_id",user)
  }

