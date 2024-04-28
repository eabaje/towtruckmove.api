require('dotenv').config();
const dbConfig = require('../config/db.postgres.config.js');

const env = process.env.NODE_ENV.trim() || 'development';

const config = require(__dirname + '/../config/config.json')[env];

//console.log(process.env[config.use_env_variable]);

const isProduction = process.env.NODE_ENV;

const Sequelize = require('sequelize');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], null, null, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// if (isProduction === 'production') {
// } else {
//   sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,

//     pool: {
//       max: dbConfig.pool.max,
//       min: dbConfig.pool.min,
//       acquire: dbConfig.pool.acquire,
//       idle: dbConfig.pool.idle,
//     },
//   });
// }

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.park = require('./park.model.js')(sequelize, Sequelize);
db.company = require('./company.model.js')(sequelize, Sequelize);
db.companydoc = require('./company.doc.model.js')(sequelize, Sequelize);
db.driver = require('./driver.model.js')(sequelize, Sequelize);
db.vehicle = require('./vehicle.model.js')(sequelize, Sequelize);
db.vehicletowed = require('./vehicle.towed.model.js')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize);
db.role = require('./role.model.js')(sequelize, Sequelize);
db.userrole = require('./user.role.model.js')(sequelize, Sequelize);
//db.shipment = require('./shipment.model.js')(sequelize, Sequelize);
//db.shipmentdetail = require('./shipment.details.model.js')(sequelize, Sequelize);
db.order = require('./order.model.js')(sequelize, Sequelize);
db.payment = require('./payment.model.js')(sequelize, Sequelize);
db.subscribe = require('./subscription.model.js')(sequelize, Sequelize);
db.trip = require('./trip.model.js')(sequelize, Sequelize);
db.track = require('./track.model.js')(sequelize, Sequelize);
//db.trackshipment = require('./track.shipment.model')(sequelize, Sequelize);
db.tracktowrequest = require('./track.towrequest.model')(sequelize, Sequelize);
db.assigndriver = require('./assign.driver.model.js')(sequelize, Sequelize);
//db.assignshipment = require('./assign.shipment.model.js')(sequelize, Sequelize);
db.assigntowrequest = require('./assign.towrequest.model.js')(sequelize, Sequelize);

//db.assigndrivershipment = require('./assign.driver.shipment.model.js')(sequelize, Sequelize);
db.assigndrivertowrequest = require('./assign.driver.towrequest.model.js')(sequelize, Sequelize);
db.usersubscription = require('./user.subscription.model.js')(sequelize, Sequelize);
db.insurance = require('./insurance.model.js')(sequelize, Sequelize);
db.interested = require('./shipment.interested.model.js')(sequelize, Sequelize);
db.interestedtowrequest = require('./interested.towrequest.model.js')(sequelize, Sequelize);
db.media = require('./media.model.js')(sequelize, Sequelize);
db.review = require('./review.model.js')(sequelize, Sequelize);
db.towrequest=require('./tow.request.model.js')(sequelize, Sequelize);

//db.assignshipment = require('./assign.shipment.model.js')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: 'UserRoles',
  foreignKey: 'RoleId',
  otherKey: 'UserId',
});

db.user.belongsToMany(db.role, {
  through: 'UserRoles',
  foreignKey: 'UserId',
  otherKey: 'RoleId',
});

db.driver.belongsToMany(db.vehicle, {
  through: 'AssignDrivers',
  foreignKey: 'DriverId',
  otherKey: 'VehicleId',
});

db.vehicle.belongsToMany(db.driver, {
  through: 'AssignDrivers',
  foreignKey: 'VehicleId',
  otherKey: 'DriverId',
});
// db.trip.hasMany(db.shipment, { as: 'Shipments' });
// db.shipment.belongsTo(db.shipment, {
//   foreignKey: 'TripId',
//   as: 'Trips',
// });

// db.role.hasMany(db.userrole, { foreignKey: { name: 'RoleId' } });
// db.userrole.belongsTo(db.role);

// db.user.hasMany(db.userrole, { foreignKey: { name: 'UserId' } });
// db.userrole.belongsTo(db.user);

db.vehicle.hasOne(db.trip, { foreignKey: 'VehicleId' });
db.trip.belongsTo(db.vehicle, { foreignKey: 'VehicleId' });

db.driver.hasOne(db.trip, { foreignKey: 'DriverId' });
db.trip.belongsTo(db.driver, { foreignKey: 'DriverId' });

