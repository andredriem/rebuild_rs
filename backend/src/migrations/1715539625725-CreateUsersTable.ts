import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateUsersTable1715539625725 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    // create extension CREATE EXTENSION Postgis;
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis;')
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    await queryRunner.createTable(new Table({
      name: 'topics',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'username',
          type: 'varchar',
          length: '100'
        },
        {
          name: 'title',
          type: 'varchar',
          length: '500'
        },
        {
          name: 'icon',
          type: 'varchar',
          length: '100'
        },
        {
          name: 'location',
          type: 'geography',
          spatialFeatureType: 'Point',
          srid: 4326
        }
      ],
      indices: [
        {
          columnNames: ['username']
        }
      ]
    }))
    // Create messages table, it has a foreign key to topics table (optional)
    // it has creeatedAt and updatedAt columns
    // has a string user column, that is not a foreign key, just something for testing
    await queryRunner.createTable(new Table({
      name: 'messages',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'text',
          type: 'text'
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()'
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          default: 'now()'
        },
        {
          name: 'username',
          type: 'varchar',
          length: '100'
          // is indexed but not unique
        },
        {
          name: 'topicId',
          type: 'uuid'
        }
      ],
      foreignKeys: [
        {
          columnNames: ['topicId'],
          referencedTableName: 'topics',
          referencedColumnNames: ['id']
        }
      ],
      // add index to user column
      indices: [
        {
          columnNames: ['username']
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('topics')
    await queryRunner.dropTable('messages')
    // drop extension
    await queryRunner.query('DROP EXTENSION IF EXISTS Postgis')
    await queryRunner.query('DROP EXTENSION IF EXISTS "uuid-ossp";')
  }
}
