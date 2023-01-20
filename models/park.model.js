// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   CompanyId: { type: Number },
//   ParkType: { type: String, default: null },
//   FleetType: { type: String, unique: true },
//   FleetNumber: { type: String },
//   Licensed: { type: Boolean },
//   AboutUs: { type: String },
//   ServiceDescription: { type: String },
//   Rating: { type: Number },
// });

// module.exports = mongoose.model("Park", userSchema);

//Company = require('./company.model.js')

module.exports = (sequelize, DataTypes) => {
  const Park = sequelize.define('Parks', {
    ParkId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    // CompanyId: { type: DataTypes.INTEGER },
    ParkType: { type: DataTypes.STRING },
    ParkLocation: { type: DataTypes.STRING },
    Longitude: { type: DataTypes.STRING },
    Latitude: { type: DataTypes.STRING },
    FleetType: { type: DataTypes.STRING },
    FleetNumber: { type: DataTypes.STRING },
    AboutUs: { type: DataTypes.STRING },
    ServiceDescription: { type: DataTypes.STRING },
    Rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    Licensed: { type: DataTypes.BOOLEAN },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },

    // CompanyId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Company,
    //     key: 'CompanyId',
    //     onUpdate: 'cascade',
    //     onDelete: 'cascade'
    //   }
    // }
  });

  return Park;
};
