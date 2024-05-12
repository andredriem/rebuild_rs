import { DataSource } from 'typeorm'

export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*ts']
})
