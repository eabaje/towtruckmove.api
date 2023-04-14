module.exports = (sequelize, DataTypes) => {
  const VehicleTowed = sequelize.define('VehicleTowed', {
    VehicleTowedId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    // CarrierId: { type: DataTypes.STRING },
    VehicleType: { type: DataTypes.STRING, default: null },
    VehicleNumber: { type: DataTypes.STRING },
    SerialNumber: { type: DataTypes.STRING },
    VehicleMake: { type: DataTypes.STRING },
    VehicleColor: { type: DataTypes.STRING },
    VehicleModel: { type: DataTypes.STRING },
    LicensePlate: { type: DataTypes.STRING },
    VehicleModelYear: { type: DataTypes.DATEONLY },
    PurchaseYear: { type: DataTypes.DATEONLY },
    Insured: { type: DataTypes.BOOLEAN },
    PicUrl: { type: DataTypes.STRING },
    Description: { type: DataTypes.STRING },
    longitude: { type: DataTypes.STRING },
    latitude: { type: DataTypes.STRING },
    IncidentLocation: { type: DataTypes.STRING },
    Destination: { type: DataTypes.STRING },

    VehicleDocs: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
    // CarrierId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Carrier,
    //     key: 'CarrierId'
    //   }
    // },
  });

  return VehicleTowed;
};
