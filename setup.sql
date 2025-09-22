###################################### Start Admin ###################
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    role VARCHAR(50) CHECK (role IN ('admin')) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# insert one admin
INSERT INTO admins (name, email, password, phone, address, role)
VALUES (
  'Super Admin',
  'admin@example.com',
  '123456'
  '01700000000',
  'Dhaka, Bangladesh',
  'admin'
);

########################################### End Admin ########################

########################################### Start Product ########################
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    long_desc TEXT,
    price NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    discount_status BOOLEAN DEFAULT false,
    category TEXT NOT NULL,
    image TEXT,
    slug TEXT NOT NULL,
    sku TEXT NOT NULL,
    createdat TIMESTAMP DEFAULT now(),
    updatedat TIMESTAMP DEFAULT now()
);
########################################### End Product ########################

########################################### Start Order ########################
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    address TEXT NOT NULL,
    note TEXT,
    total NUMERIC NOT NULL,
    payment_method VARCHAR NOT NULL,
    trx_id VARCHAR NOT NULL,
    bkash_number VARCHAR,            
    product_ids UUID[] NOT NULL, 
    status BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

########################################### End Order ########################