onmessage = (e) => {
  let dataFromCallingThread = e.data;
  if (dataFromCallingThread.stopTimer) {
    clearInterval(dataFromCallingThread.intervalId);
    dataFromCallingThread.timerStarted = false;
    postMessage(dataFromCallingThread);
  } else {
    dataFromCallingThread.intervalId = setInterval(
      () => timer(dataFromCallingThread),
      1000
    );
  }
};

timer = function (dataFromCallingThread) {
  if (
    dataFromCallingThread.secondForTimeCalculation == 0 &&
    dataFromCallingThread.minuteForTimeCalculation !== 0
  ) {
    dataFromCallingThread.secondForTimeCalculation = 60;
    dataFromCallingThread.minuteForTimeCalculation--;
  }
  if (
    dataFromCallingThread.secondForTimeCalculation == 60 ||
    dataFromCallingThread.secondForTimeCalculation > 0
  ) {
    dataFromCallingThread.secondForTimeCalculation--;
  }
  if (
    dataFromCallingThread.minuteForTimeCalculation == 0 &&
    dataFromCallingThread.secondForTimeCalculation == 0
  ) {
    if (dataFromCallingThread.typeOfBtnClicked === "Pomodoro") {
      dataFromCallingThread.typeOfBtnClicked = "Short Break";
    } else {
      dataFromCallingThread.typeOfBtnClicked = "Pomodoro";
    }
    dataFromCallingThread.resetTimer = true;
  }
  dataFromCallingThread.minuteHTMLValue = returnData(
    dataFromCallingThread.minuteForTimeCalculation
  );
  dataFromCallingThread.secondHTMLValue = returnData(
    dataFromCallingThread.secondForTimeCalculation
  );
  postMessage(dataFromCallingThread);
};

returnData = function (input) {
  return input >= 10 && input !== 60
    ? `${input}`
    : input === 60
    ? "00"
    : `0${input}`;
};
