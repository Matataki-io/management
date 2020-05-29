/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('_admin_action_logs', {
		id: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		uid: {
            type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: false
        },
        timestamp: {
            type: DataTypes.DECIMAL(20, 0),
			allowNull: false
        },
        data: {
            type: DataTypes.TEXT,
            allowNull: false
        }
	}, {
		tableName: '_admin_action_logs',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
