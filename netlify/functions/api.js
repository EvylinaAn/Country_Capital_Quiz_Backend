import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import serverless from "serverless-http";

const api = express();

api.use(bodyParser.json());

api.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET",
  })
);

const port = process.env.PORT || 4000;

api.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// save API endpoint to variable
const COUNTRIES_URL = "https://countriesnow.space/api/v0.1/countries/capital";
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
  console.log(country_list[randCountryID]);
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

api.get("/", (req, res) => {
  res.send("Hello Backend World!");
});

api.get("/quiz", async (req, res) => {
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

api.use("/api/", router);

export const handler = serverless(api);
