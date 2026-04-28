CREATE TABLE app_user
(
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INT NULL,
    email TEXT NOT NULL UNIQUE,
    points INT NULL
);

CREATE TABLE movie
(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    director TEXT NOT NULL,
    rate FLOAT NULL,
    release_date DATE NULL,
    synopsis TEXT NULL,
    image TEXT NULL
);

CREATE TABLE review
(
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    rate INT NULL,
    movie_id INT NULL,
    user_id INT NULL,
    review_date DATE NULL,
    FOREIGN KEY (movie_id) REFERENCES movie (id),
    FOREIGN KEY (user_id) REFERENCES app_user (id)
);
