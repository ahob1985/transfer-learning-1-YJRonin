// Author: Ronin YJ

// Global UI Variables
let canvasDiv;
let canvas;
let textDiv;
let textP;
let buttonDiv;
let happyButton;
let sadButton;
let trainButton;

// Global ML Variables
let featureExtractor;
let classifier;
let video;
let happies;
let sads;
let isModelReady;
let isTrainingComplete;

function setup() {
  canvasDiv = createDiv();
  canvas = createCanvas(640, 480);
  canvas.parent(canvasDiv);
  textDiv = createDiv();
  textP = createP("Model loading, please wait...");
  textP.parent(textDiv);
  buildButtons();
  // initialize happies and sads to 0
  happies = 0;
  sads = 0;
  // initialize isModelReady and isTrainingComplete
  isModelReady = false;
  isTrainingComplete = false;
  // load the video
  video = createCapture(VIDEO, videoReady);
}

function draw() {
  if(isModelReady) {
    image(video, 0, 0);
  }
  if(isTrainingComplete) {
    classifier.classify(canvas, gotResults);
  }
}

function buildButtons() {
  buttonDiv = createDiv();
  happyButton = createButton("Happy");
  happyButton.parent(buttonDiv);
  happyButton.mousePressed(function() {
    happies++;
    textP.html("Happies:" + happies + " -Sads: " + sads);
    classifier.addImage(canvas, "Happy");
  });
  sadButton = createButton("Sad");
  sadButton.parent(buttonDiv);
  sadButton.mousePressed(function() {
    sads++
    textP.html("Happies: " + happies + " -Sads: " + sads);
    classifier.addImage(canvas, "Sad");
  });
  trainButton = createButton("Train");
  trainButton.parent(buttonDiv);
  trainButton.mousePressed(function() {
    buttonDiv.style("display", "none");
    textP.html("New model training, please wait...");
    classifier.train(whileTraining);
  });
  buttonDiv.stlye("Display", "none");
}

function videoReady() {
  video.style("display", "none");
  featureExtractor = ml5.featureExtractor("MobileNet", featureExtractorLoaded);
}

function featureExtractorLoaded() {
  classifier = featureExtractor.classification(canvas, modelReady);
}

function modelReady() {
  isModelReady = true;
  textP.html("Add training data, then click train!");
  buttonDiv.style("display", "block");
}

function whileTraining(loss) {
  if(loss) {
    console.log(loss);
  } else {
    isTrainingComplete = true;
  }
}

function gotResults(error, results) {
  if(error) {
    console.error(error);
  } else {
    let label = results[0].label;
    let confidence = round(results[0].condidence, 2);
    textP.html("Label: " + label + " - Confidence: " +confidence);
  }
}
