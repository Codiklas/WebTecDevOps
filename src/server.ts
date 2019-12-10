import express = require('express')
const app = express()
import bodyparser = require('body-parser'); 


let ejs = require('ejs');
import path = require('path');
app.use(express.static(path.join(__dirname, '/public')))
import {MetricsHandler} from './metrics';

app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));


const port: string = process.env.PORT || '8080'


  const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

  app.post('/metrics/:id', (req: any, res: any) => {
    console.log('hello', req);
    dbMet.save(req.params.id, req.body, (err: Error | null) => {
      if (err) throw err
      res.status(200).send()
    })
  })

  app.get('/metrics/:id', (req: any, res: any) => {
    dbMet.getById(req.params.id, (err: Error | null, result: any) => {
      if (err) throw err
      res.status(200).send(result)
    })
  })

  app.get('/metrics/', (req: any, res: any) => {

    dbMet.getAll((err: Error | null, result: any) => {
      if (err) throw err
      console.log(result);
      res.status(200).send(result)
    })

  })

  app.delete('/metrics/:id', (req: any, res: any) => {

    dbMet.deleteById(req.params.id, (err: Error | null, result: any) => {
      if (err) throw err
      console.log(result);
      res.status(200).send(result)
    })

  })


  app.get('/hello/:name', (req, res) => 
    res.render('hello.ejs', {name: req.params.name})
  )


app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
