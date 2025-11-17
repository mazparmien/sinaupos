import { DataTypes } from "sequelize";

const SettingModel = (sequelize) => {
  const Setting = sequelize.define(
    "Setting",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "settings",
      timestamps: false, 
      paranoid: true,   // untuk soft delete
    }
  );

  return Setting;
};

export default SettingModel;
