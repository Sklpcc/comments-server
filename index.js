import Express from 'express';
import GraphHTTP from 'express-graphql';
import Schema from './schema';

const port = 3000;
const app = Express();

app.use(function(req, res, next) {
    // Temporary workaround to CORS
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'content-type, authorization, content-length, x-requested-with, accept, origin');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Allow', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    if(req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use('/graphql', GraphHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true,
}));

app.listen(port, () => console.log('Listening on port: ', port));
