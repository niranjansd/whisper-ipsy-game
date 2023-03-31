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

whatisthatbutton.addEventListener('click', () => {
    console.log('whatisthatbutton clicked');
    for (let i = 0; i < 5; i++) {
        // display one random image at a time in the gameboard
        // pick a random element from the buttonData array
        const randomIndex = Math.floor(Math.random() * buttonData.length);
        const randomButtonData = buttonData[randomIndex];
        // display the image in the gameboard
        gameboard.innerHTML = `<div id="gameimg"><div id="detected" contenteditable="true"></div><img src="${randomButtonData.imgSrc}" width="100" height="100" alt="${randomButtonData.answer}"></div>`;
        // ask the question
        askQuestion(randomButtonData.answer);
    }

    // Ask the question" what is this?nd listen for the right answer.
    function askQuestion(correctAnswer) {
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
                });
            }
        };

        const stopRecording = () => {
            recorder.stop();
            isRecording = false;
        };
        
        const processRecording = (filename) => {
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
                send_answer("C:\\Users\\niran\\Downloads\\"+filename);
                loader.style.display = 'none';
                console.log('ans', $("#detected").html());
            });
            recorder = null;
        };

        // record for 10 seconds 6 times in a row and process each audio
        for (let i = 0; i < 6; i++) {
            var datetime = new Date().today() + "_" + new Date().timeNow();
            var datetime = datetime.replace(/:/g, "-").replace("/", "-").replace("/", "-");
            var filename = 'recording_'+datetime+'_'+i.toString()+'.m4a' 
            console.log(i, filename)
            startRecording();
            setTimeout(() => {
                stopRecording();
                processRecording(filename);
            }, 10000);
        };
    };
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
