SELECT properties.*, reservations.*, avg(rating) as average_rating
FROM properties
JOIN reservations ON reservations.property_id = properties.id 
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1
  AND end_date < Now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;
