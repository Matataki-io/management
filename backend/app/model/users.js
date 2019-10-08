/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('users', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		nickname: {
			type: DataTypes.STRING(100),
			allowNull: true,
			unique: true
		},
		avatar: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		platform: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		introduction: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		accept: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		source: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: 'ss'
		},
		reg_ip: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		last_login_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		password_hash: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		is_recommend: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		referral_uid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		},
		last_login_ip: {
			type: DataTypes.STRING(50),
			allowNull: true,
			defaultValue: ''
		},
		level: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'users',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
