const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

const indicators = {
  gdp: 'NY.GDP.MKTP.CD',
  inflation: 'FP.CPI.TOTL.ZG',
  unemployment: 'SL.UEM.TOTL.ZS',
  life_expectancy: 'SP.DYN.LE00.IN',
};

app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

app.get('/api/worldbank', async (req, res) => {
  console.log('Attempting to get World Bank data!');

  const countries = req.query.countries;
  const indicator = req.query.indicator;
  const indicatorCode = indicators[indicator];

  if (!countries || !indicatorCode) {
    res.statusCode = 400;
    res.json({
      message: 'Missing country or invalid indicator',
    });
    return;
  }

  const url =
    `https://api.worldbank.org/v2/country/${countries}/indicator/${indicatorCode}` +
    `?format=json&per_page=1000`;

  const response = await fetch(url);
  const apiData = await response.json();

  const cleanedData = apiData[1]
    .filter((item) => item.value !== null)
    .map((item) => ({
      country: item.country.value,
      year: item.date,
      value: item.value,
    }))
    .sort((a, b) => Number(a.year) - Number(b.year));

  res.json(cleanedData);
});

app.get('/api/saved-searches', async (req, res) => {
  console.log('Attempting to get saved searches!');

  const { data, error } = await supabase
    .from('saved_searches')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    console.log('Received Data:', data.length);
    res.json(data);
  }
});

app.post('/api/saved-searches', async (req, res) => {
  console.log('Adding saved search');
  console.log(`Request: ${JSON.stringify(req.body)}`);

  const country = req.body.country;
  const secondCountry = req.body.second_country;
  const indicator = req.body.indicator;
  const searchType = req.body.search_type;

  if (!country || !indicator || !searchType) {
    res.statusCode = 400;
    res.json({
      message: 'country, indicator, and search_type are required',
    });
    return;
  }

  const { data, error } = await supabase
    .from('saved_searches')
    .insert({
      country: country,
      second_country: secondCountry,
      indicator: indicator,
      search_type: searchType,
    })
    .select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});
app.get('/api/definitions', async (req, res) => {
  const indicatorMap = {
    gdp: 'NY.GDP.MKTP.CD',
    inflation: 'FP.CPI.TOTL.ZG',
    unemployment: 'SL.UEM.TOTL.ZS',
    life_expectancy: 'SP.DYN.LE00.IN',
  };

  const key = req.query.indicator;
  const code = indicatorMap[key];

  if (!code) {
    res.status(400).json({ message: 'Invalid indicator' });
    return;
  }

  try {
    const response = await fetch(
      `https://api.worldbank.org/v2/indicator/${code}?format=json`
    );
    const apiData = await response.json();
    const item = apiData?.[1]?.[0];

    res.json({
      indicator: key,
      source: item?.sourceNote || 'No definition available.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load definition.' });
  }
});