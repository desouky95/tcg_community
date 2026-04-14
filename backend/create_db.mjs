import pg from 'pg'

const client = new pg.Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '0100929164',
})

async function run() {
  await client.connect()
  try {
    await client.query('CREATE DATABASE tcg')
    console.log('Database tcg created successfully')
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database tcg already exists')
    } else {
      console.error('Error creating database:', err)
    }
  } finally {
    await client.end()
  }
}

run()
