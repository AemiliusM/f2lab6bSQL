const client = require('../lib/client');
// import our seed data:
const powers = require('./powers.js');
const typeData = require('./type.js');
// const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      typeData.map(types => {
        return client.query(`
       INSERT INTO types (type)
       VALUES ($1)
       RETURNING *;
       `, [types.type]);
      })
    );

    await Promise.all(
      powers.map(powers => {
        return client.query(`
                    INSERT INTO powers (power_name, description, realistic, type_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [powers.power_name, powers.description, powers.realistic, powers.type_id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {

    console.log('KJLENLFKNELKWN');
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
