import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm'

@Entity('messages')
class Message {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column('text')
    text: string

  @Column('varchar')
    username: string

  @Column('uuid')
    topicId: string

  @Column('timestamp')
    createdAt: Date

  @Column('timestamp')
    updatedAt: Date
}

export default Message
