
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('card_categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('card_categories').insert({ name: 'A Game of Thrones'}),
        knex('card_categories').insert({ name: 'Default'}),
        knex('card_categories').insert({ name: 'Nerdy'}),
      ]);
    });
};
