/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('assets', {
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
		decimals: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue: '0'
		},
		platform: {
			type: DataTypes.STRING(255),
			allowNull: false
		}
	}, {
		tableName: 'assets',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
