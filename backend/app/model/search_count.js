/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('search_count', {
		id: {
			type: DataTypes.INTEGER(20),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		word: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		update_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		search_count: {
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		search_area: {
			type: DataTypes.INTEGER(8),
			allowNull: true
		}
	}, {
		tableName: 'search_count',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
