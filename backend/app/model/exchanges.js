/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('exchanges', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		token_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			unique: true
		},
		total_supply: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		create_time: {
			type: DataTypes.DATE,
			allowNull: false
		},
		exchange_uid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false
		}
	}, {
		tableName: 'exchanges',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
