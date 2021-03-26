const db = require ('../../data/dbConfig');

function get() {
    return db ('users as u')
    .select('id', 'username')
    .orderby('id')
}

function getBy(filter) {
    return db('users')
    .where('username', filter)
}

function getById(id){
    return db('users as u')
    .where('id', id)
    .first()
}

async function insert(user) {
    const [id] = await db('users')
    .insert(user)
    return getById(id)
}

module.exports = {
    insert,
    getById, 
    getBy,
    get,
}