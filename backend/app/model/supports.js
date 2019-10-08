/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('supports', {
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
		signid: {
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
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		platform: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		referreruid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue: '0'
		},
		status: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue: '0'
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		txhash: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'supports',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
