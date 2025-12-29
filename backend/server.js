const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Database setup
const db = new Database(path.join(__dirname, 'orders.db'));

// Initialize database
function initializeDatabase() {
  // Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_number TEXT UNIQUE,
      address TEXT,
      phone TEXT,
      email TEXT,
      contact TEXT,
      receiver_name TEXT,
      receiver_address TEXT,
      receiver_phone TEXT
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_name TEXT NOT NULL,
      description TEXT,
      order_date TEXT,
      customer_id INTEGER,
      total_price REAL DEFAULT 0,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);

  // Order details table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product TEXT,
      product_name TEXT,
      package_weight REAL,
      package_count INTEGER,
      total_weight REAL,
      unit_price REAL,
      total_price REAL,
      remark TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  // Signatures table for electronic signatures
  db.exec(`
    CREATE TABLE IF NOT EXISTS signatures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      signature_data TEXT NOT NULL,
      signer_name TEXT,
      signer_role TEXT,
      signature_date TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
}

initializeDatabase();

// ===== Customer APIs =====
app.get('/api/customers', (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers').all();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', (req, res) => {
  try {
    const { customer_name, customer_number, address, phone, email, contact, receiver_name, receiver_address, receiver_phone } = req.body;
    const stmt = db.prepare(`
      INSERT INTO customers (customer_name, customer_number, address, phone, email, contact, receiver_name, receiver_address, receiver_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(customer_name, customer_number, address, phone, email, contact, receiver_name, receiver_address, receiver_phone);
    res.json({ id: result.lastInsertRowid, message: 'Customer created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Order APIs =====
app.get('/api/orders', (req, res) => {
  try {
    const { customer_id } = req.query;
    let orders;
    if (customer_id) {
      orders = db.prepare('SELECT * FROM orders WHERE customer_id = ?').all(customer_id);
    } else {
      orders = db.prepare('SELECT * FROM orders').all();
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:orderId', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.orderId);
    const details = db.prepare('SELECT * FROM order_details WHERE order_id = ?').all(req.params.orderId);
    const signatures = db.prepare('SELECT * FROM signatures WHERE order_id = ?').all(req.params.orderId);
    res.json({ ...order, details, signatures });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { order_name, description, order_date, customer_id, details } = req.body;
    
    // Calculate total price from details
    let total_price = 0;
    if (details && details.length > 0) {
      total_price = details.reduce((sum, item) => {
        const itemTotal = (item.package_weight || 0) * (item.package_count || 0) * (item.unit_price || 0);
        return sum + itemTotal;
      }, 0);
    }

    // Insert order
    const orderStmt = db.prepare(`
      INSERT INTO orders (order_name, description, order_date, customer_id, total_price)
      VALUES (?, ?, ?, ?, ?)
    `);
    const orderResult = orderStmt.run(order_name, description, order_date, customer_id, total_price);
    const orderId = orderResult.lastInsertRowid;

    // Insert order details
    if (details && details.length > 0) {
      const detailStmt = db.prepare(`
        INSERT INTO order_details (order_id, product, product_name, package_weight, package_count, total_weight, unit_price, total_price, remark)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const detail of details) {
        const total_weight = (detail.package_weight || 0) * (detail.package_count || 0);
        const detail_price = total_weight * (detail.unit_price || 0);
        detailStmt.run(
          orderId,
          detail.product,
          detail.product_name,
          detail.package_weight,
          detail.package_count,
          total_weight,
          detail.unit_price,
          detail_price,
          detail.remark
        );
      }
    }

    res.json({ id: orderId, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Order Details APIs =====
app.get('/api/order_details', (req, res) => {
  try {
    const { order_id } = req.query;
    let details;
    if (order_id) {
      details = db.prepare('SELECT * FROM order_details WHERE order_id = ?').all(order_id);
    } else {
      details = db.prepare('SELECT * FROM order_details').all();
    }
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/order_details/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM order_details WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Order detail deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Signature APIs =====
// Create a new signature
app.post('/api/signatures', (req, res) => {
  try {
    const { order_id, signature_data, signer_name, signer_role, ip_address } = req.body;
    
    if (!signature_data) {
      return res.status(400).json({ error: 'Signature data is required' });
    }

    const signature_date = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO signatures (order_id, signature_data, signer_name, signer_role, signature_date, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(order_id, signature_data, signer_name, signer_role, signature_date, ip_address);
    
    res.json({ 
      id: result.lastInsertRowid, 
      message: 'Signature created successfully',
      signature_date 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all signatures for an order
app.get('/api/signatures', (req, res) => {
  try {
    const { order_id } = req.query;
    let signatures;
    
    if (order_id) {
      signatures = db.prepare('SELECT * FROM signatures WHERE order_id = ?').all(order_id);
    } else {
      signatures = db.prepare('SELECT * FROM signatures').all();
    }
    
    res.json(signatures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific signature
app.get('/api/signatures/:id', (req, res) => {
  try {
    const signature = db.prepare('SELECT * FROM signatures WHERE id = ?').get(req.params.id);
    
    if (!signature) {
      return res.status(404).json({ error: 'Signature not found' });
    }
    
    res.json(signature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a signature
app.delete('/api/signatures/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM signatures WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Signature not found' });
    }
    
    res.json({ message: 'Signature deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate a standalone signature (without order association)
app.post('/api/signatures/generate', (req, res) => {
  try {
    const { signature_data, signer_name, signer_role, ip_address } = req.body;
    
    if (!signature_data) {
      return res.status(400).json({ error: 'Signature data is required' });
    }

    const signature_date = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO signatures (signature_data, signer_name, signer_role, signature_date, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(signature_data, signer_name, signer_role, signature_date, ip_address);
    
    res.json({ 
      id: result.lastInsertRowid, 
      message: 'Signature generated successfully',
      signature_date 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
