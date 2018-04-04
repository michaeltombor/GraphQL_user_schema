const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use('/', expressGraphQL({
    schema,
    graphiql: true
}));

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started!"); 
});