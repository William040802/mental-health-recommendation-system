CREATE DATABASE IF NOT EXISTS mood_tracker;
USE mood_tracker;

-- Create the `users` table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the `moods` table
CREATE TABLE IF NOT EXISTS moods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood INT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Modify the `moods` table to ensure dynamic timestamp generation
ALTER TABLE moods
MODIFY date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;


-- Example user
INSERT INTO users (username, password) VALUES ('test_user', 'hashed_password');

-- Optionally insert a test mood (the DB will auto-set date)
INSERT INTO moods (user_id, mood) VALUES (1, 7);