// db.AssignDriver.hasMany(db.driver, { foreignKey: { name: 'DriverId' } });
// db.driver.belongsTo(db.AssignDriver , { foreignKey: { name: 'AssignId' } });

// db.driver.hasMany(db.vehicle, { foreignKey: { name: 'VehicleId' } });
// db.vehicle.belongsTo(db.driver , { foreignKey: { name: 'DriverId' } });

db.company.hasMany(db.park, { foreignKey: 'CompanyId' });
db.park.belongsTo(db.company, { foreignKey: 'CompanyId' });



db.park.hasMany(db.vehicle, { foreignKey: 'ParkId' });
db.vehicle.belongsTo(db.park, { foreignKey: 'ParkId' });

// db.park.hasMany(db.vehicletowed, { foreignKey: 'ParkId' });
// db.vehicletowed.belongsTo(db.park, { foreignKey: 'ParkId' });

db.company.hasMany(db.vehicle, { foreignKey: 'CompanyId' });
db.vehicle.belongsTo(db.company, { foreignKey: 'CompanyId' });

db.company.hasOne(db.user, { foreignKey: 'CompanyId' });
db.user.belongsTo(db.company, { foreignKey: 'CompanyId' });

db.company.hasMany(db.driver, { foreignKey: 'CompanyId' });
db.driver.belongsTo(db.company, { foreignKey: 'CompanyId' });

db.park.hasMany(db.driver, { foreignKey: 'ParkId' });
db.driver.belongsTo(db.company, { foreignKey: 'ParkId' });

// db.company.hasOne(db.driver, { foreignKey:'fk_CompanyId' });


db.subscribe.hasMany(db.usersubscription, { foreignKey: 'SubscribeId' });
db.usersubscription.belongsTo(db.subscribe, { foreignKey: 'SubscribeId' });

db.user.hasMany(db.usersubscription, { foreignKey: 'UserId' });
db.usersubscription.belongsTo(db.user, { foreignKey: 'UserId' });

// db.shipment.hasMany(db.shipmentdetail, { foreignKey: 'ShipmentId' });
// db.shipmentdetail.belongsTo(db.shipment, { foreignKey: 'ShipmentId' });

// db.shipment.hasMany(db.interested, { foreignKey: 'ShipmentId' });
// db.interested.belongsTo(db.shipment, { foreignKey: 'ShipmentId' });

db.company.hasMany(db.interested, { foreignKey: 'CompanyId' });
db.interested.belongsTo(db.company, { foreignKey: 'CompanyId' });

db.driver.hasOne(db.review, { foreignKey: 'DriverId' });
db.review.belongsTo(db.driver, { foreignKey: 'DriverId' });

// db.user.hasMany(db.shipment, { foreignKey: 'UserId' });
// db.shipment.belongsTo(db.user, { foreignKey: 'UserId' });

db.company.hasOne(db.assigndrivertowrequest, { foreignKey: 'CompanyId' });
db.assigndrivertowrequest.belongsTo(db.company, { foreignKey: 'CompanyId' });

db.company.hasOne(db.assigntowrequest, { foreignKey: 'CompanyId' });
db.assigntowrequest.belongsTo(db.company, { foreignKey: 'CompanyId' });

// db.shipment.hasOne(db.assignshipment, { foreignKey: 'ShipmentId' });
// db.assignshipment.belongsTo(db.shipment, { foreignKey: 'ShipmentId' });

db.towrequest.hasOne(db.assigntowrequest, { foreignKey: 'TowRequestId' });
db.assigntowrequest.belongsTo(db.towrequest, { foreignKey: 'TowRequestId' });

// db.interested.hasOne(db.assignshipment, { foreignKey: 'ShipmentInterestId' });
// db.assignshipment.belongsTo(db.interested, { foreignKey: 'ShipmentInterestId' });

db.interestedtowrequest.hasOne(db.towrequest, { foreignKey: 'TowRequestInterestId' });
db.towrequest.belongsTo(db.interestedtowrequest, { foreignKey: 'TowRequestInterestId' });

db.driver.hasOne(db.assigndrivertowrequest, { foreignKey: 'DriverId' });
db.assigndrivertowrequest.belongsTo(db.driver, { foreignKey: 'DriverId' });



// db.shipment.hasOne(db.assigndrivershipment, { foreignKey: 'ShipmentId' });
// db.assigndrivershipment.belongsTo(db.shipment, { foreignKey: 'ShipmentId' });

