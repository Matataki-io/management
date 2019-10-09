const EggSequelizeAuto = require('egg-sequelize-auto')
const auto = new EggSequelizeAuto('ssp_test', 'ssp_test@kyubeydb', 'f0e8619dc0e4483da533472f32dadf55', {
    host: 'kyubeydb.mysql.database.azure.com',
    dialect: 'mysql',
    port: '3306',
    dialectOptions: {
        multipleStatements: true,
        ssl: {
			rejectUnauthorized: false,
	    }
    },
    additional: {
        timestamps: false,
    },
});
auto.run(function (err) {
    if (err) throw err;

    console.log(auto.tables); // table list
    console.log(auto.foreignKeys); // foreign key list
});