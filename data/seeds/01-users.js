
exports.seed = function (knex) {
  return knex('users').insert({
    username: 'katie',
    password: "1234"
  })
};