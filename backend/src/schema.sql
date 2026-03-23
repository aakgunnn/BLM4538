-- Create ENUM for roles
CREATE TYPE user_role AS ENUM ('admin', 'member');

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    cover_url VARCHAR(255),
    available_copies INTEGER DEFAULT 1,
    total_copies INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowings Table (Optional for Week 1, but good for design)
CREATE TABLE IF NOT EXISTS borrowings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    book_id UUID REFERENCES books(id),
    borrow_date DATE DEFAULT CURRENT_DATE,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'borrowed', -- borrowed, returned
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
