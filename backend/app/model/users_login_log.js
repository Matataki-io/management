/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('users_login_log', {
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
		ip: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		source: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		login_time: {
			type: DataTypes.TIME,
			allowNull: true
		}
	}, {
		tableName: 'users_login_log',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
