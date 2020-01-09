const { pool } = require('./index.js');

/// Users
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  
  let queryString = `SELECT * 
  FROM users
  WHERE email = $1;`

  return pool
    .query(queryString, [email])
    .then(res => { 
      if (res.rows.length === 0) { 
        return null;
      } 
      return res.rows[0];
    })
    .catch(err => {
      console.error('query error', err.stack)
  });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  
  let queryString = `SELECT * 
  FROM users
  WHERE id = $1;`

  return pool
    .query(queryString, [id])
    .then(res => { 
      if (res.rows.length === 0) { 
        return null;
      } 
      return res.rows[0];
    })
    .catch(err => {
      console.error('query error', err.stack)
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  
  let queryString = `
  INSERT INTO users(name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *`

  return pool
    .query(queryString, [user.name, user.email, user.password])
    .then(res => { 
      if (res.rows.length === 0) { 
        return null;
      } 
      return res.rows[0];
    })
    .catch(err => {
      console.error('query error', err.stack)
  });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  
  let queryString = `
    SELECT properties.*, reservations.*, avg(rating) as average_rating
    FROM properties
    JOIN reservations ON reservations.property_id = properties.id 
    JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE reservations.guest_id = $1
      AND end_date < Now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;`;
  
  return pool
    .query(queryString, [guest_id, limit])
    .then(res => { 
      if (res.rows.length === 0) { 
        return null;
      } 
      return res.rows;
    })
    .catch(err => {
      console.error('query error', err.stack)
  });
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  const queryParams = [];

  let queryString = `
    SELECT properties.*, avg(rating) as average_rating 
    FROM properties
    LEFT OUTER JOIN property_reviews ON property_id = properties.id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);

    if (queryParams.length > 1) { 
      queryString += ` AND properties.cost_per_night <= $${queryParams.length}`
    } else {
      queryString += `WHERE properties.cost_per_night <= $${queryParams.length}`
    }
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);

    if (queryParams.length > 1) { 
      queryString += ` AND properties.cost_per_night >= $${queryParams.length}`
    } else {
      queryString += `WHERE properties.cost_per_night >= $${queryParams.length}`
    }
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);

    if (queryParams.length > 1) { 
      queryString += ` AND properties.owner_id >= $${queryParams.length}`
    } else {
      queryString += `WHERE properties.owner_id >= $${queryParams.length}`
    }
  }

  queryString += `
    GROUP BY properties.id
  `

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(rating) >= $${queryParams.length}`
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  return pool
    .query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.error('query error', err.stack)
  });
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  
  let queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *`;

  const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];

  return pool
    .query(queryString, queryParams)
    .then(res => { 
      if (res.rows.length === 0) { 
        return null;
      } 
      return res.rows[0];
    })
    .catch(err => {
      console.error('query error', err.stack)
  });
}
exports.addProperty = addProperty;
