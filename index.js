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