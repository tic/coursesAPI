const Router = require("express").Router();
const Mongo = require("../../lib/mongo.js");
module.exports = Router;

// All grades for a certain professor's common_name course in a certain semester
// FORM: /semester/1198/professor/Bloomfield/course/CS2150
Router.get("/semester/:semester_id/professor/:professor/course/:common_name", async (req, res) => {
    let grades = await Mongo.filterGrades({ semester_id: req.params.semester_id,
                                            common_name: req.params.common_name
                                          }, req.params.professor);
    res.status(200).send(grades);
});

// All grades from a certain semester for a certain professor
// FORM: /semester/1198/professor/Bloomfield
Router.get("/semester/:semester_id/professor/:professor", async (req, res) => {
    let grades = await Mongo.filterGrades({semester_id: req.params.semester_id}, req.params.professor);
    res.status(200).send(grades);
});

// All grades for a single common_name in a given semester
Router.get("/semester/:semester_id/course/:common_name", async (req, res) => {
    let grades = await Mongo.filterGrades({ semester_id: req.params.semester_id,
                                            common_name: req.params.common_name
                                        }, undefined);
    res.status(200).send(grades);
});

// All grades for a given professor
Router.get("/professor/:professor", async (req, res) => {
    let grades = await Mongo.filterGrades({}, req.params.professor);
    res.status(200).send(grades);
});

// All grade for a given course from a given professor
Router.get("/professor/:professor/course/:common_name", async (req, res) => {
    let grades = await Mongo.filterGrades({common_name: req.params.common_name}, req.params.professor);
    res.status(200).send(grades);
});

// All grades from a given semester
Router.get("/semester/:semester_id", async (req, res) => {
    let grades = await Mongo.filterGrades({semester_id: req.params.semester_id}, undefined);
    res.status(200).send(grades);
});

// All grades for a given course, ever
Router.get("/course/:common_name", async (req, res) => {
    let grades = await Mongo.filterGrades({common_name: req.params.common_name}, req.params.professor);
    res.status(200).send(grades);
});
