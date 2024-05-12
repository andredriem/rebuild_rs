import 'reflect-metadata'
import express, { Request, Response } from 'express'
import morgan from 'morgan'
import { appDataSource } from './database'
import Topic from './entities/Topic'
import Message from './entities/Message'

const app = express()

app.use(morgan('combined'))
app.use(express.json())

app.get('/api/alive', (req: Request, res: Response) => { res.send('I am alive\n') })
app.post('/api/postTopic', (req: Request, res: Response) => { void PostTopic(req, res) })
/**  */
async function PostTopic (req: Request, res: Response): Promise<void> {
  const { user, title, body, pinIcon, latitude, longitude } = req.body

  // Create topic
  const postRqueryResponse = await appDataSource.query(
    'INSERT INTO topics (username, title, icon, location) VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326)) RETURNING id;',
    [user, title, pinIcon, longitude, latitude]
  )
  console.log('postRqueryResponse', postRqueryResponse)
  const topicId = postRqueryResponse[0].id

  console.log('postId', topicId)
  console.log('postRqueryResponse', postRqueryResponse)

  // Creates first message
  const messageQueryResponse = await appDataSource.query(
    'INSERT INTO messages (text, "topicId", username) VALUES ($1, $2, $3) RETURNING id;',
    [body, topicId, user]
  )

  const messageId = messageQueryResponse[0].id

  if (messageId !== undefined && topicId !== undefined) {
    res.json({ postId: topicId })
  } else {
    res.status(500).json({ message: 'Failed to create new pin' })
  }
}

app.get('/api/mapData', (req: Request, res: Response) => { void GetMapData(req, res) })
/**  */
async function GetMapData (req: Request, res: Response): Promise<void> {
  // Demo backend

  // Query all Topics from database
  const topicRepository = appDataSource.getRepository(Topic)
  const topics = await topicRepository.find()

  console.log('topics', JSON.stringify(topics[0]))

  const data = {
    type: 'FeatureCollection',
    features: topics.map(topic => ({
      type: 'Feature',
      properties: {
        title: topic.title,
        icon: topic.icon,
        user: topic.username,
        postId: topic.id
      },
      geometry: topic.location
    }))
  }
  console.log('data', JSON.stringify(data))
  res.json(data)
}
const port = process.env.PORT ?? '8080'

app.get('/api/post/:id', (req: Request, res: Response) => { void GetPost(req, res) })
/**  */
async function GetPost (req: Request, res: Response): Promise<void> {
  // wait to get post id
  const postId = req.params.id
  const posts = await appDataSource.getRepository(Topic).findBy({ id: postId })
  if (posts.length === 0) {
    res.status(404).json({ message: 'Post not found' })
    return
  }
  const post = posts[0]

  // Query messages by topicId and ordem them by created_at where the oldest message is the first
  const messages = await appDataSource.getRepository(Message).find(
    {
      where: {
        topicId: post.id
      },
      order: {
        createdAt: 'ASC'
      }
    }
  )
  console.log(JSON.stringify({ post, messages }))
  res.json({
    post,
    messages
  })
}
app.post('/api/post/:id/comments', (req: Request, res: Response) => { void PostMessage(req, res) })
/**  */
async function PostMessage (req: Request, res: Response): Promise<void> {
  const postId = req.params.id
  const { text, user } = req.body

  // Create message
  const message = await appDataSource.getRepository(Message).create({
    text,
    username: user,
    topicId: postId
  })
  await appDataSource.getRepository(Message).save(message)
  res.json({ message: 'Message created' })
}

// Init server
void (
  async () => {
    // wait for database connection
    await appDataSource.initialize()

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
)()
