INSERT INTO users (name, email, password) 
  VALUES 
    ('Alice', 'alice@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
    ('Stu', 'stu@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
    ('Hannah', 'hannah@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
  VALUES 
    (1, 'Treehouse', 'description', 'https://photo1', 'https://photo2', 545, 2, 5, 2, 'Canada', 'Drifter Way', 'Whistler', 'BC', 'V0N 1B8', true),
    (1, 'Bunker', 'description', 'https://photo1', 'https://photo2', 200, 1, 1, 0, 'Canada', 'W31st', 'Vancouver', 'BC', 'V6N 1B8', true),
    (3, 'Sky scraper', 'description', 'https://photo1', 'https://photo2', 1000, 80, 50, 20, 'Canada', 'W Georgia St', 'Vancouver', 'BC', 'V3N 1D8', true),
    (2, 'Bungalo', 'description', 'https://photo1', 'https://photo2', 400, 3, 1, 1, 'Canada', 'High Way', 'Squamish', 'BC', 'V3N 1B8', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
  VALUES 
    ('2018-09-11', '2018-09-26', 1, 3),
    ('2019-01-04', '2019-02-01', 2, 2),
    ('2021-10-01', '2021-10-14', 4, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
  VALUES 
    (3, 1, 1, 6, 'hello'),
    (2, 2, 2, 10, 'good'), 
    (1, 4, 2, 7, 'ok');