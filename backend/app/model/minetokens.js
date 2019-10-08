/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('minetokens', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		uid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			unique: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		symbol: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		decimals: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: false
		},
		total_supply: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		logo: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'minetokens',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
