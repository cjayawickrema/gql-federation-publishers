// DD INIT - start
const httpServerOptions = {
    middleware: false,
};
const graphqlOptions = {
    depth: 2,
    collapse: true,
    signature: false
};
const tracer = require('dd-trace');
tracer.init({
    plugins: false
});
tracer.use('http', {
    server: httpServerOptions,
});
tracer.use('express', httpServerOptions);
tracer.use('graphql', graphqlOptions);
// DD INIT - end

const {ApolloServer, gql} = require('apollo-server');
const {buildFederatedSchema} = require('@apollo/federation');
const publisherLoader = require('./publisherLoader');

const typeDefs = gql`

    type Publisher @key(fields: "id") {
        id: ID!
        name: String
        details: String
    }

    type Query {
        publishers: [Publisher]
    }
`;

const resolvers = {
    Query: {
        publishers: () => publishersMockData,
    },
    Publisher: {
        __resolveReference(reference, {publisherLoader}) {
            // return publishersMockData.find(e => reference.id === e.id)
            console.log('__resolveReference');
            return publisherLoader.load(reference.id);
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{typeDefs, resolvers}]),
    debug: true,
    context: () => ({
        publisherLoader: publisherLoader()
    }),
});


// The `listen` method launches a web server.
server.listen(4002).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});