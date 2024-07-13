import "dotenv/config"
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

const app = express()

app.use(bodyParser.json())

app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET",
    })
  );

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

// save API endpoint to variable 
const COUNTRIES_URL = "https://countriesnow.space/api/v0.1/countries/capital";
// save list of countries
let country_list;

// fetching all countries
const fetchCountriesData = async() => {
    try {
        const response = await axios.get(COUNTRIES_URL)
        country_list = response.data.data
        return country_list
    } catch (error) {
        console.error('Error fetching country', error)
    }
}

// get random country data from country_list
