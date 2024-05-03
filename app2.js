// Define variables for JSON data, signal numbers, and clicked times
let jsonData;
let allSignals = [[1,2,3,4,5], [6,7,8,9,10], [11,12,13,14,15], [16,17,18,19,20], [21,22,23,24,25]];
let clickedTime = [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]];


// Function to create or update signal divs
function createOrUpdateSignalDivs(signalnum, time, signaltimes, signalParameter) {
    let reqData = jsonData[signalParameter].find(item => item.signalNumber === signalnum && item.time === time);
    if (!reqData) return; // If no data found, return

    let existingSignalDiv = document.querySelector(`.containerItem[data-signal="${signalnum}"][data-time="${time}"]`);

    if (!existingSignalDiv) {
        // If signal div doesn't exist, create a new one
        let containerItem = document.createElement("div");
        containerItem.classList.add("containerItem");
        containerItem.setAttribute("data-signal", signalnum);
        containerItem.setAttribute("data-time", time);

        let heading = document.createElement("h3");
        heading.textContent = `Signal Number: ${signalnum}`;

        let dataContainer = document.createElement("div");
        dataContainer.classList.add("data");

        let paragraphs = [
            `Time: ${time}s`,
            `Error: ${reqData.message}`,
            `Received Data: ${reqData.data}`,
            `Upper Threshold(Normal): ${reqData.upperThreshold}`,
            `Lower Threshold(Normal): ${reqData.lowerThreshold}`
        ];

        paragraphs.forEach(function (text) {
            let paragraph = document.createElement("p");
            paragraph.textContent = text;
            dataContainer.appendChild(paragraph);
        });

        let timeBox = document.createElement("div");
        timeBox.classList.add("TimeBox");

        signaltimes.forEach(function (time) {
            let timeElement = document.createElement("div");
            timeElement.classList.add("time");
            timeElement.textContent = `${time}s`;
            timeBox.appendChild(timeElement);
        });

        containerItem.appendChild(heading);
        containerItem.appendChild(dataContainer);
        dataContainer.appendChild(timeBox);

        let container = document.querySelector('.container');
        container.appendChild(containerItem);
    } else {
        // If signal div exists, update its content
        let dataContainer = existingSignalDiv.querySelector('.data');
        let paragraphs = [
            `Time: ${time}s`,
            `Error: ${reqData.message}`,
            `Received Data: ${reqData.data}`,
            `Upper Threshold(Normal): ${reqData.upperThreshold}`,
            `Lower Threshold(Normal): ${reqData.lowerThreshold}`
        ];

        // Clear existing content
        dataContainer.innerHTML = '';

        paragraphs.forEach(function (text) {
            let paragraph = document.createElement("p");
            paragraph.textContent = text;
            dataContainer.appendChild(paragraph);
        });
        let timeBox = document.createElement("div");
        timeBox.classList.add("TimeBox");

        signaltimes.forEach(function (time) {
            let timeElement = document.createElement("div");
            timeElement.classList.add("time");
            timeElement.textContent = `${time}s`;
            timeBox.appendChild(timeElement);
        });
        dataContainer.appendChild(timeBox);

    }
}


// Function to display data
function display(signalParameter, parameter, signalNumbers) {
    let clickedParameterArray, allSignalArray;

    switch (signalParameter) {
        case 'pressure':
            clickedParameterArray = clickedTime[0];
            allSignalArray = allSignals[0];
            break;
        case 'temperature':
            clickedParameterArray = clickedTime[1];
            allSignalArray = allSignals[1];
            break;
        case 'velocity':
            clickedParameterArray = clickedTime[2];
            allSignalArray = allSignals[2];
            break;
        case 'humidity':
            clickedParameterArray = clickedTime[3];
            allSignalArray = allSignals[3];
            break;
        case 'vibration':
            clickedParameterArray = clickedTime[4];
            allSignalArray = allSignals[4];
            break;
        default:
            console.log('You have not selected any parameters');
            return;
    }

    // Check if there are existing signal divs related to the currently selected parameter
    const container = document.querySelector('.container');
    const existingSignalDivs = container.querySelectorAll('.containerItem');
    let hasExistingSignalDivs = false;

    existingSignalDivs.forEach(div => {
        const signalNum = parseInt(div.getAttribute('data-signal'));
        if (allSignalArray.includes(signalNum)) {
            hasExistingSignalDivs = true;
            return;
        }
    });
    
    // Clear the container if there are existing signal divs related to the currently selected parameter
    if (hasExistingSignalDivs) {
        container.innerHTML = '';
    }

    // Initialize a map to store the time array for each signal
    const timeMap = new Map();

    // Iterate over each signal to update the time array
    parameter.forEach((times, index) => {
        const signalnum = signalNumbers[index];
        const position = allSignalArray.indexOf(signalnum);
        let time;

        if (clickedParameterArray[position] === 0) {
            time = times[0];
        } else {
            time = clickedParameterArray[position];
        }

        timeMap.set(signalnum, times);
        createSignalDivs(signalnum, time, times, signalParameter);
    });

    // Update the clickedTime array with the updated time array
    timeMap.forEach((times, signalnum) => {
        const position = allSignalArray.indexOf(signalnum);
        clickedParameterArray[position] = times[0];
    });
}



// Function to generate array
const generateArray = (signal, interval) => {
    const Data = jsonData[signal];
    const signalMap = new Map();
    
    for (let i = interval[0]; i <= interval[1]; i++) {
        const tempData = Data.filter(item => item.signalNumber === i);
        if (tempData.length > 0) {
            const times = tempData.map(item => item.time);
            signalMap.set(i, times);
        }
    }

    const timeArray = Array.from(signalMap.values());
    const signalArray = Array.from(signalMap.keys());
    console.log(timeArray, signalArray);
    
    timeArray.forEach((times, index) => {
        createOrUpdateSignalDivs(signalArray[index], times[0], times, signal);
    });
};


// Function to handle button clicks
function handleButtonClicks() {
    const buttonClicked = document.querySelectorAll('.menuItem');
    let intervalId;

    buttonClicked.forEach((btn, index) => {
        btn.addEventListener('click', function () {
            console.log("worked");
            if (intervalId) clearInterval(intervalId);

            // Clear the container
            const container = document.querySelector('.container');
            container.innerHTML = '';

            switch (index) {
                case 0:
                    intervalId = setInterval(() => generateArray('pressure', [1, 5]), 500);
                    break;
                case 1:
                    intervalId = setInterval(() => generateArray('temperature', [6, 10]), 500);
                    break;
                case 2:
                    intervalId = setInterval(() => generateArray('velocity', [11, 15]), 500);
                    break;
                case 3:
                    intervalId = setInterval(() => generateArray('humidity', [16, 20]), 500);
                    break;
                case 4:
                    intervalId = setInterval(() => generateArray('vibration', [21, 25]), 500);
                    break;
                default:
                    console.log('error in index');
                    break;
            }
        });
    });
}


// Fetch the JSON data
fetch('./realtime_data.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;
        handleButtonClicks();
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

