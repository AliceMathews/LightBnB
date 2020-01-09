const properties = require('./json/properties.json');
const users = require('./json/users.json');

//CONNECT TO DB
const { Pool } = require('pg'); 

const pool = new Pool({
  user: 'vagrant', 
  password: '123', 
  host: 'localhost',
  database: 'lightbnb'
});

pool.connect(); 

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
  
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
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
  let queryString = `SELECT * FROM properties LIMIT $1`

  return pool
    .query(queryString, [limit])
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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
