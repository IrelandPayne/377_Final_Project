# Global Economic Trends Dashboard

## Project Description
Global Economic Trends Dashboard is a web application that turns complex global economic data into interactive, readable comparisons. Users can compare countries or analyze a single country using indicators like GDP, inflation, unemployment rate, and life expectancy.

## Target Browsers
- Google Chrome (latest desktop)
- Mozilla Firefox (latest desktop)
- Microsoft Edge (latest desktop)
- Safari (recent macOS)

## Developer Manual
- [Developer Manual](./docs/developer-manual.md)

---

## Developer Manual

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create `.env` in root:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
```

### Run Server
```bash
npm start
```
or
```bash
node index.js
```

### Run Tests
No automated test suite is currently implemented.

### API Endpoints
- `GET /api/worldbank`: Reads external World Bank data.
- `GET /api/saved-searches`: Reads saved searches from Supabase.
- `POST /api/saved-searches`: Writes saved searches to Supabase.

### Known Bugs
- No automated tests yet.
- Saved-search features depend on valid Supabase credentials.

### Roadmap
- Add automated tests.
- Add year-range filters.
- Add indicator-specific pages.
- Expand coverage to more countries/metrics.
