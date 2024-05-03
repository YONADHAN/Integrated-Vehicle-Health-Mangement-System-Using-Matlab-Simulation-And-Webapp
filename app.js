const fs = require('fs');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

function getSubCategory(signalNumber) {
  if (signalNumber >= 1 && signalNumber <= 5) {
    return 'pressure';
  } else if (signalNumber >= 6 && signalNumber <= 10) {
    return 'temperature';
  } else if (signalNumber >= 11 && signalNumber <= 15){
    return 'velocity';
  } else if (signalNumber >= 16 && signalNumber <= 20){
    return 'humidity';
  } else if (signalNumber >= 21 && signalNumber <= 25){
    return 'vibration';
  } else {
    return 'no signal is there in this name';
  }
}

// Create empty objects to hold data for different subcategories
const dataBySubcategory = {
  pressure: [],
  temperature: [],
  velocity: [],
  humidity: [],
  vibration: []
};

// Function to write data to JSON file
function writeJSONFile() {
  fs.writeFile('realtime_data.json', JSON.stringify(dataBySubcategory, null, 2), (err) => {
    if (err) {
      console.error('Error writing to JSON file:', err);
    } else {
      console.log('Data written to realtime_data.json');
    }
  });
}

server.on('message', (msg, rinfo) => {
    // Convert the received message to a string
    const message = msg.toString();

    // Split the message into an array of values
    const dataArray = message.split(' ');

    // Extract the values
    const time = parseInt(dataArray[0]);
    const signalNumber = parseInt(dataArray[1]);
    const data = parseInt(dataArray[2]);
    const lowerThreshold = parseInt(dataArray[3]);
    const correctData = parseInt(dataArray[4]);
    const upperThreshold = parseInt(dataArray[5]);

    // Determine the subcategory based on signal number
    const subCategory = getSubCategory(signalNumber);

    // Create an object with the extracted values
    const dataObject = {
        signalNumber,
        time,
        data,
        lowerThreshold,
        upperThreshold,
        message: data < lowerThreshold ? 'Below lower threshold' : 'Exceeded upper threshold'
    };

    // Push the object into the appropriate data array based on subcategory
    if (subCategory !== 'no signal is there in this name') {
        dataBySubcategory[subCategory].push(dataObject);

        // Write data to JSON file after each message received
        writeJSONFile();
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.bind(54321, '127.0.0.1'); // Bind to the localhost on port 54321
