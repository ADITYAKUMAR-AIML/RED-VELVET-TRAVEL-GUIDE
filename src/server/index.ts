import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Destinations routes
app.get('/api/destinations', async (req, res) => {
  const { search } = req.query;
  let query = supabase.from('destinations').select('*');
  
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }
  
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/destinations/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', req.params.id)
    .single();
  
  if (error) return res.status(404).json({ error: 'Destination not found' });
  res.json(data);
});

// Bookings routes
app.post('/api/bookings', async (req, res) => {
  const { user_id, destination_id, dates, travelers, total_price } = req.body;
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ user_id, destination_id, dates, travelers, total_price, status: 'pending' }])
    .select()
    .single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/bookings/user/:userId', async (req, res) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, destinations(*)')
    .eq('user_id', req.params.userId);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Inquiry routes
app.post('/api/inquiries', async (req, res) => {
  const { name, email, message, destination_id } = req.body;
  const { data, error } = await supabase
    .from('inquiries')
    .insert([{ name, email, message, destination_id }])
    .select()
    .single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
