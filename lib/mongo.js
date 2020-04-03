
const Fuse = require("fuse.js");

const database = {
    grades: "course_grades",
    courses: "course_data"
};
const collections = {
    subjects: "subjects",
    programs: "programs",
    terms: "terms",
    s_id: id => `term_${id}`
};

const Config = require("./config.js");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const Client = new MongoClient(Config.MONGO_URL(), Config.MONGO_OPTIONS);

// Filter a given semester based on parameters specified in 'specifiers'
// The default page is zero, and we return a default of 25 items per page.
async function filterSemester(semester_id, specifiers, page_num = 0, per_page = 25) {
    let cursor = await Client.db(database.courses).collection(collections.s_id(semester_id)).find(specifiers);
    let pages = Math.ceil(await cursor.count() / per_page);
    let results = await cursor.skip(page_num * per_page).limit(per_page).toArray();
    return {
        pages,
        results
    }
}

// Fuzzy search accepts a query string and returns a list of courses which
// were 'close' in similarity to the query.
async function fuzzySearch(semester_id, query) {
    let unfiltered_term = await Client.db(database.courses).collection(collections.s_id(semester_id)).find().toArray();
    let fuse = new Fuse(unfiltered_term, Config.FUSE_COURSE_OPTIONS);
    let results = fuse.search(query);
    return {
        count: results.length,
        results
    }
}

// Get a list of all terms in the database.
async function retrieveTerms() {
    let terms = await Client.db(database.courses).collection(collections.terms).find().sort({_id: 1}).toArray();
    return {terms};
}

// Returns the future-most term available in the database.
async function retrieveCurrentTerm() {
    return await Client.db(database.courses).collection(collections.terms).find().sort({_id: -1}).limit(1).toArray();
}

// Retrieve a list of all programs of the types specified in 'program_types'
async function retrievePrograms(program_types) {
    let matching_programs = await Client.db(database.courses).collection(collections.programs).find({type: {$in: program_types}}).toArray();
    let results = {};
    matching_programs.forEach(program => {
        if(results[program.type]) results[program.type].push(program);
        else results[program.type] = [program];
    });
    return results;
}

// Get data on a certain program from the database.
async function retrieveProgramInfoByName(program_name) {
    let results = await Client.db(database.courses).collection(collections.programs).find({name: program_name}).toArray();
    return results.length === 1 ? results[0] : {status: 404};
}
async function retrieveProgramInfoByID(program_id) {
    let results = await Client.db(database.courses).collection(collections.programs).find(ObjectId(program_id)).toArray();
    return results.length === 1 ? results[0] : {status: 404};
}

// Fuzzy search the database of programs
async function fuzzyProgramSearch(query) {
    let unfiltered_programs = await Client.db(database.courses).collection(collections.programs).find().toArray();
    let fuse = new Fuse(unfiltered_programs, Config.FUSE_PROGRAM_OPTIONS);
    let results = fuse.search(query);
    return {
        count: results.length,
        results
    };
}

// Returns a list of all subjects in the database.
async function retrieveSubjects() {
    let subjects = await Client.db(database.courses).collection(collections.subjects).find().toArray();
    return {subjects};
}

// Search the subjects in the database based on the criteria specified in 'specifiers'
async function filterSubjects(specifiers) {
    let filtered_subjects = await Client.db(database.courses).collection(collections.subjects).find(specifiers).toArray();
    return {subjects: filtered_subjects};
}

async function fuzzySubjectSearch(query) {
    let unfiltered_subjects = await Client.db(database.courses).collection(collections.subjects).find().toArray();
    let fuse = new Fuse(unfiltered_subjects, Config.FUSE_SUBJECT_OPTIONS);
    let results = fuse.search(query);
    return {
        count: results.length,
        results
    };
}

// Fuzzy search

module.exports = {
    Client,
    filterSemester,
    fuzzySearch,
    retrieveTerms,
    retrieveCurrentTerm,
    retrievePrograms,
    retrieveProgramInfoByName,
    retrieveProgramInfoByID,
    fuzzyProgramSearch,
    retrieveSubjects,
    filterSubjects,
    fuzzySubjectSearch
}
