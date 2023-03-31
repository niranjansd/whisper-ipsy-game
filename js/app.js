const recordButton = document.getElementById('recordButton');
const gameboard = document.getElementById('gameboard');
const toolbar = document.getElementById('toolbar');
const loader = document.getElementById('loader');
// const questionAudio = document.getElementById('question-audio');
// const successAudio = document.getElementById('success-audio');
// const failureAudio = document.getElementById('failure-audio');
// const correctAudio = document.getElementById('correct-audio');

let recorder = null;

// For todays date;
Date.prototype.today = function () { 
  return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
   return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function myFunction() {
  // your code to run after the timeout
}

function checkExistsWithTimeout(path, timeout) {
  return new Promise((resolve, reject) => {
    const timeoutTimerId = setTimeout(handleTimeout, timeout)
    const interval = timeout / 6
    let intervalTimerId

    function handleTimeout() {
      clearTimeout(timerId)

      const error = new Error('path check timed out')
      error.name = 'PATH_CHECK_TIMED_OUT'
      reject(error)
    }

    function handleInterval() {
      fs.access(path, (err) => {
        if(err) {
          intervalTimerId = setTimeout(handleInterval, interval)
        } else {
          clearTimeout(timeoutTimerId)
          resolve(path)
        }
      })
    }

    intervalTimerId = setTimeout(handleInterval, interval)
  })
}

recordButton.addEventListener('click', () => {
  if (recorder === null) {
    console.log('recording started');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        recorder = new MediaRecorder(stream);
        recorder.start();
        recordButton.textContent = 'Stop Recording';
      });
  } else {
    recorder.stop();
    var datetime = new Date().today() + "_" + new Date().timeNow();
    var datetime = datetime.replace(/:/g, "-").replace("/", "-").replace("/", "-");
    var filename = 'recording_'+datetime+'.m4a' 
    recorder.addEventListener('dataavailable', (event) => {
        const audioFile = new Blob([event.data], { type: 'audio/mp4' });
        const url = URL.createObjectURL(audioFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        console.log('recording saved');
        loader.style.display = 'block';
        send_prompt("C:\\Users\\niran\\Downloads\\"+filename);
        loader.style.display = 'none';
      });
    recordButton.textContent = 'Record';
  }
});


function send_prompt(filename) {

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
            $("#transcript").html(results.text);
        }
    });
    // return results.text;
}

// const buttonData = [{imgSrc: 'objects/prod/heart.png',   
//                      answer: 'heart'},
//                     {imgSrc: 'objects/prod/penguin.png',
//                      answer: 'penguin'}, 
//                     {imgSrc: 'objects/prod/star.png',
//                      answer: 'star'}
//                      ];

for (let i = 0; i < buttonData.length; i++) {
  const button = document.createElement('button');
  button.innerHTML = `<img src="${buttonData[i].imgSrc}" width="50" height="50" alt="${buttonData[i].answer}">`;
  button.addEventListener('click', () => {
    gameboard.innerHTML = `<img src="${buttonData[i].imgSrc}" width="100" height="100" alt="${buttonData[i].answer}">`;
    askQuestion(buttonData[i].answer);
  });
  toolbar.appendChild(button);
}

// function askQuestion(correctAnswer) {
// 	questionAudio.play();
//   const recognition = new webkitSpeechRecognition();
//   recognition.onresult = (event) => {
//     const spokenText = event.results[0][0].transcript.toLowerCase();
//     if (spokenText === correctAnswer) {
//       successAudio.play();
//       showSuccessScreen();
//     } else {
//       wrongCount++;
//       if (wrongCount >= 3) {
//         showCorrectAnswer();
//       } else {
//         failureAudio.play();
//         askQuestion();
//       }
//     }
//   }
// }

function askQuestion(correctAnswer) {
  let chunks = [];
  let recorder = null;
  let recognition = null;
  let isRecording = false;
	questionAudio.play();

  const startRecording = () => {
    if (!recorder) {
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          if (chunks.length > 10) {
            stopRecording();
            processRecording();
          }
        }
      };
    }
    recorder.start();
    isRecording = true;
  };

  const stopRecording = () => {
    recorder.stop();
    isRecording = false;
  };

  const processRecording = () => {
    const blob = new Blob(chunks, { type: 'audio/wav' });
    const audioURL = URL.createObjectURL(blob);

    filename = 'recording_'+datetime+'.wav'
    const a = document.createElement('a');
    a.href = audioURL;
    a.download = filename;
    a.click();
    console.log('recording saved');
    loader.style.display = 'block';
    const spokenText = send_prompt("C:\\Users\\niran\\Downloads\\"+filename);
    loader.style.display = 'none';
    spokenText = spokenText.toLowerCase();
    console.log(spokenText);
    if (spokenText.includes(correctAnswer)) {
      successAudio.play();
      showSuccessScreen();
      isRecording = false;
    } else {
      isRecording = true;
    }
  };

  // const audio = new Audio(audioURL);
  // recognition = new webkitSpeechRecognition();
  // recognition.continuous = true;
  // recognition.interimResults = true;
  // recognition.onresult = (event) => {
  //   const spokenText = event.results[0][0].transcript.toLowerCase();
  //   if (spokenText.includes(correctAnswer)) {
  //     successAudio.play();
  //     showSuccessScreen();
  //   }
  // };
  isRecording = true;
  while (isRecording) {
    startRecording();
    setTimeout(() => {
      stopRecording();
      processRecording();
    }, 10000);
  }
};

function showImage(imageSrc) {
	gameboard.innerHTML = `<img src="${imageSrc}" alt="Object Image" width="100" height="100" class="gameobject">`;
}

// function askQuestion() {
// 	questionAudio.play();
// 	window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
// 	const recognition = new window.SpeechRecognition();
// 	recognition.lang = 'en-US';
// 	recognition.start();
// 	recognition.onresult = (event) => {
// 		const answer = event.results[0][0].transcript.toLowerCase();
// 		if (answer === correctAnswer) {
//       successAudio.play();
//       showSuccessScreen();
//     } else {
//       wrongCount++;
//       if (wrongCount >= 3) {
//         showCorrectAnswer();
//       } else {
//         failureAudio.play();
//         askQuestion();
//       }
//     }
//   }
// }

function showSuccessScreen() {
  board.innerHTML = '<h2>Correct!</h2><button onclick="resetGame()">Play Again</button>';
}
  
function showCorrectAnswer() {
  correctAudio.play();
  board.innerHTML = '<h2>The correct answer was "${correctAnswer}".</h2><button onclick="resetGame()">Play Again</button>';
}
  
function resetGame() {
  wrongCount = 0;
  board.innerHTML = '';
}
