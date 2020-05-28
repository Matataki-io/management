/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('_admin_user', {
		id: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		nickname: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		wallet: {
			type: DataTypes.CHAR(42),
			allowNull: true
		},
		password: {
			type: DataTypes.CHAR(64),
			allowNull: false
		},
	}, {
		tableName: '_admin_user',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
