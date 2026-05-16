# Developer Manual

## 1) Local Setup
- Node.js 20+
- npm 10+
- Supabase project with `saved_searches` table

Create `.env` in project root:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
```

Install:
```bash
npm install
```

## 2) Run the Application
```bash
npm start
```
or
```bash
node index.js
```

## 3) Testing
No automated tests yet. Current testing is manual browser/API validation.

## 4) API
- `GET /api/worldbank`: Fetches cleaned World Bank indicator data for one or two countries.
- `GET /api/saved-searches`: Reads 10 most recent searches from Supabase.
- `POST /api/saved-searches`: Saves a search in Supabase.

## 5) Known Bugs
- No automated tests.
- Saved searches fail if Supabase credentials are invalid.

## 6) Roadmap
- Add automated tests.
- Add year range filtering.
- Add dedicated indicator pages.
- Add World Bank response caching.
