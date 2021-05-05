module.exports = {
  async up(db) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.createCollection('test', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['metrics', 'outcome'],
          properties: {
            metrics: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['metric'],
                properties: {
                  metric: {
                    bsonType: 'string'
                  }
                }
              }
            },
            outcome: {
              bsonType: 'string'
            }
          }
        }
      }
    });
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection('test').drop();
  }
};
