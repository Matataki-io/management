/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('follows', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		followed: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '1'
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		uid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true
		},
		fuid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true
		}
	}, {
		tableName: 'follows',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
