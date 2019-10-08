/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('drafts', {
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
		content: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue: '0'
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		update_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		fission_factor: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '2000'
		},
		cover: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		is_original: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		tags: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: ''
		},
		comment_pay_point: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'drafts',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
