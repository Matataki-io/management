/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('assets_minetokens_log', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		from_uid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		},
		to_uid: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: '0'
		},
		token_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		},
		amount: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: false
		},
		ip: {
			type: DataTypes.STRING(50),
			allowNull: true
		}
	}, {
		tableName: 'assets_minetokens_log',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
