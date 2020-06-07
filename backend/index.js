const express = require('express');
const redis = require('redis');
const { Pool } = require("pg");
const {v4: uuidv4} = require('uuid');
const app = express();
const appId = uuidv4();
const port = 5005;


//postgres-service
const client = redis.createClient({
    host: "redis-service",
    port: 6379
});
client.set('counter', 0);
    

const pgClient = new Pool({
    host: "postgres-service",
	user: "postgres",
	databse: "postgres",
	password: "pgpassword123",
	port: "5432"
});

pgClient.on('error', ()=> console.log('NO PG CONNECTION '));
pgClient.query('create table if not exists distances(p1x decimal,p1y decimal,p2x decimal, p2y decimal, result decimal)').catch(err => console.log(err));

app.get('/pointsdistance/:P1/:P2', (r,s)=>{
	var P1 = r.params.P1;
	var P2 = r.params.P2;
	let p1x = parseFloat(P1.split(',')[0]);
	let p1y = parseFloat(P1.split(',')[1]);
	let p2x = parseFloat(P2.split(',')[0]);
	let p2y = parseFloat(P2.split(',')[1]);

	client.get(`${p1x}${p1y}${p2x}${p2y}`, async (e, res) =>{
		if(res !== null){
			console.log('GETTING DATA FROM REDIS');
			s.send({Distance: res, Source: 'Redis'});
		}
		else{
			pgClient.query(`SELECT result from distances where p1x=${p1x} and p1y=${p1y} and p2x=${p2x} and p2y=${p2y}`, (err, res) => {
				if(res && res.rows.length > 0){
					console.log('GETTING DATA FROM PSQL');
					s.send({Distance: res.rows[0].result, Source: 'PSQL'});
				}
				else{
					console.log('CALCULATING AND SAVING NEW DATA');
					var newRes = Math.sqrt(Math.pow(p2x-p1x, 2) + Math.pow(p2y-p1y,2));
					client.set(`${p1x}${p1y}${p2x}${p2y}`, newRes);
					pgClient.query(`insert into distances values(${p1x},${p1y},${p2x},${p2y},${newRes})`);
					
					
					s.send({Distance: newRes, Source: 'Nowy wpis'});
				}
			  });
		}		
	});
	
});

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