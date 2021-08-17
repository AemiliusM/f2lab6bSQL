const client = require('../lib/client');
// import our seed data:
const powers = require('./powers.js');
const nameData = require('./name.js');
// const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      nameData.map(names => {
        return client.query(`
       INSERT INTO names (name)
       VALUES ($1)
       RETURNING *;
       `, [names.name]);
      })
    );

    await Promise.all(
      powers.map(powers => {
        return client.query(`
                    INSERT INTO powers (name_id, description, realistic, type)
                    VALUES ($1, $2, $3, $4);
                `,
        [powers.name_id, powers.description, powers.realistic, powers.type]);
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
