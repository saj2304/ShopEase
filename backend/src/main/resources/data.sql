-- ============================================================
-- ShopEase Seed Data — run AFTER spring.jpa.hibernate.ddl-auto=update
-- Admin password is: admin123
-- BCrypt hash of admin123:
-- ============================================================

-- Admin User (ROLE_ADMIN)
INSERT INTO users (name, email, password, phone, role, created_at)
SELECT 'Admin User',
       'admin@shopease.com',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       '9999999999',
       'ROLE_ADMIN',
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@shopease.com');

UPDATE users 
SET password = '$2a$10$8K1p/a0dR1xqM8PvLn7ZO.L9sJhVqM3YKxN2vB6cD4wEfG5hI7jAm'
WHERE email = 'admin@shopease.com';

-- Categories
INSERT INTO categories (name, description)
SELECT 'Electronics', 'Gadgets, devices and accessories'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Electronics');

INSERT INTO categories (name, description)
SELECT 'Clothing', 'Men, women and kids fashion'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Clothing');

INSERT INTO categories (name, description)
SELECT 'Books', 'Bestsellers, textbooks and more'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Books');

INSERT INTO categories (name, description)
SELECT 'Home & Kitchen', 'Everything for your home'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Home & Kitchen');

INSERT INTO categories (name, description)
SELECT 'Sports & Fitness', 'Gear and equipment for an active life'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Sports & Fitness');

-- Products
INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Wireless Noise-Cancelling Headphones',
       'Premium over-ear headphones with 40-hour battery life and active noise cancellation.',
       8999.00, 6499.00, 50,
       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
       true, (SELECT id FROM categories WHERE name='Electronics'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Wireless Noise-Cancelling Headphones');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Mechanical Keyboard RGB',
       'Compact 75% mechanical keyboard with Cherry MX switches and per-key RGB lighting.',
       5499.00, 4299.00, 30,
       'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400',
       true, (SELECT id FROM categories WHERE name='Electronics'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Mechanical Keyboard RGB');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Men Cotton Casual Shirt',
       'Classic fit premium cotton shirt. Available in multiple colours. Machine washable.',
       1499.00, 999.00, 100,
       'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
       true, (SELECT id FROM categories WHERE name='Clothing'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Men Cotton Casual Shirt');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Clean Code — Robert C. Martin',
       'A handbook of agile software craftsmanship. Must-read for every software engineer.',
       699.00, NULL, 75,
       'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
       true, (SELECT id FROM categories WHERE name='Books'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Clean Code — Robert C. Martin');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Yoga Mat Anti-Slip 6mm',
       'Extra-thick non-slip yoga mat with alignment lines. Includes carrying strap.',
       1299.00, 899.00, 60,
       'https://images.unsplash.com/photo-1601925228008-dbadbc8c2cd8?w=400',
       true, (SELECT id FROM categories WHERE name='Sports & Fitness'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Yoga Mat Anti-Slip 6mm');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Stainless Steel Water Bottle 1L',
       'BPA-free insulated bottle keeps drinks cold 24hrs, hot 12hrs.',
       899.00, NULL, 120,
       'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
       true, (SELECT id FROM categories WHERE name='Home & Kitchen'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Stainless Steel Water Bottle 1L');

-- ShopEase — Insert 10 New Products
-- Run this in pgAdmin → shopease_db → Tools → Query Tool → F5

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'iPhone 15 Pro Case',
       'Premium protective case for iPhone 15 Pro with military-grade drop protection',
       1299.00, 899.00, 100,
       'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
       true, (SELECT id FROM categories WHERE name='Electronics'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='iPhone 15 Pro Case');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Running Shoes Men',
       'Lightweight breathable running shoes with cushioned sole',
       3999.00, 2799.00, 50,
       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
       true, (SELECT id FROM categories WHERE name='Sports & Fitness'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Running Shoes Men');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Wooden Coffee Table',
       'Modern solid wood coffee table with storage shelf',
       8999.00, 6499.00, 20,
       'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
       true, (SELECT id FROM categories WHERE name='Home & Kitchen'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Wooden Coffee Table');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Women Floral Kurti',
       'Beautiful floral print cotton kurti for casual and festive wear',
       1299.00, 799.00, 80,
       'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400',
       true, (SELECT id FROM categories WHERE name='Clothing'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Women Floral Kurti');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Atomic Habits — James Clear',
       'The life-changing million copy bestseller on building good habits',
       799.00, 499.00, 60,
       'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
       true, (SELECT id FROM categories WHERE name='Books'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Atomic Habits — James Clear');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Bluetooth Speaker Portable',
       '360 degree surround sound portable speaker with 12-hour battery life',
       2499.00, 1799.00, 40,
       'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
       true, (SELECT id FROM categories WHERE name='Electronics'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Bluetooth Speaker Portable');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Dumbbell Set 10kg',
       'Rubber coated dumbbell set ideal for home workouts',
       2999.00, 2199.00, 30,
       'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
       true, (SELECT id FROM categories WHERE name='Sports & Fitness'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Dumbbell Set 10kg');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Non-Stick Cookware Set',
       '5-piece non-stick cookware set with glass lids and ergonomic handles',
       3499.00, 2499.00, 25,
       'https://images.unsplash.com/photo-1584990347449-a2d4c2c044c9?w=400',
       true, (SELECT id FROM categories WHERE name='Home & Kitchen'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Non-Stick Cookware Set');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'Men Formal Blazer',
       'Slim fit formal blazer perfect for office and events',
       4999.00, 3499.00, 35,
       'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
       true, (SELECT id FROM categories WHERE name='Clothing'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Men Formal Blazer');

INSERT INTO products (name, description, price, discount_price, stock, image_url, active, category_id, created_at)
SELECT 'The Alchemist — Paulo Coelho',
       'A world-famous novel about following your dreams',
       399.00, 299.00, 90,
       'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
       true, (SELECT id FROM categories WHERE name='Books'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='The Alchemist — Paulo Coelho');

-- Verify
SELECT id, name, price, discount_price, stock FROM products ORDER BY id;

COMMIT;
