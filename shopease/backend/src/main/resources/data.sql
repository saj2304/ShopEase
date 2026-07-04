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

COMMIT;
