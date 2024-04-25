// const { Sequelize, DataTypes } = require('sequelize');
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Connect to MySQL
const sequelizeMySQL = new Sequelize(process.env.DB_CONNECTION_STRING_MYSQL);

// Connect to PostgreSQL
const sequelizePostgres = new Sequelize(process.env.DB_CONNECTION_STRING_POSTGRES);

// Define MySQL model
const PersonMySQL = sequelizeMySQL.define('persons', { 
    PersonId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    FirstName: {
        type: DataTypes.STRING
    },
    Age: {
        type: DataTypes.INTEGER
    }
 }, {
    timestamps: false  // disable automatic timestamp fields
});

// Define PostgreSQL model
const PersonPostgres = sequelizePostgres.define('persons', { 
    PersonId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    FirstName: {
        type: DataTypes.STRING
    },
    Age: {
        type: DataTypes.INTEGER
    }
 }, {
    timestamps: false  // disable automatic timestamp fields
});

// Function to transfer data from MySQL to PostgreSQL
const transferData = async () => {
  // Get data from MySQL
  const persons = await PersonMySQL.findAll();

  // Will automatically create the table in PostgreSQL if it is not present.
  PersonPostgres.sync({ force: true }).then(async () => {
    // Save data to PostgreSQL
    await PersonPostgres.bulkCreate(persons.map(person => person.toJSON()));
  });

  await PersonPostgres.findAll();
};

// Run the transfer
transferData().catch(console.error);