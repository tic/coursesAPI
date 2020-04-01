module.exports = {
    MONGO_URL: () => `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@userdata-r5w4z.mongodb.net/test?retryWrites=true&w=majority`,
    MONGO_OPTIONS: {
        useNewUrlParser: true,
        keepAlive: 1,
        connectTimeoutMS: 10000,
        useUnifiedTopology: true
    },
}
