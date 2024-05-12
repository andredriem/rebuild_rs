import express, { Request, Response } from 'express'

const app = express()

app.get('/api/alive', (req: Request, res: Response) => { res.send('I am alive\n') })
const port = process.env.PORT ?? '8080'

// Init server
void (
  async () => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
)()
