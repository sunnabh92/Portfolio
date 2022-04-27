var url = "https://veff2022-h5.herokuapp.com/api/v1/tunes";
let theSongs;
const recordTone = new Tone.Recorder();
const synth = new Tone.Synth().toDestination();
synth.connect(recordTone);
var now;
var keyNoteTune = [];

function fetchTunes() {
    //Perform a GET request to the url
    axios.get(url)
        .then(function (response) {
            //When successful, add the data to the song variable and to the dropdown menu
            theSongs = response.data;

            for (let i = 0; i < theSongs.length; i++){
                var opt = document.createElement("option");
                var paraText = document.createTextNode(theSongs[i].name);
                opt.appendChild(paraText);
                document.getElementById("tunesDrop").appendChild(opt);
            }
        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log(error);
        })
        .then(function (){
            // Always run the function
        });
} fetchTunes()

function addToSongList(theRecording){
    // Use POST request to add to the existing songlist
    var nameOfSong = document.getElementById("recordName").value;
    const newUrl = URL.createObjectURL(theRecording);

    axios.post(url,{name: nameOfSong, tune: keyNoteTune})
        // When successful, add the new song to the songlist
        .then(function (response) {
            theMadeSong = response.data;
            var opt = document.createElement("option");
            opt.download = "theRecording.webm";
            opt.href = newUrl;
            opt.active;

            if (theMadeSong.name == "Record Name"){
                theMadeSong.name = "Unnamed Tune";
            }

            var paraText = document.createTextNode(theMadeSong.name);
            opt.appendChild(paraText);
            document.getElementById("tunesDrop").appendChild(opt);
            theSongs.push(response.data);
        })

        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log(error);
        })
};

function playSong(){
    // when the play button is pressed, the site plays the chosen song.
    var selectedSong = document.getElementById("tunesDrop");
    var songName = selectedSong.options[selectedSong.selectedIndex].value;
    var num = 0;

    for (let i = 0; i < theSongs.length; i++){
        if (songName == theSongs[num].name){
            var playingSong = theSongs[num].tune;

            playingSong.forEach(theTune => {
                now = Tone.now();
                synth.triggerAttackRelease(theTune.note, theTune.duration, now + theTune.timing);
            });
            return;
        } else {
            num++;
        }
    }
};

function disableOrNot(){
    // Enable and disable the record and stop buttons, 
    // start the recording and stop it when hitten the right buttons.
    if (document.getElementById("recordbtn").disabled == false){
        document.getElementById("recordbtn").disabled = true;
        document.getElementById("stopbtn").disabled = false;
        keyNoteTune = [];
        recordTone.start();

    } else {
        document.getElementById("recordbtn").disabled = false;
        document.getElementById("stopbtn").disabled = true;
        setTimeout(async () => {
            const theRecording = await recordTone.stop();
            addToSongList(theRecording);
        });
    }
}

var keyNoteDict = {
    // Finnur Eiríksson came with this idea on piazza and I wanted to make my own version
    // a-C4 w-c#4 s-d4 e-d#4 d-e4 f-f4 t-f#4 g-g4 
    // y-g#4 h-a4 u-bb4 j-b4 k-c5 o-c#5 l-d5 p-d#5 (æ/;)-e5
	a: "c4", w: "c#4", s: "d4", e: "d#4", d: "e4", f: "f4", t: "f#4", g: "g4",
    y: "g#4", h: "a4", u: "bb4", j: "b4", k: "c5", o: "c#5", l: "d5", p: "d#5",
    æ: "e5", ";": "e5"
};

document.addEventListener("keydown", function(event) {
    if (event.key in keyNoteDict)
        theNote = keyNotes(event.key);
    else
        return;
});

document.addEventListener("keyup", function(event) {
    if (event.key in keyNoteDict)
        removeclass(event.key);
    else
        return;
});

function keyNotes(key){
    // Takes in the key for the pressed key and plays the corresponding note. Then add the note to
    // the keyNoteTune.
    var now = Tone.now();
    var newKey = keyNoteDict[key];
    var theNote = {"note":"","duration":"8n","timing":0};

    synth.triggerAttackRelease(newKey, "8n", now);

    theNote.note = newKey;
    theNote.timing = now;
    keyNoteTune.push(theNote);

    var pressedkeys = document.getElementById(newKey);
    pressedkeys.classList.add("presskey");
};

function removeclass(key){
    // Removes the presskey class which makes the key it's original color
    var newKey = keyNoteDict[key];

    var pressedkeys = document.getElementById(newKey);
    pressedkeys.classList.remove("presskey");
}

function clickNotes(id){
    // Finds the id of the note clicked by they mouse and plays the corresponding note.
    now = Tone.now();

    synth.triggerAttackRelease(id, "8n", now);
};