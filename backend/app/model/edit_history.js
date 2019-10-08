/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('edit_history', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		sign_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue: '0'
		},
		hash: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		sign: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		cover: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		public_key: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		is_original: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'edit_history',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
