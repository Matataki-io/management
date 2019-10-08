/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('tags', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		type: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: 'post'
		}
	}, {
		tableName: 'tags',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
