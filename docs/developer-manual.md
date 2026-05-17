# Developer Manual

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Open the Project Folder

```bash
cd <project-folder>
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

---

# Running the Application

Start the Node.js server:

```bash
npm start
```

The application runs locally at:

```text
http://localhost:3000
```

---

# Running Tests

There is currently no automated testing implemented.

Testing is manual:

- Open all application pages:
  - Home
  - Compare
  - Country
  - About
  - Help
- Test compare-country functionality
- Test single-country search functionality
- Test API endpoints directly
- Confirm Supabase read/write functionality works correctly

---

# Server API Endpoints

## `GET /api/worldbank`

Retrieves World Bank indicator data for one or two countries.

### Query Parameters

| Parameter | Description | Example |
|---|---|---|
| `countries` | One or two country codes separated by `;` | `US` or `US;CN` |
| `indicator` | Indicator type | `gdp`, `inflation`, `unemployment`, `life_expectancy` |

### Example

```http
GET /api/worldbank?countries=US;CN&indicator=gdp
```

---

## `GET /api/saved-searches`

Retrieves saved searches from the Supabase `saved_searches` table.

Results are returned in newest-first order.

---

## `POST /api/saved-searches`

Stores a new saved search in Supabase.

### Expected JSON Body

```json
{
  "country": "US",
  "second_country": "CN",
  "indicator": "gdp",
  "search_type": "compare"
}
```

---

## `GET /api/definitions`

Retrieves indicator definition text from the World Bank API through the backend server.

### Query Parameters

| Parameter | Description |
|---|---|
| `indicator` | Indicator type (`gdp`, `inflation`, `unemployment`, `life_expectancy`) |

### Example

```http
GET /api/definitions?indicator=gdp
```

---

# Known Bugs and Limitations

- No automated testing has been implemented.
- Saved-search API endpoints fail if Supabase environment variables are missing.
- AOS animations may be inconsistent after deployment due to browser caching.
  - Performing a hard refresh usually resolves this issue.

---

# Roadmap for Future Development

Planned improvements for future developers include:

- Add automated frontend and backend testing
- Add year-range filtering for charts
- Expand supported countries and indicators
- Improve frontend loading and error states (AOS)
- Add more chart and analytics options
- Improve accessibility and responsive design support (eg. Audio features)