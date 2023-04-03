// const gameboard = document.getElementById('gameboard');
// const toolbar = document.getElementById('toolbar');
// const loader = document.getElementById('loader');
const whatisthatbutton = document.getElementById('whatisthatbutton');
const questionAudio = document.getElementById('question-audio');
const successAudio = document.getElementById('success-audio');
const failureAudio = document.getElementById('failure-audio');
const correctAudio = document.getElementById('correct-audio');


const buttonData = [{imgSrc: 'objects/prod/heart.png',   
                     answer: 'heart'},
                    {imgSrc: 'objects/prod/penguin.png',
                     answer: 'penguin'}, 
                    {imgSrc: 'objects/prod/star.png',
                     answer: 'star'}
                     ];
let chunks = [];
let duration = 60; // in seconds
let chunkSize = 10; // in seconds
let chunkIndex = 0;

whatisthatbutton.addEventListener('click', () => {

    // Ask the question" what is this?nd listen for the right answer.
    // function askQuestion(correctAnswer) {
    let chunks = [];
    let recorder = null;
    let recognition = null;
    let isRecording = false;
    questionAudio.play();

    const startRecording = () => {
        console.log('startRecording');
        if (recorder === null) {
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                recorder = new MediaRecorder(stream);
                // console.log('recorder', recorder);
                recorder.start();
                isRecording = true;
                recorder.addEventListener('dataavailable', (event) => {
                    chunks.push(event.data);
                    console.log('chunks', chunks);
                    if (chunks.length * chunkSize >= duration) {
                        console.log('chunks', chunks.length);
                        recorder.stop();
                    }
                    else if (chunks.length * chunkSize >= (chunkIndex + 1) * chunkSize) {
                        console.log('chunksave', chunks.length);
                        var datetime = new Date().today() + "_" + new Date().timeNow();
                        var datetime = datetime.replace(/:/g, "-").replace("/", "-").replace("/", "-");
                        var filename = 'recording_'+datetime+'_'+i.toString()+'.m4a' 
                        saveChunk(filename);
                        chunkIndex++;
                    }
                });
                function saveChunk(filename) {
                    const blob = new Blob(chunks.slice((chunkIndex * chunkSize), ((chunkIndex + 1) * chunkSize)), { type: 'audio/wav; codecs=0' });
                    const url = URL.createObjectURL(blob);
                    // do something with the chunk, like send it to a speech recognition API
                    // const url = URL.createObjectURL(audioFile);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    console.log('recording saved');
                    loader.style.display = 'block';
                    send_answer("C:\\Users\\niran\\Downloads\\"+filename);
                    loader.style.display = 'none';
                    console.log('ans', $("#detected").html());
            }
                
                //   mediaRecorder.onstop = function() {
                //     saveChunk();
                //     // do something with all the chunks, like concatenate them into a single file
                //   };
                })
                .catch(function(err) {
                    console.log('Error: ' + err);
            });
        }

        // const stopRecording = () => {
        //     if (recorder != null) {
        //         console.log('endRecording');
        //         recorder.stop();
        //     }
        //     isRecording = false;
        //     return recorder;
        // };
        
        // const processRecording = (filename) => {
        //     if (recorder != null) {
        //         recorder.addEventListener('dataavailable', (event) => {
        //             console.log('processRecording');
        //             const audioFile = new Blob([event.data], { type: 'audio/mp4' });
        //             const url = URL.createObjectURL(audioFile);
        //             const a = document.createElement('a');
        //             a.href = url;
        //             a.download = filename;
        //             a.click();
        //             console.log('recording saved');
        //             loader.style.display = 'block';
        //             send_answer("C:\\Users\\niran\\Downloads\\"+filename);
        //             loader.style.display = 'none';
        //             console.log('ans', $("#detected").html());
        //         });
        //     };
        //     recorder = null;
        //     return recorder;
        // };

        // const playAudioChunks = (audioChunks) => {
        //     audioChunks.forEach((audioChunk) => {
        //       setTimeout(() => {
        //         const audioChunkPlayer = new Audio(audioChunk.url);
        //         audioChunkPlayer.play();
        //       }, audioChunk.index * 1000 * audioChunk.duration);
        //     });
        //     setTimeout(() => {
        //       stopRecording();
        //       recognition.stop();
        //     }, 60000);
        //   };
        
        // startRecording();

        // // record for 10 seconds 6 times in a row and process each audio
        // for (let i = 0; i < 6; i++) {
        //     var datetime = new Date().today() + "_" + new Date().timeNow();
        //     var datetime = datetime.replace(/:/g, "-").replace("/", "-").replace("/", "-");
        //     var filename = 'recording_'+datetime+'_'+i.toString()+'.m4a' 
        //     console.log(i, filename)
        //     recorder = startRecording();
        //     recorder = stopRecording();
        //     recorder = processRecording(filename);
        // };
    };
    console.log('whatisthatbutton clicked');
    for (let i = 0; i < 5; i++) {
        // display one random image at a time in the gameboard
        // pick a random element from the buttonData array
        const randomIndex = Math.floor(Math.random() * buttonData.length);
        const randomButtonData = buttonData[randomIndex];
        // display the image in the gameboard
        gameboard.innerHTML = `<div id="gameimg"><div id="detected" contenteditable="true"></div><img src="${randomButtonData.imgSrc}" width="100" height="100" alt="${randomButtonData.answer}"></div>`;
        // ask the question
        // askQuestion(randomButtonData.answer);
        startRecording();
    }
});

function send_answer(filename) {

    if (filename == "") {
        console.log("No file detected.");
        return;
    };
    console.log("Sending file: " + filename);
    req = $.ajax({
        cache: true,
        type: "POST",
        url: "message.php",
        data: JSON.stringify({
            file: filename,
            model: "whisper-1",
            response_format: "text",
        }),
        dataType: "json",
        success: function (results) {
            console.log(results);
            // Add results to the page in the transcript div.
            $("#detected").html(results.text);
        }
    });
    // return results.text;
}
