
const Fuse = require("fuse.js");

const database = {
    grades: "schemized_grades",
    courses: "course_data",
};
const collections = {
    subjects: "subjects",
    programs: "programs",
    terms: "terms",
    s_id: id => `term_${id}`,
    grades: "dump",
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
    let sorted_terms = await Client.db(database.courses).collection(collections.terms).find().sort({_id: -1}).limit(1).toArray();
    return {current: sorted_terms[0]}
}

// Retrieve a list of all programs of the types specified in 'program_types'
async function retrievePrograms(specifiers) {
    let results = await Client.db(database.courses).collection(collections.programs).find(specifiers).toArray();
    return {results};
}

// Get data on a certain program from the database.
async function retrieveProgramInfoByName(program_name) {
    let results = await Client.db(database.courses).collection(collections.programs).find({name: program_name}).toArray();
    return results.length === 1 ? results[0] : {};
}
async function retrieveProgramInfoByID(program_id) {
    let results = await Client.db(database.courses).collection(collections.programs).find(ObjectId(program_id)).toArray();
    return results.length === 1 ? results[0] : {};
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
    return {count: filtered_subjects.length, results: filtered_subjects};
}

// Fuzzy search
async function fuzzySubjectSearch(query) {
    let unfiltered_subjects = await Client.db(database.courses).collection(collections.subjects).find().toArray();
    let fuse = new Fuse(unfiltered_subjects, Config.FUSE_SUBJECT_OPTIONS);
    let results = fuse.search(query);
    return {
        count: results.length,
        results
    };
}

async function filterGrades(specifiers, professor_attempt) {
    let unfiltered_grades = await Client.db(database.grades).collection(collections.grades).find(specifiers).toArray();

    if(professor_attempt) {
        let fuse = new Fuse(unfiltered_grades, Config.FUSE_GRADE_OPTIONS);
        let results = fuse.search(professor_attempt);
        if(results.length > 0) {
            if(!results[0].item.has_instructor) return { // First course does not have an instructor, so we can't filter to ensure a single professor.
                single_instructor_guaranteed: false,
                count: results.length,
                results,
            }

            // At least 1 result with an instructor
            let top_first = results[0].item.first_name;
            let top_last = results[0].item.last_name;
            results = results.filter(({item}) => item.has_instructor && item.first_name === top_first && item.last_name == top_last);
            return {
                single_instructor_guaranteed: true,
                count: results.length,
                results
            }
        }
        return { // Fuzzy search eliminated all courses. Return nothing
            single_instructor_guaranteed: true,
            count: 0,
            results: [],
        }
    } else return { // No professor provided. Return results of other filtering
        single_instructor_guaranteed: false,
        count: unfiltered_grades.length,
        results: unfiltered_grades,
    }
}


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
    fuzzySubjectSearch,
    filterGrades,
}
