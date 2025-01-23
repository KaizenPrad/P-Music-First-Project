  console.log("lets write javascript ");
let songs;
let currentsong = new Audio();
let currFolder;

//Changing Minute to Seconds Function

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

//Function to get songs From Folder Specified 

async function getsongs(folder) {
  currFolder = folder;  
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response; // Getting the HTML response

  //Here pushing all songs one by one to play bar 

  let as = div.getElementsByTagName("a");
 songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
       // Extracting song path from URL
    }
  }

  //here Getting all Song Info In detail
  let songul = document.querySelector(".songList").getElementsByTagName("ul")[0]
  songul.innerHTML = ""
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + ` <li>
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div> <!-- Song name -->
          <div>Naman</div> <!-- Placeholder for the artist -->
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img class="invert" src="img/Play.svg" alt="">
        </div>
      </li>
    `;
  }

  //Here we are Filtering the MP3 part From the songs 

  // Now safely select the list items inside .songList and add event listeners
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

//Now we are playing the default music here making track Func

const playmusic = (track, pause= false) => {
  // let audio = new Audio("http://127.0.0.1:3000/Bigger%20Projects/Spotify/songs/" + track)
  currentsong.src = `/${currFolder}/` + track;

  if (!pause) {
    currentsong.play();
    Play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


async function displayAlbums() {
  console.log("displaying albums")
  let a = await fetch(`/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardcontainer")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
      const e = array[index]; 
      if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
          let folder = e.href.split("/").slice(-2)[0]
          // Get the metadata of the folder
          let a = await fetch(`/songs/${folder}/info.json`)
          let response = await a.json(); 
          cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
          <div class="play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                      stroke-linejoin="round" />
              </svg>
          </div>

          <img src="/songs/${folder}/cover.jpg" alt="">
          <h2>${response.Title}</h2>
          <p>${response.description}</p>
      </div>`
      }
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => { 
      e.addEventListener("click", async item => {
          console.log("Fetching Songs")
          songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
          playmusic(songs[0])

      })
  })
}


//Its a main Function in which we are adding even listening user Interaction

async function main() {
  await getsongs("songs/ncs/");
  playmusic(songs[0], true);

  
  // Adding songs to the list
  await displayAlbums()


  //Attaching next and previous tag to control the song
  Play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      Play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      Play.src = "img/Play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // adding event listener to seek bar
  document.querySelector(".seekbaar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  Previous.addEventListener("click", () => {
    currentsong.pause()
    // console.log();
    
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });
  Next.addEventListener("click", () => {
    currentsong.pause()

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if ((index + 1) <= songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{

    currentsong.volume = parseInt(e.target.value)/100;
    if(currentsong.volume >0){
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")

    }
    else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }

  })

 

 
}

main();
