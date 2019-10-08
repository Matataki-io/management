/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('orange_actions', {
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
		act_receiver: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		act_data: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		user: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		amount: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		}
	}, {
		tableName: 'orange_actions',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
