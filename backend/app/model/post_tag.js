/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('post_tag', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		sid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false
		},
		tid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false
		}
	}, {
		tableName: 'post_tag',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
