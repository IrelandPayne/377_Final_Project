let compareChart;

const countryNames = {
  US: 'United States',
  CN: 'China',
  JP: 'Japan',
  DE: 'Germany',
  GB: 'United Kingdom',
  IN: 'India',
  FR: 'France',
  BR: 'Brazil',
  CA: 'Canada',
  AU: 'Australia',
};

const indicatorNames = {
  gdp: 'GDP',
  inflation: 'Inflation',
  unemployment: 'Unemployment Rate',
  life_expectancy: 'Life Expectancy',
};

const compareBtn = document.getElementById('compare-button');

if (compareBtn) {
  compareBtn.addEventListener('click', compareCountries);
}

const countryBtn = document.getElementById('country-button');

if (countryBtn) {
  countryBtn.addEventListener('click', viewCountry);
}

async function compareCountries() {
  const countryOne = document.getElementById('country-one').value;
  const countryTwo = document.getElementById('country-two').value;
  const indicator = document.getElementById('indicator').value;

  const response = await fetch(
    `/api/worldbank?countries=${countryOne};${countryTwo}&indicator=${indicator}`
  );

  const data = await response.json();

  if (!response.ok) {
    alert(data.message);
    return;
  }

  const countryOneData = data.filter((item) => {
    return item.country === countryNames[countryOne];
  });

  const countryTwoData = data.filter((item) => {
    return item.country === countryNames[countryTwo];
  });

  document.getElementById('chart-section').style.display = 'block';

  drawCompareChart(countryOneData, countryTwoData, countryOne, countryTwo, indicator);
  updateCompareSummary(countryOne, countryTwo, indicator);
  await createSavedSearch(countryOne, countryTwo, indicator, 'compare');
}

function drawCompareChart(countryOneData, countryTwoData, countryOne, countryTwo, indicator) {
  const years = countryOneData.map((item) => {
    return item.year;
  });

  const valuesOne = countryOneData.map((item) => {
    return item.value;
  });

  const valuesTwo = countryTwoData.map((item) => {
    return item.value;
  });

  const chartCanvas = document.getElementById('compare-chart');

  if (compareChart) {
    compareChart.destroy();
  }

  compareChart = new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: countryNames[countryOne],
          data: valuesOne,
          borderWidth: 3,
        },
        {
          label: countryNames[countryTwo],
          data: valuesTwo,
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: indicatorNames[indicator] + ' Comparison',
        },
      },
    },
  });
}

function updateCompareSummary(countryOne, countryTwo, indicator) {
  let summaryText =
    countryNames[countryOne] +
    ' and ' +
    countryNames[countryTwo] +
    ' are being compared using ' +
    indicatorNames[indicator] +
    '. The chart above shows how ' +
    indicatorNames[indicator] +
    ' changed over time for both countries.';

  if (indicator === 'inflation' && (countryOne === 'BR' || countryTwo === 'BR')) {
    summaryText +=
      '<br><br>' +
      '<strong>Note:</strong> Brazil had very high inflation in the 1980s and 1990s. This can make other countries look flatter because the chart has to scale to Brazil’s large values.' +
      '<br><br>' +
      '<a href="https://en.wikipedia.org/wiki/Hyperinflation_in_Brazil" target="_blank">Learn More About Hyperinflation in Brazil</a>';
  }

  document.getElementById('summary-text').innerHTML = summaryText;
}

async function viewCountry() {
  const country = document.getElementById('single-country').value;
  const indicator = document.getElementById('single-indicator').value;

  const response = await fetch(
    `/api/worldbank?countries=${country}&indicator=${indicator}`
  );

  const data = await response.json();

  if (!response.ok) {
    alert(data.message);
    return;
  }

  document.getElementById('country-results').style.display = 'block';

  document.getElementById('country-results-title').innerHTML =
    countryNames[country] + ' ' + indicatorNames[indicator] + ' Results';

  updateCountryStats(data);
  updateCountrySummary(country, indicator);
  await createSavedSearch(country, null, indicator, 'country');
}

function updateCountryStats(data) {
  const earliest = data[0];
  const latest = data[data.length - 1];

  let highest = data[0];
  let lowest = data[0];

  data.forEach((item) => {
    if (item.value > highest.value) {
      highest = item;
    }

    if (item.value < lowest.value) {
      lowest = item;
    }
  });

  const percentChange = ((latest.value - earliest.value) / earliest.value) * 100;

  let trend = 'No major change';

  if (latest.value > earliest.value) {
    trend = 'Increased';
  }

  if (latest.value < earliest.value) {
    trend = 'Decreased';
  }

  document.getElementById('earliest-value').innerHTML =
    earliest.year + ': ' + formatNumber(earliest.value);

  document.getElementById('latest-value').innerHTML =
    latest.year + ': ' + formatNumber(latest.value);

  document.getElementById('percent-change').innerHTML =
    percentChange.toFixed(2) + '%';

  document.getElementById('highest-value').innerHTML =
    highest.year + ': ' + formatNumber(highest.value);

  document.getElementById('lowest-value').innerHTML =
    lowest.year + ': ' + formatNumber(lowest.value);

  document.getElementById('trend-direction').innerHTML = trend;
}

function updateCountrySummary(country, indicator) {
  let summaryText =
    countryNames[country] +
    ' is being analyzed using ' +
    indicatorNames[indicator] +
    '. The dashboard shows the earliest value, latest value, percent change, highest year, lowest year, and overall trend direction.';

  if (indicator === 'inflation' && country === 'BR') {
    summaryText +=
      '<br><br>' +
      '<strong>Note:</strong> Brazil had very high inflation in the 1980s and 1990s, so inflation values may appear much larger than other countries or indicators.' +
      '<br><br>' +
      '<a href="https://en.wikipedia.org/wiki/Hyperinflation_in_Brazil" target="_blank">Learn More About Hyperinflation in Brazil</a>';
  }

  document.getElementById('country-summary-text').innerHTML = summaryText;
}

function formatNumber(number) {
  return Number(number).toLocaleString();
}

async function createSavedSearch(country, secondCountry, indicator, searchType) {
    try {
      await fetch('/api/saved-searches', {
        method: 'POST',
        body: JSON.stringify({
          country: country,
          second_country: secondCountry,
          indicator: indicator,
          search_type: searchType,
        }),
        headers: {
          'content-type': 'application/json',
        },
      });
    } catch (error) {
      console.log('Failed to save search:', error);
    }
  }