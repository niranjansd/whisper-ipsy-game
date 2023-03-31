<?php
?>
<!DOCTYPE html>
<html>
  <head>
    <title>I Spy Game</title>
	<link rel="stylesheet" href="css/style.css?v1.1">
  </head>
  <body>
    <button id="recordButton">Record</button>
    <div id="toolbar">
      <button id="whatisthatbutton" class="game-button">
        <img src="objects/prod/question.jpg" alt="Button 1" width="50" height="50">
      </button>
      <!-- <button id="obj-button2" class="obj-button">
        <img src="objects/prod/penguin.png" alt="Button 2" width="50" height="50">
      </button>
      <button id="obj-button3" class="obj-button">
        <img src="objects/prod/star.png" alt="Button 3" width="50" height="50">
      </button> -->
    </div>

    <div id="gameboard">
      <!-- <div class="object" id="object1" onclick="checkObject('object1')"> </div> -->
      <!-- <div class="object" id="object1" onclick="checkObject('object1')"> </div> -->
      <!-- <div class="object" id="object1" onclick="checkObject('object1')"> </div>
      <div class="object hidden" id="object2" onclick="checkObject('object2')"> </div>
      <div class="object hidden" id="object3" onclick="checkObject('object3')"> </div> -->
    </div>
 
    <div id="loader">
      <div class="spinner"></div>
    </div>

  	<audio id="question-audio" src="audio/dummy.wav"></audio>
    <audio id="success-audio" src="audio/dummy.wav"></audio>
    <audio id="failure-audio" src="audio/dummy.wav"></audio>
    <audio id="correct-audio" src="audio/dummy.wav"></audio>

    <!-- <script src="js/layer.min.js" type="application/javascript"></script> -->
    <script src="js/jquery.min.js"></script>
    <script src="js/jquery.cookie.min.js"></script>
    <script src="js/layer.min.js" type="application/javascript"></script>
    <script src="js/whatisthat.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
