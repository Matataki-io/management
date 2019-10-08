/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('exchange_balances', {
		id: {
			type: DataTypes.INTEGER(11),
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
		liquidity_balance: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: false
		}
	}, {
		tableName: 'exchange_balances',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
