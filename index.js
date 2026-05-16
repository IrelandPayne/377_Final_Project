const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

const app = express();
const port = 3000;

dotenv.config();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/saved_searches', async (req, res) => {
  const { data, error } = await supabase
    .from('saved_searches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/saved_searches', async (req, res) => {
  const { country, second_country, indicator, search_type } = req.body;

  if (!country || !indicator || !search_type) {
    return res
      .status(400)
      .json({ message: 'country, indicator, and search_type are required' });
  }

  const { data, error } = await supabase
    .from('saved_searches')
    .insert({
      country,
      second_country: second_country ?? null,
      indicator,
      search_type,
    })
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});