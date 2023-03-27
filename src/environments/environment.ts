export const environment = {
    production: true,
    site: {
        name: 'LoggerExample',
        team: 'ExampleTeam',
    },
    logger: {
        bufferSize: 500,
        url: 'localhost:5100/api/v1/log',
        timeFormat: 'YYYY-MM-DD HH:mm:ss:SSS',
    },
};
