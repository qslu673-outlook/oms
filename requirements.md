# Order Management System - Requirements Specification

## Overview

This project is a **full-stack order management system** designed for small to mid-size trading/logistics businesses. It manages customers, their orders (with summary information), and detailed order items. The stack includes:

- **Frontend:** React + Ant Design (antd)
- **Backend:** Node.js (Express)
- **Database:** SQLite (using better-sqlite3)

## Features

### 1. Customer Management

- Add, view, and delete customers.
- Each customer record includes:
  - Customer Name (`customer_name`)
  - Customer Number (`customer_number`)
  - Address (`address`)
  - Phone (`phone`)
  - Email (`email`)
  - Contact Person (`contact`)
  - Receiver Name (`receiver_name`, 收货人)
  - Receiver Address (`receiver_address`, 收货地址)
  - Receiver Phone (`receiver_phone`, 收货人电话)

### 2. Order Management

- Each customer can have multiple orders (one-to-many relationship).
- Add, view, and delete orders for each customer.
- Each order includes:
  - Order Name (`order_name`)
  - Description (`description`)
  - Order Date (`order_date`)
  - Linked Customer (`customer_id`)
  - Total Price (`total_price`), auto-calculated from order details

### 3. Order Detail Management

- Each order can have multiple detail items (one-to-many relationship).
- Each order detail includes:
  - Product Code (`product`)
  - Product Name (`product_name`)
  - Package Weight (`package_weight`, 单个包装重量)
  - Package Count (`package_count`, 包装数量)
  - Total Weight (`total_weight`, 总重量, auto-calculated)
  - Unit Price (`unit_price`, 公斤单价)
  - Total Price (`total_price`, 总价, auto-calculated)
  - Remark (`remark`, 备注)

### 4. Data Operations

- All main entities support Create, Read, and Delete operations.
- Order editing and detail modification may be added in future versions.

### 5. Test Data

- The system auto-populates the database with sample customers, orders, and order details upon first launch for demonstration.

## Technical Stack

- **Frontend:** React (with create-react-app), Ant Design (antd), dayjs for date formatting.
- **Backend:** Node.js with Express.js, better-sqlite3 for a file-based SQLite database.
- **API:** RESTful endpoints for all CRUD operations.
- **Data Storage:** SQLite file (`orders.db`).

## Database Schema

### Customers Table

| Field             | Type    | Description           |
|-------------------|---------|-----------------------|
| id                | INTEGER | Primary Key           |
| customer_name     | TEXT    | Name                  |
| customer_number   | TEXT    | Unique number         |
| address           | TEXT    | Address               |
| phone             | TEXT    | Phone number          |
| email             | TEXT    | Email                 |
| contact           | TEXT    | Contact person        |
| receiver_name     | TEXT    | 收货人                |
| receiver_address  | TEXT    | 收货地址              |
| receiver_phone    | TEXT    | 收货人电话            |

### Orders Table

| Field         | Type    | Description         |
|---------------|---------|---------------------|
| id            | INTEGER | Primary Key         |
| order_name    | TEXT    | Order name          |
| description   | TEXT    | Description         |
| order_date    | TEXT    | Date (YYYY-MM-DD)   |
| customer_id   | INTEGER | Foreign Key         |
| total_price   | REAL    | Total order price   |

### Order Details Table

| Field           | Type    | Description                 |
|-----------------|---------|-----------------------------|
| id              | INTEGER | Primary Key                 |
| order_id        | INTEGER | Foreign Key to Orders       |
| product         | TEXT    | Product code                |
| product_name    | TEXT    | Product name                |
| package_weight  | REAL    | 单个包装重量 (kg)           |
| package_count   | INTEGER | 包装数量                    |
| total_weight    | REAL    | 总重量 (auto-calculated)    |
| unit_price      | REAL    | 公斤单价                    |
| total_price     | REAL    | 总价 (auto-calculated)      |
| remark          | TEXT    | 备注                        |

## API Endpoints

### Customers
- `GET /api/customers` — List all customers
- `POST /api/customers` — Add a customer
- `DELETE /api/customers/:id` — Delete a customer (cascades to their orders/details)

### Orders
- `GET /api/orders?customer_id=...` — List all orders (optionally by customer)
- `POST /api/orders` — Add an order (with details array)
- `GET /api/orders/:orderId` — Get order and its details
- `DELETE /api/orders/:id` — Delete order and its details

### Order Details
- `GET /api/order_details?order_id=...` — List details for an order
- `DELETE /api/order_details/:id` — Delete an order detail

## User Interface

- **Customers Table:** View and select customers. Add/delete customers.
- **Order Table:** For selected customer, show all their orders. Add/delete orders.
- **Order Details Table:** For selected order, show all order items (details).
- **Modals/Forms:** For customer and order creation, with dynamic detail inputs.
- **Order Details Modal:** View all details for a selected order.

## Setup & Deployment

- **Backend:** Node.js app in `/backend` folder. Run `npm install` and `node server.js`.
- **Frontend:** React app in `/frontend` folder. Run `npm install` and `npm start`.
- **Database:** Automatically created and seeded on backend startup.

## Future Enhancements

- Order and detail editing
- Search/filtering
- Authentication
- Export/import (CSV, Excel)
- Internationalization (i18n)

---
