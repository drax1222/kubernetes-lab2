const express = require('express');
const redis = require('redis');
const {v4: uuidv4} = require('uuid');
const app = express();
const appId = uuidv4();
const port = 5005;

const client = redis.createClient(
{
    host: "redis-service.default.svc.cluster.local",
    port: 6379
});
client.set('counter', 0);

app.get('/', (r,s)=>{
    client.get('counter', (e,z)=> {
        var counter = parseInt(z);
        if(e){
            s.send(`${appId} Hello from my backend app // ERROR ${e}`);
        }
        s.send(`${appId} Hello from my backend app // ${counter}`);
        client.set('counter', counter+1);
    });
})
app.listen(port, err=>{
    console.log('Listening on port: ' + port);
});