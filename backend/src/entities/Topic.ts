import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm'
import { Geometry } from 'geojson'

@Entity('topics')
class Topic {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column('varchar')
    username: string

  @Column('varchar')
    icon: string

  @Column('varchar')
    title: string

  @Column('geometry')
    location: Geometry
}

export default Topic
