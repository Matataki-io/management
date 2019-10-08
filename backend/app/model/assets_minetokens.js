/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('assets_minetokens', {
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
		token_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false
		},
		amount: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'assets_minetokens',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
