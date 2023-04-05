// const gameboard = document.getElementById('gameboard');
// const toolbar = document.getElementById('toolbar');
// const loader = document.getElementById('loader');
const whatisthatbutton = document.getElementById('whatisthatbutton');
const questionAudio = document.getElementById('question-audio');
const successAudio = document.getElementById('success-audio');
const failureAudio = document.getElementById('failure-audio');
const correctAudio = document.getElementById('correct-audio');
// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}
  
// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
  

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
    // questionAudio.play();
    console.log('whatisthatbutton clicked');
    const randomIndex = Math.floor(Math.random() * buttonData.length);
    const randomButtonData = buttonData[randomIndex];
    const correctAnswer = randomButtonData.answer;
    // display the image in the gameboard
    gameboard.innerHTML = `<div id="gameimg"><div id="detected" contenteditable="true" hidden></div><img src="${randomButtonData.imgSrc}" width="100" height="100" alt="${randomButtonData.answer}"></div>`;

    function startRecording() {
        console.log('recording started');
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            recorder = new MediaRecorder(stream);
            recorder.start();
            setTimeout(stopRecording, 10000, recorder);
        });
    };
    function stopRecording(recorder) {
        console.log('recording stopped');
        recorder.stop();
        processRecording(recorder);
    };
    const processRecording = (recorder) => {
        var datetime = new Date().today() + "_" + new Date().timeNow();
        var datetime = datetime.replace(/:/g, "-").replace("/", "-").replace("/", "-");
        var filename = 'recording_'+datetime+'.wav'
        if (recorder != null) {
            recorder.addEventListener('dataavailable', (event) => {
                console.log('processRecording');
                const audioFile = new Blob([event.data], { type: 'audio/mp4' });
                const url = URL.createObjectURL(audioFile);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                console.log('recording saved');
                loader.style.display = 'block';
                setTimeout(send_answer, 1000,
                           "C:\\Users\\niran\\Downloads\\"+filename);
                // send_answer("C:\\Users\\niran\\Downloads\\"+filename);
                loader.style.display = 'none';
                console.log('ans', $("#detected").html(),
                            'correct', correctAnswer);
                // // delete the file
                // delete_file("C:\\Users\\niran\\Downloads\\"+filename);
            });
        };
        recorder = null;
        return recorder;
    };
    startRecording();
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
};

function delete_file(filename) {
    console.log("Deleting file: " + filename);
    $.ajax({
        url: 'delete.php',
        type: 'POST',
        data: {filename: filename},
        success: function(response) {
            console.log(response);
        }
    });
};