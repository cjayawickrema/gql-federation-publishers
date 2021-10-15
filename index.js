const {ApolloServer, gql} = require('apollo-server');
const {buildFederatedSchema} = require('@apollo/federation');
const {publisherDataLoader, publishersMockData} = require('./publisherLoader');

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
        __resolveReference(publisher, {publisherLoader}) {
            return publisherLoader.load(publisher.id);
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{typeDefs, resolvers}]),
    debug: true,
    context: () => ({
        publisherLoader: publisherDataLoader()
    }),
});


// The `listen` method launches a web server.
server.listen(4002).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});