
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({id: 1, username: 'TheLegend27', password: '$2a$10$q6Ktp1YjbjphHYXcmEzHkOzxSsd7gOQIHABcP76uqq33uSUOmmNO6'})
      ]);
    });
};
