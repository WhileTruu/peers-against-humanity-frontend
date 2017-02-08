
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tags').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('tags').insert({id: 1, colName: 'A Game of Thrones'}),
        knex('tags').insert({id: 2, colName: 'Westworld'}),
        knex('tags').insert({id: 3, colName: 'Gay'}),
        knex('tags').insert({id: 4, colName: 'Military'}),
        knex('tags').insert({id: 5, colName: 'Donald Trump'}),
      ]);
    });
};
