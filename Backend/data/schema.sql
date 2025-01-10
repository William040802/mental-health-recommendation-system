-- Create the database
CREATE DATABASE IF NOT EXISTS mood_tracker;

-- Use the database
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
    date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert initial test data
INSERT INTO users (username, password) VALUES ('test_user', 'hashed_password');
INSERT INTO moods (user_id, mood, date) VALUES (1, 7, CURDATE());



