/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('post_transfer_log', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		postid: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		fromuid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false
		},
		touid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		}
	}, {
		tableName: 'post_transfer_log',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
