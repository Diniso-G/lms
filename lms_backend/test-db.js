const {Sequelize} = require('sequelize');
console.log('Loading Sequelize!!!');

const sequelize = new Sequelize('lms_db', 'root', '',{
    host: 'localhost', port: 3305, dialect: 'mysql',
    logging: true,
});
console.log('Sequelize object created:', sequelize instanceof Sequelize);

async function testConnection() {
    console.log('Starting DB Test');
    try {
        await sequelize.authenticate();
        console.log('DB connection works');
    } catch (err) {
        console.error('DB connection failed:', err);
    } finally {
        await sequelize.close();
        console.log('Sequelize connection closed');
    }
}
testConnection();