// db.user.hasOne(db.assignshipment, { foreignKey: 'UserId' });
// db.assignshipment.belongsTo(db.user, { foreignKey: 'UserId' });

db.user.hasOne(db.assigntowrequest, { foreignKey: 'UserId' });
db.assigntowrequest.belongsTo(db.user, { foreignKey: 'UserId' });

db.user.hasOne(db.assigndrivertowrequest, { foreignKey: 'UserId' });
db.assigndrivertowrequest.belongsTo(db.user, { foreignKey: 'UserId' });

// db.shipment.hasOne(db.trip, { foreignKey: 'ShipmentId' });
// db.trip.belongsTo(db.shipment, { foreignKey: 'ShipmentId' });

// db.shipment.hasMany(db.track, { foreignKey: 'ShipmentId' });
// db.track.belongsTo(db.shipment, { foreignKey: 'ShipmentId' });

db.towrequest.hasMany(db.tracktowrequest, { foreignKey: 'TowRequestId' });
db.tracktowrequest.belongsTo(db.towrequest, { foreignKey: 'TowRequestId' });

db.company.hasMany(db.tracktowrequest, { foreignKey: 'CompanyId' });
db.tracktowrequest.belongsTo(db.company, { foreignKey: 'CompanyId' });

db.user.hasMany(db.tracktowrequest, { foreignKey: 'UserId' });
db.tracktowrequest.belongsTo(db.user, { foreignKey: 'UserId' });

db.assigntowrequest.hasMany(db.tracktowrequest, { foreignKey: 'AssignTowRequestId' });
db.tracktowrequest.belongsTo(db.assigntowrequest, { foreignKey: 'AssignTowRequestId' });

db.towrequest.hasOne(db.assigntowrequest, { foreignKey: 'TowRequestId' });
db.assigntowrequest.belongsTo(db.towrequest, { foreignKey: 'TowRequestId' });

db.user.hasMany(db.payment, { foreignKey: 'UserId' });
db.payment.belongsTo(db.user, { foreignKey: 'UserId' });

db.user.hasOne(db.assigntowrequest, { foreignKey: 'UserId' });
db.assigntowrequest.belongsTo(db.user, { foreignKey: 'UserId' });

db.user.hasOne(db.driver, { foreignKey: 'UserId' });
db.driver.belongsTo(db.user, { foreignKey: 'UserId' });

db.user.hasOne(db.interestedtowrequest, { foreignKey: 'UserId' });
db.interestedtowrequest.belongsTo(db.user, { foreignKey: 'UserId' });

// db.trip.hasMany(db.track, { foreignKey: 'TripId' });
// db.track.belongsTo(db.trip, { foreignKey: 'TripId' });

db.trip.hasMany(db.tracktowrequest, { foreignKey: 'TripId' });
db.tracktowrequest.belongsTo(db.trip, { foreignKey: 'TripId' });

db.user.hasMany(db.trip, { foreignKey: 'UserId' });
db.trip.belongsTo(db.user, { foreignKey: 'UserId' });

// db.user.hasMany(db.track, { foreignKey: 'UserId' });
// db.track.belongsTo(db.user, { foreignKey: 'UserId' });

db.user.hasMany(db.tracktowrequest, { foreignKey: 'UserId' });
db.tracktowrequest.belongsTo(db.user, { foreignKey: 'UserId' });

db.user.hasMany(db.towrequest, { foreignKey: 'UserId' });
db.towrequest.belongsTo(db.user, { foreignKey: 'UserId' });

db.park.hasOne(db.towrequest, { foreignKey: 'ParkId' });
db.towrequest.belongsTo(db.park, { foreignKey: 'ParkId' });

db.vehicle.hasOne(db.towrequest, { foreignKey: 'VehicleId' });
db.towrequest.belongsTo(db.vehicle, { foreignKey: 'VehicleId' });

db.driver.hasOne(db.towrequest, { foreignKey: 'ParkId' });
db.towrequest.belongsTo(db.driver, { foreignKey: 'ParkId' });

// db.company.hasMany(db.shipment, { foreignKey: 'CompanyId' });
// db.shipment.belongsTo(db.company, { foreignKey: 'CompanyId' });

db.company.hasMany(db.towrequest, { foreignKey: 'CompanyId' });
db.towrequest.belongsTo(db.company, { foreignKey: 'CompanyId' });

//db.shipment.belongsTo(db.interested, {foreignKey: 'UserId'});

db.ROLES = ['customer', 'admin', 'auditor', 'driver', 'park','sysadmin'];

module.exports = db;
