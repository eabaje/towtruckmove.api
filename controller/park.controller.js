const db = require('../models/index.model');
const Park = db.park;
const Company = db.company;
const Vehicle = db.vehicle;
const Driver = db.driver;
const Op = db.Sequelize.Op;

// Create and Save a new Park
exports.create = (req, res) => {
  // Validate request

  // Create a Park
  const park = {
    ParkType: req.body.ParkType,
    ParkName: req.body.ParkName,
    FleetType: req.body.FleetType,
    FleetNumber: req.body.FleetNumber,
    AboutUs: req.body.AboutUs,
    ServiceDescription: req.body.ServiceDescription,
    ParkLocation:req.body.ParkLocation,
    Address:req.body.Address,
    Rating: req.body.Rating,
    Latitude:req.body.Latitude,
    Longitude:req.body.Longitude,
    Licensed: req.body.Licensed ? req.body.Licensed : false,
    CompanyId: req.body.CompanyId,
    // ParkDocs: req.body.ParkDocs
  };

  // Save Park in the database
  Park.create(park)

    .then((data) => {
     
      // carrier information
      //create new company info
     
     
      res.status(200).send({
        message: 'Park information added successfully',
        data: data,
      });
    })
    .catch((err) => {
      console.log(`error`, err.message);
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Park.',
      });
    });
};

// Retrieve all Parks from the database.
exports.findAll = (req, res) => {
  const ParkType = req.params.ParkType;
  var condition = ParkType ? { ParkType: { [Op.iLike]: `%${ParkType}%` } } : null;

  // Park.findAll({ where: condition })

  Park.findAll({
    // where: {
    //   condition
    // },
    // attributes: {
    //     exclude: ['createdAt', 'updatedAt']   DairyId: req.query.dairyid
    // },
    include: {
      model: Company,
      attributes: ['CompanyName'],
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Parks.',
      });
    });
};

// sequelize.query("SELECT * FROM `users`", { type: sequelize.QueryTypes.SELECT})
//   .then(function(users) {
//     // We don't need spread here, since only the results will be returned for select queries
//   })

// Find a single Park with an id
exports.findOne = (req, res) => {
  const id = req.params.ParkId;

  Park.findOne({
    where: {
      ParkId: id,
    },

    include: {
      model: Company,
      attributes: ['CompanyName'],
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      console.log(`err`, err);
      res.status(500).send({
        message: 'Error retrieving Park with ParkId=' + id,
      });
    });
};

exports.findAllParksByCompany = (req, res) => {
  const id = req.params.companyId;

  Park.findAll({
    where: { CompanyId: id },

    include: {
      model: Company,
      attributes: ['CompanyName'],
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Parks.',
      });
    });
};


exports.findAllParksByCompany = (req, res) => {
  const id = req.params.companyId;

  Park.findAll({
    where: { CompanyId: id },

    include: {
      model: Company,
      attributes: ['CompanyName'],
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Parks.',
      });
    });
};

exports.findAllParksByLocation = (req, res) => {
  const givenLatitude = req.params.givenLatitude;
  const givenLongitude = req.params.givenLongitude;
  const maxDistance = req.params.maxDistance;
  
  
  Park.findAll({
    attributes: [
      "id",
      "longitude",
      "latitude",
      [
        sequelize.literal(`
          6371 *
          2 *
          ASIN(
            SQRT(
              POWER(SIN(RADIANS((${givenLatitude} - latitude) / 2)), 2) +
              COS(RADIANS(latitude)) * COS(RADIANS(${givenLatitude})) *
              POWER(SIN(RADIANS((${givenLongitude} - longitude) / 2)), 2)
            )
          )
        `),
        "distance",
      ],
    ],
    where: sequelize.where(
      sequelize.literal(`
        6371 *
        2 *
        ASIN(
          SQRT(
            POWER(SIN(RADIANS((${givenLatitude} - latitude) / 2)), 2) +
            COS(RADIANS(latitude)) * COS(RADIANS(${givenLatitude})) *
            POWER(SIN(RADIANS((${givenLongitude} - longitude) / 2)), 2)
          )
        )
      `),
      "<=",
      maxDistance
    ),
    include: {
      model: Vehicle,
      attributes: ['VehicleType','VehicleMake','VehicleColor','PicUrl','Description'],
    },
    order: sequelize.literal("distance ASC"),
  })
    .then((result) => {
      // Process the filtered data
      console.log(result);
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
    });
  }  


// Update a Park by the id in the request
exports.update = (req, res) => {
  const id = req.params.ParkId;

  Park.update(req.body, {
    where: { ParkId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: 'Park was updated successfully.',
        });
      } else {
        res.status(200).send({
          message: `Cannot update Park with id=${id}. Maybe Park was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Park with id=' + id,
      });
    });
};

// Delete a Park with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.ParkId;

  Park.destroy({
    where: { ParkId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: 'Park was deleted successfully!',
        });
      } else {
        res.status(200).send({
          message: `Cannot delete Park with id=${id}. Maybe Park was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Park with id=' + id,
      });
    });
};

// Delete all Parks from the database.
exports.deleteAll = (req, res) => {
  Park.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.status(200).send({ message: `${nums} Parks were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Parks.',
      });
    });
};

// find all insured Park
exports.findAllParksLicensed = (req, res) => {
  Park.findAll({
    where: { Licensed: true },

    include: {
      model: Company,
      attributes: ['CompanyName'],
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Parks.',
      });
    });
};

// find all  Park by date
exports.findAllParksByDate = (req, res) => {
  const startDate = req.params.StartDate;
  const endDate = req.params.EndDate;

  Park.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    order: [['createdAt', 'ASC']],

    include: {
      model: Company,
      attributes: ['CompanyName'],
    },
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Parks.',
      });
    });
};
