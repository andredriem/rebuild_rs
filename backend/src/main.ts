import express, { Request, Response } from 'express'
import morgan from 'morgan'

const app = express()

app.use(morgan('combined'))
app.use(express.json())

app.get('/api/alive', (req: Request, res: Response) => { res.send('I am alive\n') })
app.get('/api/mapData', (req: Request, res: Response) => {
  // Demo backend
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          pizza: 'planet'
        },
        geometry: {
          coordinates: [
            -51.240272209906095,
            -30.03201193944784
          ],
          type: 'Point'
        }
      },
      {
        type: 'Feature',
        properties: {
          pizza: 'planet'
        },
        geometry: {
          coordinates: [
            -51.24205462375528,
            -30.04528186143085
          ],
          type: 'Point'
        }
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            -51.228983588857545,
            -30.049139063467493
          ],
          type: 'Point'
        }
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            -51.234093175226576,
            -30.03088031348571
          ],
          type: 'Point'
        }
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            -51.22850827849746,
            -30.026816641032255
          ],
          type: 'Point'
        }
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            -51.258690486352464,
            -30.039932959397632
          ],
          type: 'Point'
        }
      }
    ]
  }

  res.json(data)
})
const port = process.env.PORT ?? '8080'

// Init server
void (
  async () => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
)()
