import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Supabase Connection Configuration (Using Environment Variables securely)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase environment variables in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== PRODUCTS ENDPOINTS ====================

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const game = req.body;
    const { data, error } = await supabase.from('products').insert([game]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product by title
app.put('/api/products/:title', async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title);
    const updatedGame = req.body;
    const { data, error } = await supabase
      .from('products')
      .update(updatedGame)
      .eq('title', title)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product by title
app.delete('/api/products/:title', async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title);
    const { error } = await supabase.from('products').delete().eq('title', title);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== IMAGE UPLOAD ENDPOINT ====================
app.post('/api/upload', async (req, res) => {
  try {
    const { title, base64Image } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const base64Data = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const fileExtension = base64Image.substring(base64Image.indexOf('/') + 1, base64Image.indexOf(';')) || 'png';
    const fileName = `${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from('covers')
      .upload(fileName, base64Data, {
        contentType: `image/${fileExtension}`,
        upsert: true
      });

    if (error) throw error;

    const { data: publicURLData } = supabase.storage
      .from('covers')
      .getPublicUrl(fileName);

    res.json({ url: publicURLData.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== COLLECTIONS ENDPOINTS ====================

// Get all collections
app.get('/api/collections', async (req, res) => {
  try {
    const { data, error } = await supabase.from('collections').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new collection
app.post('/api/collections', async (req, res) => {
  try {
    const { id, title, description, banner, customBannerUrl, keywords } = req.body;
    const { data, error } = await supabase.from('collections').insert([{
      id, 
      title, 
      description, 
      banner, 
      custom_banner_url: customBannerUrl, 
      keywords
    }]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing collection
app.put('/api/collections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, banner, customBannerUrl, keywords } = req.body;
    const { data, error } = await supabase.from('collections').update({
      title, 
      description, 
      banner, 
      custom_banner_url: customBannerUrl, 
      keywords
    }).eq('id', id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a collection
app.delete('/api/collections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ORDERS ENDPOINT ====================

app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, mobileNumber, totalAmount, items } = req.body;
    const uniqueOrderId = `ORD-${Date.now()}`;

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        { 
          order_id: uniqueOrderId,
          customer_name: customerName, 
          customer_phone: mobileNumber, 
          total_amount: totalAmount,
          status: 'pending'
        }
      ])
      .select();

    if (orderError) throw orderError;
    const createdOrder = orderData[0];

    if (items && items.length > 0) {
      const orderItemsRows = items.map(item => {
        const cleanPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
        return {
          id: crypto.randomUUID(),
          order_id: createdOrder.id,
          product_name: item.title,
          quantity: 1,
          price: cleanPrice
        };
      });

      const { error: itemsError } = await supabase
        .from('orderitem')
        .insert(orderItemsRows);

      if (itemsError) throw itemsError;
    }

    res.json({ success: true, orderId: uniqueOrderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});