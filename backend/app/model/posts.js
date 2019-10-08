/* indent size: 1 */

module.exports = app => {
	const DataTypes = app.Sequelize;

	const Model = app.model.define('posts', {
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
		author: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		short_content: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		hash: {
			type: DataTypes.STRING(100),
			allowNull: true,
			unique: true
		},
		sign: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		public_key: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue: '0'
		},
		onchain_status: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue: '0'
		},
		create_time: {
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
		platform: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		is_original: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		channel_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '1'
		},
		fission_rate: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '100'
		},
		referral_rate: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		uid: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true
		},
		is_recommend: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		category_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		hot_score: {
			type: DataTypes.FLOAT,
			allowNull: true,
			defaultValue: '0.00'
		},
		comment_pay_point: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		},
		time_down: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'posts',
		timestamps: false
	});

	Model.associate = function() {

	}

	return Model;
};
