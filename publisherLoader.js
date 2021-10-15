const DataLoader = require('dataloader');

const publishersMockData = [
    {
        id: 'P001',
        name: 'Publisher 001',
        details: 'Igloo'
    },
    {
        id: 'P002',
        name: 'Publisher 002',
        details: 'Darwin'
    },
    {
        id: 'P003',
        name: 'Publisher 003',
        details: 'Charley'
    }
];

// aux function that will format the result to be ordered by the given ids,
// otherwise dataloader throws an error
const formatResult = (publishers, ids) => {
    const publisherMap = {};
    publishers.forEach(publisher => {
        publisherMap[publisher.id] = publisher;
    });

    return ids.map(id => publisherMap[id]);
};

const batchPublishers = async ids => {
    try {
        console.log(ids);
        let publishers = publishersMockData.filter(e => ids.includes(e.id));
        return formatResult(publishers, ids);
    } catch (err) {
        throw new Error('There was an error getting the publishers.');
    }
};

module.exports = {
    publisherDataLoader: () => new DataLoader(batchPublishers, { maxBatchSize: 2 }), // batch size will depend on external service,
    publishersMockData,
}