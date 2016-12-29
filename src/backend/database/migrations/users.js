/*
  Create a table for use with user auth.
*/
export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('username').notNullable()
    table.string('password').notNullable()
    table.timestamps('createdAt')
  })
}

export function down(knex) {
  return knex.schema.dropTable('users')
}
