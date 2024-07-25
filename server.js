import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import session from 'express-session';

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://capital-quiz-react.netlify.app/"
    ] ,
    methods: "GET",
  })
);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// save API endpoint to variable (getting the URL from .env)
const COUNTRIES_URL = process.env.COUNTRIES_URL
// save list of countries
let country_list;

// fetching all countries
const fetchCountriesData = async () => {
  try {
    const response = await axios.get(COUNTRIES_URL);
    country_list = response.data.data.filter(country => country.capital !== "");
    return country_list;
  } catch (error) {
    console.error("Error fetching country", error);
  }
};

// Get random country data from country_list
const fetchRandomCountryData = () => {
  const randCountryID = Math.floor(Math.random() * (country_list.length - 1));
  return country_list[randCountryID];
};

// Get 2 random capitals from country_list excluding the random country selected
const fetchTwoFalseCapitals = (randCountry) => {
  const filteredCapitals = country_list.filter(
    (country) => country.name !== randCountry.name
  );
  const mappedCapitals = filteredCapitals.map((country) => country.capital);
  // save only 2 capitals in an array
  let twoCapitals = [];
  for (let i = 0; i < 2; i++) {
    let capitalID = Math.floor(Math.random() * mappedCapitals.length);
    twoCapitals.push(mappedCapitals[capitalID]);
  }
  return twoCapitals;
};

app.get("/", (req, res) => {
  res.send("Hello Backend World!");
});

app.get("/quiz", async (req, res) => {
  try {
    if (!country_list) {
      await fetchCountriesData();
    }
      const randomCountry = fetchRandomCountryData(); 
      const twoCapitals = fetchTwoFalseCapitals(randomCountry);
      res.json({
        randomCountry: randomCountry.name,
        countryCapital: randomCountry.capital,
        falseCapitals: twoCapitals,
      });
  } catch (error) {
    res.status(500).json({ error: "Error while fetching data" });
  }
});


// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { maxAge: 60 * 60 * 1000 } //1 hr
// }));

// app.get("/quiz", async (req, res) => {
//   try {
//     if (!country_list) {
//       await fetchCountriesData();
//     }
//       const randomCountry = fetchRandomCountryData(); 
//       const twoCapitals = fetchTwoFalseCapitals(randomCountry);

//       // here i store the correct answer in a session instead of a db
//       const allCapitals = [randomCountry.capital, ...twoCapitals]
//       const shuffledCapitals = shuffleCapitalsArr(allCapitals)
//       req.session.correctAnswer = randomCountry.capital;

//       res.json({
//         randomCountry : randomCountry.name,
//         options: shuffledCapitals
//       })

//   } catch (error) {
//     res.status(500).json({ error: "Error while fetching data" });
//   }
// });

// app.post("/checkResponse", (req, res) => {
//   const { answer } = req.body
//   const correctAnswer = req.session.correctAnswer
//   const isCorrect = answer === correctAnswer

//   // clear the ans from session
//   req.session.correctAnswer = null

//   res.json({
//     isCorrect: isCorrect,
//   })
// })


// const shuffleCapitalsArr = (capital) => {
//   for (let i = capital.length - 1; i > 0; i--) {
//     const randNum = Math.floor(Math.random() * (i + 1));
//     [capital[i], capital[randNum]] = [capital[randNum], capital[i]];
//   }
//   return capital
// }