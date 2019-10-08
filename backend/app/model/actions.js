/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('actions', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		act_account: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		act_name: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		act_data: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		author: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		memo: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		amount: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		sign_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue: '0'
		},
		type: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		}
	}, {
		tableName: 'actions',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
