/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('product_prices', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		sign_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		sku: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		stock_quantity: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		platform: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		symbol: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		decimals: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'product_prices',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
