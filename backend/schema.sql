CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('lost', 'found')),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'resolved')),
    contact VARCHAR(100),
    photo TEXT,           -- Foto Barang
    location_photo TEXT,  -- Foto Lokasi 
    reporter VARCHAR(100), -- Username pelapor
    created_at TIMESTAMP DEFAULT now()
);