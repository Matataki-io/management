/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('ads', {
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
		title: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		url: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		link: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		content: {
			type: DataTypes.TEXT,
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
		hash: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
			unique: true
		}
	}, {
		tableName: 'ads',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
