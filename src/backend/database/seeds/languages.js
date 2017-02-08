
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('languages').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('languages').insert({id: 1, colName: 'english'}),
        knex('languages').insert({id: 2, colName: 'estonian'}),
      ]);
    });
};
