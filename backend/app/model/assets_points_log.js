/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('assets_points_log', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		uid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		},
		sign_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false
		},
		amount: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		ip: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		reading_time: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		},
		status: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '1'
		}
	}, {
		tableName: 'assets_points_log',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
