import express, { Application, Request, Response } from 'express'; // import express
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config';
import routes from './routes';

const app : Application = express(); // create application object

const address : string = 'localhost:3000';

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));


const port = config.port || 3000; 

const corsOptions = {
    origin: address,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/api', routes); 

app.get('/', (req : Request, res : Response) => {
    res.json({
        message: "Hello From Store Front API"
    })
})

app.listen(port, () => {
    console.log(`server listening on ${address}`);
});

export default app;