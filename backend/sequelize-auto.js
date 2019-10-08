const EggSequelizeAuto = require('egg-sequelize-auto')
const auto = new EggSequelizeAuto('ssp_prod', 'ssp@kyubeydb', '6c651cd2d3bb4900a722e7bfba3f7375', {
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