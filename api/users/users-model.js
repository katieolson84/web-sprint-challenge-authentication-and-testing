const db = require ('../../data/dbConfig');

function get() {
    return db ('users as u')
    .select('id', 'username')
    .orderby('id')
}

function getBy(filter) {
    return db('users as u')
    .select('id', 'username', 'password')
    .where('username',filter)
}

function getById(id){
    return db('users as u')
    .select('id')
    .where('id', id)
    .first()
}

async function insert(user) {
    const [id] = await db('users')
    .select('id', 'username', 'password')
    .insert(user, 'id')
    return getById(id)
}

module.exports = {
    insert,
    getById, 
    getBy,
    get,
}