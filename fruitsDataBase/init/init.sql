CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture TEXT
);

INSERT INTO users (username, email, password, profile_picture)
VALUES ('tree_lover', 'tree_lover@example.com', 'hashed_password', '/images/profile/tree_lover.jpg');
