
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tags').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('tags').insert({id: 1, name: 'A Game of Thrones'}),
        knex('tags').insert({id: 2, name: 'Westworld'}),
        knex('tags').insert({id: 3, name: 'Gay'}),
        knex('tags').insert({id: 4, name: 'Military'}),
        knex('tags').insert({id: 5, name: 'Donald Trump'}),
      ]);
    });
};
