/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('assets_change_log', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		uid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false
		},
		contract: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		symbol: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		amount: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: '0'
		},
		signid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true
		},
		platform: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		type: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		toaddress: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: ''
		},
		memo: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: ''
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '2'
		},
		trx: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: ''
		}
	}, {
		tableName: 'assets_change_log',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
