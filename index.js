const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = 8000;

const credentials = {
  apiKey: "4e8b12db2ace9b867fee1d60c2529135c215c6e97d09e417704702d4e431b425",
  username: "dynos",
};

const AfricasTalking = require("africastalking")(credentials);
const sms = AfricasTalking.SMS;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function sendsms(phoneNumber, selectedTimeValue, selectedDayValue, randomNumber) {
  const message = `Your train Booking was successful. Trip on: ${selectedTimeValue}  YOUR TICKET NUMBER IS: ${randomNumber}`;

  // Send the SMS
  const options = {
    to: phoneNumber,
    message: message,
  };

  sms
    .send(options)
    .then((response) => {
      console.log("SMS sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending SMS:", error);
    });
}

app.post("/ussd", (req, res) => {
  const { phoneNumber, text } = req.body;

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let response;
  if (text === "") {
    response = `CON WELCOME TO DYNASTY  TRAVEL BOOKINGS... Select transport mode 
      1. Train
      2. Flight
      3. Bus
      4. Request call`;
  } else if (text === "1" || text === "2" || text === "3") {
    response = `CON Select your destination
      1. Nairobi
      2. Mombasa
      3. Kisumu`;
  } else if (text === "1*1") {
    response = `CON Select your start point
      1. Mombasa
      2. Kisumu`;
  } else if (text === "2*2") {
      response = `CON Select your start point
        1. Nairobi
        2. Kisumu`;
  } else if (text === "3*3") {
        response = `CON Select your start point
          1. Mombasa
          2. Nairobi`;
  } else if (text === "1*1*1" || text === "1*1*2" || text === "1*1*2") {
    response = `CON Select the time of your travel
      1. Morning
      2. Evening`;
  } else if (
    text === "1*1*1*1" ||
    text === "1*1*1*2" ||
    text === "1*1*2*1" ||
    text === "1*1*2*2"
  ) {
    const selectedTime = text.split("*")[3];
    const selectedDay = text.split("*")[4];
    
  
    const timeOptions = {
      "1": "Monday Morning 8am",
      "2": "Monday Evening 6pm",
    };
      const dayOptions = {
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thursday",
        "5": "Friday",
        "6": "Saturday",
      };
    
      const selectedTimeValue = timeOptions[selectedTime];
      const selectedDayValue = dayOptions[selectedDay];
    
      console.log(selectedTimeValue);
      console.log(selectedDayValue);
    
      const randomNumber = generateRandomNumber(1, 50);
      sendsms(phoneNumber, selectedTimeValue, selectedDayValue, randomNumber);
    
      response = `END You have successfully booked a ${selectedTimeValue} trip on ${selectedDayValue}. ***YOUR TICKET NUMBER IS ${randomNumber}. ***You will receive a confirmation message shortly.`;
    
  } else if (text === "4") {
    const credentialss = {
      apiKey:
        "4e8b12db2ace9b867fee1d60c2529135c215c6e97d09e417704702d4e431b425",
      username: "dynos",
    };

    const AfricasTalkings = require("africastalking")(credentialss);
    const voice = AfricasTalkings.VOICE;

    function makeCall(phoneNumber1) {
      const options = {
        callFrom: "+254730731121",
        callTo: [phoneNumber1],
      };

      console.log("Calling...");
      voice
        .call(options)
        .then(console.log)
        .catch(console.log);
    }

    makeCall(phoneNumber);

    response = `END You will receive a call shortly.`;
  } else {
    response = "END Invalid input. Please try again.";
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
