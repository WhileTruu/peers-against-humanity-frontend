
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('colors').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('colors').insert({id: 1, colName: 'white'}),
        knex('colors').insert({id: 2, colName: 'black'}),
      ]);
    });
};
