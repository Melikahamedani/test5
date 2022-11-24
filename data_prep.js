const fs = require ('fs');
const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('bsztmjux', 'bsztmjux', 'xr9XEUE-lh2WNKPLccHlk8_WX0mUhuC0', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


//Authentication
sequelize.authenticate()
        .then(()=>console.log("connection success"))
        .catch((e)=>{
            console.log("connection failed.");
            console.log(e);
        }); 


//create Student model
var student = sequelize.define("Student", {
    studId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
        name: Sequelize.STRING,
        program: Sequelize.STRING,
        gpa: Sequelize.FLOAT        
});


//prep
exports.prep = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            console.log("no data passed")
            resolve()
        }).catch(err => reject("unable to sync the database"))
    })
}


//Add Student
exports.addStudent = (stud) => {
    return new Promise((resolve, reject) => {

        student.create({
            studId: stud.studId,
            name: stud.name,
            program: stud.program,
            gpa: stud.gpa
        }).then(() => {
            resolve()
        }).catch(err => reject("unable to add the student"))
    });

}


//cpa
exports.cpa = () => {
    return new Promise((resolve, reject) => {
        student.findAll({ where: { program: "CPA" } }).then(data => {
            resolve(data)
        }).catch(err => reject("no results returned"))
    })
}


//highGPA
exports.highGPA = () => {
    return new Promise((resolve, reject) => {
        let high = 0;
        let highStudent;
        student.findAll().then(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].gpa > high) {
                    high = data[i].gpa;
                    highStudent = data[i];
                }
            }
            (highStudent) ? resolve(highStudent) : reject("Failed finding student with highest GPA");
        }).catch(err => {reject("no results returned")
        })
    });
};
