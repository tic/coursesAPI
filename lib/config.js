module.exports = {
    MONGO_URL: () => `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@userdata-r5w4z.mongodb.net/test?retryWrites=true&w=majority`,
    MONGO_OPTIONS: {
        useNewUrlParser: true,
        keepAlive: 1,
        connectTimeoutMS: 10000,
        useUnifiedTopology: true
    },
    FUSE_COURSE_OPTIONS: {
        shouldSort: true,
        tokenize: false,
        findAllMatches: true,
        threshold: 0.4,
        location: 0,
        includeScore: true,
        distance: 250,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            {name: 'common_name', weight: .5},
            {name: 'instructors', weight: .5},
            {name: 'subject', weight: .5},
            {name: 'catalog_number', weight: .5},
            {name: 'title', weight: .5},
            {name: 'location', weight: .5}
        ],
    },
    FUSE_PROGRAM_OPTIONS: {
        shouldSort: true,
        tokenize: false,
        threshold: 0.4,
        distance: 150,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        includeScore: true,
        keys: [
            {name: 'name', weight: .5},
            {name: 'school', weight: .5},
            {name: 'descriptions', weight: .25},
            {name: 'type', weight: .25}
        ],
    },
    FUSE_SUBJECT_OPTIONS: {
        shouldSort: true,
        tokenize: false,
        threshold: 0.4,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        includeScore: true,
        keys: [
            {name: 'name', weight: .6},
            {name: 'subject', weight: .2},
            {name: 'school', weight: .2}
        ],
    },
    FUSE_GRADE_OPTIONS: {
        shouldSort: true,
        tokenize: false,
        threshold: 0.4,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        includeScore: false,
        keys: [
            {name: 'last_name', weight: .6},
            {name: 'first_name', weight: .4},
        ],
    }
}
