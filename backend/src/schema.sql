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
    category VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0.0,
    pages INTEGER DEFAULT 0,
    description TEXT,
    cover_url TEXT,
    available BOOLEAN DEFAULT true,
    due_date DATE,
    available_copies INTEGER DEFAULT 1,
    total_copies INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowings Table
CREATE TABLE IF NOT EXISTS borrowings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    book_id UUID REFERENCES books(id),
    borrow_date DATE DEFAULT CURRENT_DATE,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'borrowed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Seed Data: Sample Books
-- =============================================
INSERT INTO books (title, author, isbn, category, rating, pages, description, cover_url, available) VALUES
(
    'The Midnight Library',
    'Matt Haig',
    '978-0525559474',
    'Fiction',
    4.5,
    304,
    'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    'https://images.unsplash.com/photo-1709924168698-620ea32c3488?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    true
),
(
    'Pride and Prejudice',
    'Jane Austen',
    '978-0141439518',
    'Classic',
    4.8,
    432,
    'A romantic novel of manners that follows the character development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.',
    'https://images.unsplash.com/photo-1763768861268-cb6b54173dbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    false
),
(
    'Atomic Habits',
    'James Clear',
    '978-0735211292',
    'Self-Help',
    4.7,
    320,
    'An easy and proven way to build good habits and break bad ones. It offers a framework for improving every day through tiny changes in behavior.',
    'https://images.unsplash.com/photo-1549233566-fc68a19376e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    true
),
(
    'Dune',
    'Frank Herbert',
    '978-0441172719',
    'Science Fiction',
    4.6,
    688,
    'Set in the distant future amidst a huge interstellar empire, Dune tells the story of young Paul Atreides as his family relocates to the desert planet Arrakis.',
    'https://images.unsplash.com/photo-1554357395-dbdc356ca5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    true
),
(
    '1984',
    'George Orwell',
    '978-0451524935',
    'Classic',
    4.9,
    328,
    'A dystopian social science fiction novel that examines the role of truth and facts within societies, and how they can be manipulated.',
    'https://images.unsplash.com/photo-1706271948813-4d2c904af4d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    false
),
(
    'The Great Gatsby',
    'F. Scott Fitzgerald',
    '978-0743273565',
    'Classic',
    4.4,
    180,
    'A novel set on prosperous Long Island in the summer of 1922, chronicling the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.',
    'https://images.unsplash.com/photo-1752243731865-c2fa851af7ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    true
)
ON CONFLICT (isbn) DO NOTHING;
