module.exports = (sequelize, DataTypes) => {
  const AssignDriverTowRequest = sequelize.define('AssignDriverTowRequests', {
    AssignDriverTowRequestId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    // VehicleId: { type: DataTypes.STRING },
    // DriverId: { type: DataTypes.STRING, default: null },
    IsAssigned: { type: DataTypes.BOOLEAN },

    AssignedDate: { type: DataTypes.DATE },

    AssignedToDriver: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },

    // VehicleId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Vehicle,
    //     key: 'VehicleId'
    //   }
    // },

    // DriverId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Driver,
    //     key: 'DriverId'
    //   }
    // },
  });

  return AssignDriverTowRequest;
};
