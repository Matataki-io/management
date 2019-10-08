/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('support_quota', {
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
		signid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false
		},
		contract: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		symbol: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		quota: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		}
	}, {
		tableName: 'support_quota',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
