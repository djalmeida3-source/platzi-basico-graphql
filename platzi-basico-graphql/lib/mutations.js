'use strict'

const { ObjectID } = require('bson')
const connectDb = require('./db')

module.exports = {
    createCourse: async (root, { input }) => {
        const defaults = {
            teacher: '',
            topic:''
        }
        const newCourse = Object.assign(defaults, input)
        let db
        let course
        try {
            db = await connectDb()
            course = await db.collection('courses').insertOne(newCourse)
            newCourse._id = course.insertedId
        } catch (error) {
            console.log(error)
        }
        return newCourse
    },
    createStudent: async (root, { input }) => {
        let db
        let student
        try {
            db = await connectDb()
            student = await db.collection('students').insertOne(input)
            input._id = student.insertedId
        } catch (error) {
            console.log(error)
        }
        return input
    },
    editCourse: async (root, { _id, input }) => {
        let db
        let course
        try {
            db = await connectDb()
            course = await db.collection('courses').updateOne(
                { id: ObjectID(_id) },
                { $set: input }
            )
            course = await db.collection('courses').findOne(
                { _id: ObjectID(_id) }
            )
        } catch (error) {
            console.log(error)
        }
        return course
    },
    editStudent: async (root, { _id, input }) => {
        let db
        let student
        try {
            db = await connectDb()
            student = await db.collection('students').updateOne(
                { id: ObjectID(_id), },
                { $set: input }
            )
            student = await db.collection('students').findOne(
                { _id: ObjectID(_id) }
            )
        } catch (error) {
            console.log(error)
        }
        return student
    },
    deleteCourse: async (root, { id }) => {
        let db, info;
        try {
          db = await connectDb();
          info = await db.collection('courses').deleteOne({
            _id: ObjectID(id)
          });
        } catch (error) {
          console.error(error);
        }
        return info.deletedCount
          ? `El curso con id ${id} fue eliminado exitosamente.`
          : 'No existe el curso con el id indicado';
    },
    deleteStudent: async (root, { id }) => {
        let db, info;
        try {
          db = await connectDb();
          info = await db.collection('students').deleteOne({
            _id: ObjectID(id)
          });
        } catch (error) {
          console.error(error);
        }
        return info.deletedCount
          ? `El estudiante con id ${id} fue eliminado exitosamente.`
          : 'No existe el estudiante con el id indicado';
    },
    addPeople: async (root, { courseID, personID }) => {
        let db
        let person
        let course
        try {
            db = await connectDb()
            course = await db.collection('courses').findOne(
                { _id: ObjectID(courseID) }
            )
            person = await db.collection('students').findOne(
                { _id: ObjectID(personID) }
            )
            if (!course || !person) throw new Error('La persona o el curso no existe')
            await db.collection('courses').updateOne(
                { _id: ObjectID(courseID) },
                { $addToSet: { people: ObjectID(personID)}}
            )
        } catch (error) {
            console.log(error)
        }
        return course
    }
}