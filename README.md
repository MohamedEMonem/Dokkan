# 📘 **Prisma Schema Documentation**
---

# 🚀 **Getting Started**

## **1. Environment Variables**

Create a `.env` file:

```env
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=mydb

PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin

DATABASE_URL="postgres://root:root@localhost:5432/mydb"
```

---

## **2. Running the Infrastructure (Docker)**

Start PostgreSQL + pgAdmin + Redis + MinIO + Meilisearch:

```sh
docker compose up -d
```

### Services included

| Service         | Purpose                                                     |
| --------------- | ----------------------------------------------------------- |
| **Postgres**    | Main relational database for your Prisma schema             |
| **pgAdmin**     | GUI for exploring & debugging PostgreSQL                    |
| **Redis**       | Caching + Queueing engine                                   |
| **Meilisearch** | Lightning-fast search engine for products/stores            |
| **MinIO**       | S3-compatible object storage (product images, user uploads) |

---

## **3. Running Prisma**

### Install Prisma:

```sh
npm install prisma --save-dev
npm install @prisma/client
```

### Push schema to DB:

```sh
npx prisma migrate dev
```

### Browse data (Prisma Studio):

```sh
npx prisma studio
```

---

# 🧭 **Prisma Schema Overview**

This Prisma schema implements a full multi-store e-commerce platform:

* Multi-vendor stores
* Product catalog
* Categories
* Orders & Order Items
* Carts & Cart Items
* Users with roles
* Messaging system
* Payments
* Store employees
* Reviews
* Notifications
* Subscriptions & SaaS billing

---

# 🏷️ **Enums**

### **UserRole**

```prisma
enum UserRole {
  Customer
  StoreOwner
  Admin
}
```

### **OrderStatus**

```prisma
enum OrderStatus {
  Pending
  Shipped
  Delivered
  Cancelled
}
```

### **PaymentStatus**

```prisma
enum PaymentStatus {
  Pending
  Success
  Failed
}
```

### **ProductStatus**

```prisma
enum ProductStatus {
  Active
  Inactive
}
```

### **TransactionStatus**

```prisma
enum TransactionStatus {
  Success
  Failure
}
```

### **PayableType**

```prisma
enum PayableType {
  Order
  Subscription
}
```

### **StoreStatus**

```prisma
enum StoreStatus {
  Pending
  Active
  Suspended
}
```

---

# 🧱 **Database Models**

Each model below includes fields, relations, and purposes.

---

## 👤 **User**

Represents customers, store owners, and admins.

* Owns stores
* Places orders
* Writes reviews
* Has messages + notifications
* Can employ in stores

---

## 🏪 **Store**

Vendor-owned online store.

* One owner
* Has products
* Has orders
* Has employees
* Has subscription
* Customizable UI (theme settings)

---

## 💳 **Plan**

SaaS subscription plan.

* Price
* Feature list
* One-to-many with `Subscription`

---

## 🧾 **Subscription**

SaaS subscription for each store:

* Billing date
* Plan assigned
* Store assigned

---

## 🗂️ **Category**

Hierarchical category system:

* Parent/child categories
* Products assigned to a category

---

## 📦 **Product**

Store products:

* Images
* Status (active/inactive)
* Relations: store, category, images, orderItems, reviews

---

## 🖼️ **ProductImage**

Stores product image URLs + sort order.

---

## 🛒 **Cart & CartItem**

Temporary shopping cart before checkout:

* `Cart` belongs to a user
* `CartItem` references cart + product

---

## 📑 **Order**

Customer orders:

* Order items
* Shipping address
* Payment status
* Tax, total, shipping cost

---

## 📦 **OrderItem**

A row inside an order:

* Product snapshot price
* Quantity

---

## ⭐ **Review**

Customer review on products:

* Store responses supported

---

## 🧾 **PaymentTransaction**

Logs payments:

* For orders or subscriptions
* Gateway info
* Status

---

## 👥 **StoreEmployee**

Employees assigned to a store:

* Permissions stored in JSON
* Composite primary key

---

## 💬 **Message**

User-to-user or store messaging:

* Sender
* Receiver
* Optional store relation

---

## 🔔 **Notification**

User notifications:

* Simple content and read status

---

## 📊 **StoreAnalytics**

Ignored model (`@@ignore`), reserved for future analytics.

---

# 🛠️ **How to Run Prisma with Docker**

### 1️⃣ Start DB containers

```sh
docker compose up -d
```

### 2️⃣ Apply DB migrations

```sh
npx prisma migrate dev
```

### 3️⃣ Open Prisma Studio

```sh
npx prisma studio
```

### 4️⃣ Generate Prisma client

```sh
npx prisma generate
```

---

# 🤝 **For Other Backend Developers**

### To interact with the DB:

```ts
import { PrismaClient } from "../generated/prisma";
export const prisma = new PrismaClient();
```

### Example: Create User

```ts
await prisma.user.create({
  data: {
    name: "Mohamed",
    email: "test@example.com",
    password: "hashedPassword",
  },
});
```

### Example: Fetch Store with products

```ts
await prisma.store.findUnique({
  where: { id: 1 },
  include: { products: true },
});
```

---
