/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('exchange_orders', {
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
		cny_amount: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		token_amount: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		trade_no: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		openid: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: false
		},
		pay_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		ip: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		deadline: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		min_liquidity: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		max_tokens: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		min_tokens: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: '0'
		},
		recipient: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'exchange_orders',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
