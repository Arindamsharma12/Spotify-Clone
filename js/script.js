console.log("Let's write javascript")
let currentSong = new Audio();
let currFolder;
let songs;
async function getSongs(folder) {
    let a = await fetch(`http://127.0.0.1:${window.location.port}/${folder}/`)
    currFolder = folder
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    songs= []
    for(let i = 0; i < as.length; i++){
        let element = as[i]
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for(let song of songs){
        songUL.innerHTML += `<li><img src="./img/music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${extractSong(song)}</div>
                                <div>Arindam Sharma</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="./img/play.svg" alt="">
                            </div></li>`
    }
    // Attatch Event Lisenter to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",()=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.replaceAll(" ","%20"))
        })
    })
    return songs
}
// getSongs()

// http://127.0.0.1:55146/song2/410(PagalWorld.com.sb)%20-%20Copy.mp3

function extractSong(url){
    let s1 = url.replace(`http://127.0.0.1:${window.location.port}/${currFolder}`,"")
    let s2 = s1.replace("(PagalWorld.com.sb)%20-%20Copy.mp3","")
    let s3 = s2.replace("(PagalWorld.com.sb).mp3","")
    let s4 = s3.replaceAll("%20"," ")
    return s4
}   


const playMusic = (track,pause = false)=>{
    // console.log(track)
    currentSong.src = `http://127.0.0.1:${window.location.port}/${currFolder}/${track}(PagalWorld.com.sb).mp3`
    if(!pause){
        currentSong.play()
        play.src = "./img/pause.svg"
    }
    document.querySelector(".song-info").innerHTML = track.replaceAll("%20"," ")
    document.querySelector(".song-time").innerHTML = "00:00/00:00"
}

function convertSecondsToMinSec(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "00:00"
    }
    // Calculate minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
  
    // Ensure two digits for seconds by adding a leading zero if necessary
    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
  
    // Return the formatted string
    return `${minutes}:${remainingSeconds}`;
  }

async function displayAlbum() {
    let a = await fetch(`http://127.0.0.1:${window.location.port}/song2`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    
    let anchors  = Array.from(as)
        for(let i = 0;i < anchors.length; i++){
        if(anchors[i].href.includes("/song2/") && !anchors[i].href.includes(".htaccess")){
            let folder = anchors[i].href.split("/").slice(-1)[0]
            // Get the metadata of the folder
            a = await fetch(`http://127.0.0.1:${window.location.port}/song2/${folder}/info.json`)
            response = await a.json()
            // console.log(response)
            document.querySelector(".card-container").innerHTML += 
                        `<div data-folder=${folder} class="card">
                        <div class="circle">
                            <img src="./img/playbutton.svg" alt="">
                          </div>
                        <img src="/song2/${folder}/cover.jpg" id="album" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}!</p>
                    </div>`
        }
    }
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async (item)=>{
            songs = await getSongs(`song2/${item.currentTarget.dataset.folder}`)
            playMusic(extractSong(songs[0]))
        })
    })
}

async function main() {
    songs = await getSongs("song2/punjabi")
    // let mySong = new Audio(songs[2])
    playMusic(extractSong(songs[0]),true)

    // Display all the albums on the page
    displayAlbum()

    // Attatch Event Lisenter to Prev, Play, Next
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "./img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "./img/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(convertSecondsToMinSec(Math.floor(currentSong.currentTime)),convertSecondsToMinSec(Math.floor(currentSong.duration)))
        document.querySelector(".song-time").innerHTML = `${convertSecondsToMinSec(Math.floor(currentSong.currentTime))}/${convertSecondsToMinSec(Math.floor(currentSong.duration))}`
        document.querySelector(".control").style.left = `${(currentSong.currentTime/currentSong.duration)*100}%`
    })
    // Add Event Listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".control").style.left = `${percent}%`
        currentSong.currentTime =  ((currentSong.duration) * percent )/100;
    })
    
    // Add Event Listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0px"
    })
    // Add Event Listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })
    // Add Event Listener for previous and next
    previous.addEventListener("click",()=>{
        // console.log("Previous Clicked")
        let idx = songs.indexOf(currentSong.src.replace(`http://127.0.0.1:${window.location.port}/${currFolder}/`,""))
        if((idx-1)>=0){
            playMusic(extractSong(songs[idx-1]))
        }
    })
    next.addEventListener("click",()=>{
        // console.log("Next Clicked")
        // console.log(currentSong.src)
        // console.log(songs)
        let index = songs.indexOf(currentSong.src.replace(`http://127.0.0.1:${window.location.port}/${currFolder}/`,""))
        // console.log(index)
        // console.log(currentSong.src)
        if((index + 1) <= songs.length){
            playMusic(extractSong(songs[index+1]))
        }
    })

    // Add event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        // console.log(e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })

    // Add Event Listener to mute the track
    document.querySelector(".volume img").addEventListener("click",e=>{
        // if(e.target.src === 'volume.svg'){
        //     e.target.src = 'mute.svg'
        //     currentSong.volume = 0
        // }
        // else{
        //     e.target.src = 'volume.svg'
        //     currentSong.volume = 1
        // }
        // if(e.target.src.includes("volume.svg")){
        //     e.target.src.replace("volume","mute")
        //     currentSong.volume = 0;
        // }
        // else{
        //     e.target.src.replace("mute","volume")
        //     currentSong.volume = 0.3;
        // }
        if(e.target.src.includes("volume")){
            e.target.src = e.target.src.replace("volume","mute")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("mute","volume")
            currentSong.volume = 0.3;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 30
        }
    })
    
}


main()