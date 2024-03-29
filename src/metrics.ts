
import WriteStream from 'level-ws'
import { LevelDB } from './leveldb';
import { read, ReadStream } from 'fs';

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  private db: any

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    console.log(key);
    console.log(metrics);
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }


  public getAll(callback: (error: Error | null, result: any | null) => void) {
    let metrics: Metric[] = []  

    this.db.createReadStream()
      .on('data', function (data) {
        
        let timestamp: string = data.key.split(':')[1]
        let metric: Metric = new Metric(timestamp, data.value);
        metrics.push(metric)
      })
      .on('error', function (err) {
        callback(err, null);
        console.log('Oh my!', err)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics);
        console.log('Stream ended')
      })
  }

  public getById(key: number, callback: (error: Error | null, result: any | null) => void) {
    let metrics: Metric[] = []  

    this.db.createReadStream()
      .on('data', function (data) {
        console.log(key);
        console.log(data.value);
        if(data.value === key){
          let timestamp: string = data.key.split(':')[1]
          let metric: Metric = new Metric(timestamp, data.value);
          console.log(metric);
          console.log(data.key);
          metrics.push(metric)
        }
      })
      .on('error', function (err) {
        callback(err, null);
        console.log('Oh my!', err)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics);
        console.log('Stream ended')
      })
  }


  public deleteById(key: number, callback: (error: Error | null, result: any | null) => void) {
    let metrics: Metric[] = []  

    
    this.db.del()
      .on('data', function (data) {
          console.log(data);
      })
      .on('error', function (err) {
        callback(err, null);
        console.log('Oh my!', err)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics);
        console.log('Stream ended')
      })
  }

}