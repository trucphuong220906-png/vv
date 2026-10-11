import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import * as db from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = 3000;
  const host = '0.0.0.0';

  // Body parser
  app.use(express.json());

  // CORS and Headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Request logger for API calls
  app.use('/api', (req, _res, next) => {
    console.log(`[API ${req.method}] ${req.originalUrl}`);
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // REST API: Orders
  app.get('/api/orders', (_req, res) => {
    try {
      const orders = db.getAllOrders();
      res.json(orders);
    } catch (err: any) {
      console.error('Error getting orders:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch orders' });
    }
  });

  app.post('/api/orders', (req, res) => {
    try {
      const newOrder = db.createOrder(req.body);
      res.status(201).json(newOrder);
    } catch (err: any) {
      console.error('Error creating order:', err);
      res.status(400).json({ error: err.message || 'Failed to create order' });
    }
  });

  app.patch('/api/orders/:id', (req, res) => {
    try {
      const { status, orderStatus, paymentStatus } = req.body;
      const targetStatus = status || orderStatus;
      const updated = db.updateOrderStatus(req.params.id, targetStatus, paymentStatus);
      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(updated);
    } catch (err: any) {
      console.error('Error updating order:', err);
      res.status(400).json({ error: err.message || 'Failed to update order' });
    }
  });

  app.delete('/api/orders/:id', (req, res) => {
    try {
      const success = db.deleteOrder(req.params.id);
      res.json({ success });
    } catch (err: any) {
      console.error('Error deleting order:', err);
      res.status(500).json({ error: err.message || 'Failed to delete order' });
    }
  });

  // REST API: Dashboard Stats (calculated in real time from persistent orders)
  app.get('/api/dashboard/stats', (_req, res) => {
    try {
      const stats = db.getDashboardStats();
      res.json(stats);
    } catch (err: any) {
      console.error('Error getting dashboard stats:', err);
      res.status(500).json({ error: err.message || 'Failed to calculate dashboard stats' });
    }
  });

  // REST API: Inquiries
  app.get('/api/inquiries', (_req, res) => {
    try {
      const inquiries = db.getAllInquiries();
      res.json(inquiries);
    } catch (err: any) {
      console.error('Error getting inquiries:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch inquiries' });
    }
  });

  app.post('/api/inquiries', (req, res) => {
    try {
      const inquiry = db.createInquiry(req.body);
      res.status(201).json(inquiry);
    } catch (err: any) {
      console.error('Error creating inquiry:', err);
      res.status(400).json({ error: err.message || 'Failed to create inquiry' });
    }
  });

  app.patch('/api/inquiries/:id', (req, res) => {
    try {
      const { status, adminNote } = req.body;
      const updated = db.updateInquiryStatus(req.params.id, status, adminNote);
      if (!updated) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }
      res.json(updated);
    } catch (err: any) {
      console.error('Error updating inquiry:', err);
      res.status(400).json({ error: err.message || 'Failed to update inquiry' });
    }
  });

  app.delete('/api/inquiries/:id', (req, res) => {
    try {
      const success = db.deleteInquiry(req.params.id);
      res.json({ success });
    } catch (err: any) {
      console.error('Error deleting inquiry:', err);
      res.status(500).json({ error: err.message || 'Failed to delete inquiry' });
    }
  });

  // Admin clear actions
  app.post('/api/admin/clear-orders', (_req, res) => {
    try {
      db.clearAllOrders();
      res.json({ success: true, message: 'Đã xóa toàn bộ đơn hàng' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/clear-inquiries', (_req, res) => {
    try {
      db.clearAllInquiries();
      res.json({ success: true, message: 'Đã xóa toàn bộ thư liên hệ' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Client serving: Dev (Vite middleware) vs Prod (dist static files)
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');

  if (isProduction && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Mount Vite middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, host, () => {
    console.log(`[Vết Việt Full-Stack] Server running on http://${host}:${port} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
