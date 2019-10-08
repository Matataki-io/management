/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('product_stock_keys', {
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
		sku: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		digital_copy: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		support_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		order_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'product_stock_keys',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
