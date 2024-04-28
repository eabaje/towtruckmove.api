const db = require('../models/index.model');
const { mailFunc } = require('../middleware');
const { TRIP_STATUS, ROLES, TRACK_SHIPMENT_STATUS } = require('../enum');
const TowRequest = db.towrequest;
const TowRequestDetail = db.towRequestdetail;
const TowRequestInterested = db.interestedtowrequest;
const User = db.user;
const Driver = db.driver;
const Company = db.company;
const Interested = db.interested;
const AssignDriverTowRequest = db.assigndrivertowrequest;
const AssignTowRequest = db.assigntowrequest;
const TrackTowRequest = db.tracktowrequest;
//AssignDriverTowRequest

const Op = db.Sequelize.Op;

// Create and Save a new TowRequest
exports.create = async (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  try {
    // Create a TowRequest
   

    const towrequest = {
      VehicleType: req.body.VehicleType,
      UserId: req.body.UserId,
      VehicleNumber: req.body.VehicleNumber,
      SerialNumber: req.body.SerialNumber,
      VehicleMake: req.body.VehicleMake ,
      VehicleColor: req.body.VehicleColor,
      LicensePlate: req.body.LicensePlate ,
      VehicleModel: req.body.VehicleModel,
      VehicleModelYear: req.body.VehicleModelYear,

      PicUrl: req.body.PicUrl,
      Description: req.body.Description,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      IncidentLocation: req.body.IncidentLocation,
      
      IsApproved: req.body.IsApproved,
      Comment: req.body.DeliveryCity,

      Insured: req.body.Insured,
      TowRequestPrice: req.body.TowRequestPrice,

      TowRequestDate: req.body.TowRequestDate,
      TowRequestDocs: req.body.TowRequestDocs,
      TowRequestStatus: req.body.TowRequestStatus,
      ParkId: req.body.ParkId,
      AssignedDriverId: req.body.AssignedDriverId,
    };
    console.log('request.body', req.body);
    // Save TowRequest in the database

    const newTowRequest = await TowRequest.create(towrequest);

    if (newTowRequest) {
     

      return res.status(200).send({
        message: 'TowRequest was added successfully',
        data: newTowRequest,
      });
    }
  } catch (error) {
    console.log('error:', error.message);
    return res.status(500).send({
      message: error.message || 'Some error occurred while creating the TowRequest.',
    });
  }
};

// Retrieve all TowRequests start the database.
exports.findAll = (req, res) => {
  const UserId = req.params.userId;
  // const id = req.params.companyId;
  var condition = UserId ? { UserId: UserId } : null;

  TowRequest.findAll({
    where: condition,

    include: [
      // {
      //   model: TowRequestDetail,
      // },

      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: AssignDriverTowRequest,
      },
      {
        model: AssignTowRequest,
      },
      {
        model: TowRequestInterested,
      },

      {
        model: TrackTowRequest,
      },

      {
        model: User,
        attributes: ['FullName', 'Email', 'Phone'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

// Find a single TowRequest with an id
exports.findOne = (req, res) => {
  const id = req.params.towRequestId;

  TowRequest.findOne({
    where: { TowRequestId: id },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
        attributes: ['CompanyName'],
      },
      {
        model: AssignDriverTowRequest,
      },
      {
        model: AssignTowRequest,
      },
      {
        model: TowRequestInterested,
      },
      // {
      //   model: TowRequestDetail,
      // },
    ],
  })
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving TowRequest with TowRequestId=' + id,
      });
    });
};





// Update a TowRequest by the id in the request
exports.update = (req, res) => {
  const id = req.params.towRequestId;

  TowRequest.update(req.body, {
    where: { TowRequestId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'TowRequest was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update TowRequest with id=${id}. Maybe TowRequest was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log('id', id);
      console.log('err', err);
      res.status(500).send({
        message: 'Error updating TowRequest with id=' + id,
      });
    });
};

// Delete a TowRequest with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.TowRequestId;

  TowRequest.destroy({
    where: { TowRequestId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'TowRequest was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete TowRequest with id=${id}. Maybe TowRequest was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete TowRequest with id=' + id,
      });
    });
};

// Delete all TowRequests start the database.
exports.deleteAll = (req, res) => {
  TowRequest.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} TowRequests were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all TowRequests.',
      });
    });
};

// find all insured TowRequest
exports.findAllTowRequestsByStatus = (req, res) => {
  const status = req.params.towRequestStatus;
  const towRequestId = req.params.towRequestId;
  var condition = towRequestId
    ? { [Op.and]: [{ TowRequestId: towRequestId }, { TowRequestStatus: status }] }
    : { TowRequestStatus: status };

  TowRequest.findAll({
    where: {
      condition,
    },
    // include: [
    //   {
    //     model: TowRequestDetail,
    //   },
    // ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

exports.findAllTowRequestsAssigned = (req, res) => {
  const status = req.params.towRequestStatus;
  const assignedtowRequest = req.params.assignedtowRequest;
  const towRequestId = req.params.towRequestId;
  var condition = towRequestId
    ? { [Op.and]: [{ TowRequestId: towRequestId }, { AssignedTowRequest: assignedtowRequest }] }
    : { TowRequestStatus: status };

  // TowRequest.findAll({ where: condition },
  TowRequest.findAll({
    where: {
      condition,
    },
    // include: [
    //   {
    //     model: TowRequestDetail,
    //   },
    // ],
  })
    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

// find all  TowRequest by date
exports.findAllTowRequestsByDeliveryDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  TowRequest.findAll({
    where: {
      DeliveryDate: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    // include: [
    //   {
    //     model: TowRequestDetail,
    //   },
    // ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

exports.findAllTowRequestsByPickUpDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  TowRequest.findAll({
    where: {
      PickUpDate: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    // include: [
    //   {
    //     model: TowRequestDetail,
    //   },
    // ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

exports.findAllTowRequestsByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  TowRequest.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },
    // include: [
    //   {
    //     model: TowRequestDetail,
    //   },
    // ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

// Create and Save a new TowRequest
exports.create1 = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }

  // Create a TowRequest
  const towRequest = {
    UserId: req.body.UserId,
    LoadCategory: req.body.LoadCategory,
    LoadType: req.body.LoadType,
    LoadWeight: req.body.LoadWeight,
    LoadUnit: req.body.LoadUnit,
    Qty: req.body.Qty,
    Description: req.body.Description,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryLocation: req.body.DeliveryLocation,
    PickUpCountry: req.body.PickUpCountry,
    PickUpRegion: req.body.PickUpRegion,
    PickUpCity: req.body.PickUpCity,
    PickUpLocation: req.body.PickUpLocation,
    DeliveryCountry: req.body.DeliveryCountry,
    DeliveryRegion: req.body.DeliveryRegion,
    DeliveryCity: req.body.DeliveryCity,
    DeliveryLocation: req.body.DeliveryLocation,
    ExpectedPickUpDate: req.body.ExpectedPickUpDate,
    ExpectedDeliveryDate: req.body.ExpectedDeliveryDate,
    RequestForTowRequest: req.body.RequestForTowRequest,
    TowRequestRequestPrice: req.body.TowRequestRequestPrice,
    DeliveryContactName: req.body.DeliveryContactName,
    DeliveryContactPhone: req.body.DeliveryContactPhone,
    DeliveryEmail: req.body.DeliveryEmail,
    AssignedTowRequest: req.body.AssignedTowRequest,
    TowRequestDate: req.body.TowRequestDate,
    TowRequestDocs: req.body.TowRequestDocs,
    TowRequestStatus: req.body.TowRequestStatus,
  };

  // Save TowRequest in the database
  TowRequest.create(towRequest)
    .then((data) => {
      res.status(200).send({
        message: 'TowRequest was added successfully',
        data: data,
      });
    })
    .catch((err) => {
      console.log('error:', err.message);
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the TowRequest.',
      });
    });
};

exports.showInterest = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const TowRequestId = req.body.TowRequestId;

  // const InterestDate = req.body.InterestDate;

  try {
    const InterestedResult = await Interested.findOne({
      where: { TowRequestId: TowRequestId, CompanyId: CompanyId, UserId: UserId },
    });

    const company = await Company.findOne({ where: { CompanyId: CompanyId } });

    const towRequestUser = await TowRequest.findOne({
      where: { TowRequestId: req.body.TowRequestId },
      include: [
        {
          model: User,
          attributes: ['FullName', 'Email'],
        },
      ],
    });

    if (InterestedResult === null) {
      // create new interest
      const newRecord = await Interested.create({
        TowRequestId: TowRequestId,
        UserId: UserId,
        CompanyId: CompanyId,
        IsInterested: true,
        InterestDate: new Date(),
      });

      const trackTowRequest = await TrackTowRequest.create({
        TowRequestId: TowRequestId,
        UserId: UserId,
        CompanyId: CompanyId,
        //  AssignTowRequestId: IsAssignedTowRequest.AssignTowRequestId ? IsAssignedTowRequest.AssignTowRequestId : null,
        StartBy: UserId,
        StartByRole: ROLES.find((item) => item.value === 'carrier').value,
        StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Interested').value,
        StartActionDate: new Date(),
        EndBy: UserId,
        EndByRole: ROLES.find((item) => item.value === 'carrier').value,
        EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Interested').value,
        EndActionDate: new Date(),
      });
      const interestedUser = await User.findOne({ where: { UserId: req.body.UserId } });

      const url = process.env.ADMIN_URL + `/company/review-company-action/?companyId=${CompanyId}&readOnly=true`;

      //Send mail to TowRequest Owner
      const msgTowRequest = `You have an interest from  ${interestedUser.FullName} for Load Boarding Services.Kindly click the button below to check  the profile`;

      await mailFunc.sendEmail({
        template: 'interest',
        subject: 'Request for LoadBoarding Services',
        toEmail: towRequestUser.User.Email,
        msg: {
          name: towRequestUser.User.FullName,
          msg: msgTowRequest,
          url: url,
        },
      });

      //Send Mail to interested carrier
      const msgCarrier = `Your interest in towRequest with ref:${req.body.TowRequestId} for Load Boarding Services has been sent.We wish you best luck going further in the process.`;

      await mailFunc.sendEmail({
        template: 'interest',
        subject: 'Request for LoadBoarding Services',
        toEmail: interestedUser.Email,
        msg: {
          name: interestedUser.FullName,
          msg: msgCarrier,
          //  url: url,
        },
      });

      res.status(200).send({
        message: 'Shown Interest',
        data: newRecord,
      });
    } else {
      //Restore Interest in TowRequest
      const IsInterestedResult = await Interested.findOne({
        where: { TowRequestId: TowRequestId, CompanyId: CompanyId, UserId: UserId, IsInterested: false },
      });

      const IsAssignedTowRequest = await AssignTowRequest.findOne({
        where: { TowRequestId: TowRequestId, CompanyId: CompanyId },
      });

      if (IsInterestedResult) {
        const updatedInterestTrue = await Interested.update(
          { IsInterested: true },
          { where: { TowRequestId: TowRequestId, UserId: UserId, CompanyId: CompanyId } },
        );

        const trackTowRequest = await TrackTowRequest.create({
          TowRequestId: TowRequestId,
          UserId: UserId,
          CompanyId: CompanyId,
          //  AssignTowRequestId: IsAssignedTowRequest.AssignTowRequestId ? IsAssignedTowRequest.AssignTowRequestId : null,
          StartBy: UserId,
          StartByRole: ROLES.find((item) => item.value === 'carrier').value,
          StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'RestoredInterest').value,
          StartActionDate: new Date(),
          EndBy: UserId,
          EndByRole: ROLES.find((item) => item.value === 'carrier').value,
          EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'RestoredInterest').value,
          EndActionDate: new Date(),
        });

        res.status(200).send({
          message: 'Restored Interest',
          data: updatedInterestTrue,
        });

        // **********************************
      } else {
        //check if carrier is already assigned towRequest

        const IsAssignedTowRequest = await AssignTowRequest.findOne({
          where: { TowRequestId: TowRequestId, CompanyId: CompanyId },
        });

        if (IsAssignedTowRequest) {
          const updateTowRequest = await TowRequest.update(
            {
              AssignedTowRequest: false,
              TowRequestStatus: TRIP_STATUS.find((item) => item.value === 'NotAssigned').value,
              AssignedCarrier: 0,
            },

            { where: { TowRequestId: TowRequestId } },
          );

          IsAssignedTowRequest.IsAssigned = false;
          IsAssignedTowRequest.save();
          //Send Mail to Shipper

          const msgShipper = ` Interest for  TowRequest with ref:${req.body.TowRequestId} from ${company.CompanyName} for Load Boarding Services has been withdrawn.Your towRequest is now open for interest.`;

          await mailFunc.sendEmail({
            template: 'interest',
            subject: 'Request for LoadBoarding Services',
            toEmail: towRequestUser.User.Email,
            msg: {
              name: towRequestUser.User.FullName,
              msg: msgShipper,
              //  url: url,
            },
          });
        }

        const updatedInterestFalse = await Interested.update(
          { IsInterested: false },
          { where: { TowRequestId: TowRequestId, UserId: UserId, CompanyId: CompanyId } },
        );

        const trackTowRequest = await TrackTowRequest.create({
          TowRequestId: TowRequestId,
          UserId: UserId,
          CompanyId: CompanyId,
          //  AssignTowRequestId: IsAssignedTowRequest.AssignTowRequestId ? IsAssignedTowRequest.AssignTowRequestId : null,
          StartBy: UserId,
          StartByRole: ROLES.find((item) => item.value === 'carrier').value,
          StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'NotInterested').value,
          StartActionDate: new Date(),
          EndBy: UserId,
          EndByRole: ROLES.find((item) => item.value === 'carrier').value,
          EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'NotInterested').value,
          EndActionDate: new Date(),
        });

        res.status(200).send({
          message: 'Withdrawn Interest',
          data: updatedInterestFalse,
        });
      }
    }
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.assignCompanyTowRequest = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const TowRequestId = req.body.TowRequestId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if interest is placed by company
    const IsInterested = await Interested.findOne({
      where: { TowRequestId: TowRequestId, CompanyId: CompanyId, IsInterested: true },
    });

    if (!IsInterested) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedTowRequest.CompanyId } });
      res.status(200).send({
        message: `No interest placed on TowRequest with ref ${TowRequestId} from ${company.CompanyName}`,
      });
    }

    // check if towRequest was assigned to company
    const IsAssignedTowRequest = await AssignTowRequest.findOne({
      where: { TowRequestId: TowRequestId, IsAssigned: true },
    });
    if (IsAssignedTowRequest) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedTowRequest.CompanyId } });
      res.status(200).send({
        message: `TowRequest with ref ${TowRequestId} has been officially assigned to ${company.CompanyName}`,
      });
    }

    const newAssignment = await AssignTowRequest.create({
      TowRequestId: TowRequestId,
      CompanyId: CompanyId,
      UserId: UserId,
      AssignedTo: CompanyId,
      IsAssigned: true,
      IsContractSigned: false,
      IsContractAccepted: false,
      TowRequestInterestId: IsInterested.TowRequestInterestId,
      AssignedDate: new Date(),
    });

    const updateTowRequest = await TowRequest.update(
      {
        AssignedTowRequest: true,
        TowRequestStatus: TRIP_STATUS.find((item) => item.value === 'Assigned').value,
        AssignedCarrier: CompanyId,
      },

      { where: { TowRequestId: TowRequestId } },
    );

    const trackTowRequest = await TrackTowRequest.create({
      TowRequestId: TowRequestId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignTowRequestId: newAssignment.AssignTowRequestId,
      StartBy: UserId,
      StartByRole: ROLES.find((item) => item.value === 'shipper').value,
      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Assigned').value,
      StartActionDate: new Date(),
      EndBy: UserId,
      EndByRole: ROLES.find((item) => item.value === 'shipper').value,
      EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Assigned').value,
      EndActionDate: new Date(),
    });

    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const user = await User.findOne({ where: { UserId: req.body.UserId } });

    const companyCarrier = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const url = process.env.ADMIN_URL + `/towRequest/assign-towRequest/?towRequestId=${TowRequestId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgTowRequest = `You have assigned TowRequest with Ref No  ${TowRequestId} for Load Boarding Services to Company ${companyCarrier.CompanyName}.Kindly check the details    `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Request for LoadBoarding Services',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgTowRequest,
        url: url,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = `Congratulations! You have been assigned towRequest with ref:${TowRequestId} for Load Boarding Services .Find Attached an agreement for you to sign.Kindly check the details `;
    const urlCarrier =
      process.env.ADMIN_URL +
      `/user/user-contract/?towRequestId=${TowRequestId}&userId=${UserId}&companyId=${CompanyId}&action=sign`;
    await mailFunc.sendEmail({
      template: 'towRequest',
      subject: 'TowRequest Assignment for LoadBoarding Services',
      toEmail: companyCarrier.ContactEmail,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        urlTowRequestInfo: url,
        urlTowRequestContract: urlCarrier,
      },
      filename: 'shipper_carrier_agreement.pdf',
    });

    res.status(200).send({
      message: `TowRequest with Ref ${TowRequestId} has been assigned to Company ${companyCarrier.CompanyName} `,
      // data: newAssignment,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.assignDriverTowRequest = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const DriverId = req.body.DriverId;
  const TowRequestId = req.body.TowRequestId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if towRequest was assigned to company

    const IsAssignedTowRequest = await AssignTowRequest.findOne({
      where: { CompanyId: CompanyId, TowRequestId: TowRequestId },
    });
    if (IsAssignedTowRequest === null) {
      res.status(200).send({
        message: `TowRequest with ref ${TowRequestId} has not been officially assigned`,
      });
    }
    const IsAssignedDriverTowRequest = await AssignDriverTowRequest.findOne({
      where: { CompanyId: CompanyId, TowRequestId: TowRequestId, DriverId: DriverId },
    });

    if (IsAssignedDriverTowRequest) {
      res.status(200).send({
        message: `TowRequest with ref ${TowRequestId} has been assigned already`,
      });
    }

    const driver = await Driver.findOne({ where: { DriverId: req.body.DriverId } });

    const towRequest = await TowRequest.findOne({ where: { TowRequestId: TowRequestId } });

    const shipperUser = await User.findOne({ where: { UserId: towRequest.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    // AssignedTo Driver Field is populated with the Driver  UserId (Foriegn Key)  not the DriverId from Driver Entity

    const newRecord = await AssignDriverTowRequest.create({
      TowRequestId: TowRequestId,
      CompanyId: CompanyId,
      UserId: UserId,
      DriverId: DriverId,
      IsAssigned: true,
      AssignedDate: new Date(),
      AssignedToDriver: driver.UserId,
    });

    const trackTowRequest = await TrackTowRequest.create({
      TowRequestId: TowRequestId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignTowRequestId: IsAssignedTowRequest?.AssignTowRequestId,
      StartBy: UserId,
      StartByRole: ROLES.find((item) => item.value === 'carrier').value,
      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'AssignedDriverTowRequest').value,
      StartActionDate: new Date(),
      EndBy: UserId,
      EndByRole: ROLES.find((item) => item.value === 'carrier').value,
      EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'AssignedDriverTowRequest').value,
      EndActionDate: new Date(),
    });

    const url =
      process.env.ADMIN_URL + `/towRequest/assign-towRequest/?towRequestId=${TowRequestId}&driverId=${DriverId}&review=true`;

    //Send mail to Carrier
    const msgTowRequest = `You have an assigned TowRequest with Ref No  ${TowRequestId} for Load Boarding Services to driver ${driver.DriverName}.Kindly check the details  <a href=${url}>here</a>  `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'TowRequest Assignment for LoadBoarding Services',
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgTowRequest,
        url: url,
      },
    });

    //Send mail to Shipper
    const msgShipper = ` TowRequest with Ref No  ${TowRequestId} for Load Boarding Services has been assigned  to driver ${driver.DriverName} of Company -${company.CompanyName}.Kindly check the details  `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'TowRequest Assignment for LoadBoarding Services',
      toEmail: shipperUser.Email,
      msg: {
        name: shipperUser.FullName,
        msg: msgShipper,
        url: url,
      },
    });

    //Send Mail to Driver assigned towRequest
    const msgCarrier = `Congratulations! You have been assigned towRequest with ref:${TowRequestId} for Load Boarding Services .Kindly check the details  `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'TowRequest Assignment for LoadBoarding Services',
      toEmail: driver.Email,
      msg: {
        name: driver.DriverName,
        msg: msgCarrier,
        url: url,
      },
    });

    res.status(200).send({
      message: `TowRequest with Ref ${TowRequestId} has been assigned to Driver ${driver.DriverName} `,
      data: newRecord,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.dispatchTowRequest = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const TowRequestId = req.body.TowRequestId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if towRequest was assigned to company

    const IsAssignedTowRequest = await AssignTowRequest.findOne({
      where: { TowRequestId: TowRequestId, IsAssigned: true },
    });
    if (!IsAssignedTowRequest) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedTowRequest.CompanyId } });
      res.status(200).send({
        message: `TowRequest with ref ${TowRequestId} has not been officially assigned to ${company.CompanyName}`,
      });
    }

    const updateTowRequest = await TowRequest.update(
      {
        TowRequestStatus: TRIP_STATUS.find((item) => item.value === 'Dispatched').value,
        // AssignedCarrier: CompanyId,
      },

      { where: { TowRequestId: TowRequestId } },
    );

    const trackTowRequest = await TrackTowRequest.create({
      TowRequestId: TowRequestId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignTowRequestId: IsAssignedTowRequest.AssignTowRequestId,
      StartBy: UserId,
      StartByRole: ROLES.find((item) => item.value === 'driver').value,
      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Dispatched').value,
      StartActionDate: new Date(),
      EndBy: UserId,
      EndByRole: ROLES.find((item) => item.value === 'driver').value,
      EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Dispatched').value,
      EndActionDate: new Date(),
    });
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const towRequest = await TowRequest.findOne({ where: { TowRequestId: TowRequestId } });

    const user = await User.findOne({ where: { UserId: towRequest.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const IsAssignedDriverTowRequest = await AssignDriverTowRequest.findOne({
      where: { CompanyId: CompanyId, TowRequestId: TowRequestId, IsAssigned: true },
      include: [
        {
          model: Driver,
        },
      ],
    });

    const url = process.env.ADMIN_URL + `/towRequest/assign-towRequest/?towRequestId=${TowRequestId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgTowRequest = `Your TowRequest with Ref No  ${TowRequestId} for Load Boarding Services to Company ${company.CompanyName} has been dispatched successfully.Kindly check the details by clicking below   `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'Request for LoadBoarding Services',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgTowRequest,
        url: url,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = ` TowRequest with ref:${TowRequestId} for Load Boarding Services has been dispatched .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'TowRequest Assignment for LoadBoarding Services',
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        url: url,
      },
    });

    //Send Mail to driver
    const msgDriver = ` TowRequest with ref:${TowRequestId} for Load Boarding Services has been dispatched .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'TowRequest Assignment for LoadBoarding Services',
      toEmail: IsAssignedDriverTowRequest.Driver.Email,
      msg: {
        name: IsAssignedDriverTowRequest.Driver.DriverName,
        msg: msgDriver,
        url: url,
      },
    });

    res.status(200).send({
      message: `TowRequest with Ref ${TowRequestId} has been assigned to Company ${company.CompanyName} `,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.pickedUpTowRequest = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const TowRequestId = req.body.TowRequestId;
  const Role = req.body.Role;
  // const InterestDate = req.body.InterestDate;

  try {
    // check if towRequest was assigned to company

    const IsAssignedTowRequest = await AssignTowRequest.findOne({
      where: { TowRequestId: TowRequestId, IsAssigned: true },
    });
    if (!IsAssignedTowRequest) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedTowRequest.CompanyId } });
      res.status(200).send({
        message: `TowRequest with ref ${TowRequestId} has not been officially assigned to ${company.CompanyName}`,
      });
    }

    const updateTowRequest = await TowRequest.update(
      {
        TowRequestStatus: TRIP_STATUS.find((item) => item.value === 'PickedUp').value,
        // AssignedCarrier: CompanyId,
      },

      { where: { TowRequestId: TowRequestId } },
    );

    const towRequest = await TowRequest.findOne({ where: { TowRequestId: TowRequestId } });

    const user = await User.findOne({ where: { UserId: towRequest.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const IsAssignedDriverTowRequest = await AssignDriverTowRequest.findOne({
      where: { CompanyId: CompanyId, TowRequestId: TowRequestId, IsAssigned: true },
      include: [
        {
          model: Driver,
        },
      ],
    });

    const trackTowRequestResult = await TrackTowRequest.findOne({
      where: {
        TowRequestId: TowRequestId,
        StartByRole: 'shipper',
        StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'SubmitForPickedUp').value,
      },
    });

    if (trackTowRequestResult) {
      const trackTowRequestUpdate = await TrackTowRequest.update(
        {
          EndBy: Role === 'driver' ? IsAssignedDriverTowRequest.DriverId : UserId,
          EndByRole:
            Role === 'driver'
              ? ROLES.find((item) => item.value === 'driver').value
              : ROLES.find((item) => item.value === 'shipper').value,

          EndAction: Role === 'driver' && TRACK_SHIPMENT_STATUS.find((item) => item.value === 'ConfirmPickedUp').value,
          EndActionDate: new Date(),
          // AssignedCarrier: CompanyId,
        },

        {
          where: {
            TowRequestId: TowRequestId,
            StartByRole: 'shipper',
            StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'SubmitForPickedUp').value,
          },
        },
      );

      return res.status(200).send({
        message: `TowRequest with Ref ${TowRequestId} has been Confirmed Picked Up by Driver  `,
      });
    }

    const trackTowRequest = await TrackTowRequest.create({
      TowRequestId: TowRequestId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignTowRequestId: IsAssignedTowRequest.AssignTowRequestId,
      StartBy: Role === 'driver' ? IsAssignedDriverTowRequest.DriverId : UserId,
      StartByRole:
        Role === 'driver'
          ? ROLES.find((item) => item.value === 'driver').value
          : ROLES.find((item) => item.value === 'shipper').value,

      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'SubmitForPickedUp').value,

      StartActionDate: new Date(),
    });
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const url = process.env.ADMIN_URL + `/towRequest/assign-towRequest/?towRequestId=${TowRequestId}&companyId=${CompanyId}`;

    const urltrack = process.env.ADMIN_URL + `/trip/track-info/?towRequestId=${TowRequestId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgTowRequest = `Your TowRequest with Ref No  ${TowRequestId} for Load Boarding Services to Company ${company.CompanyName} has been picked up successfully.Kindly check the details by clicking below   `;

    await mailFunc.sendEmail({
      template: 'track',
      subject: 'TowRequest Picked Up',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgTowRequest,
        url: url,
        urlTrack: urltrack,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = ` TowRequest with ref:${TowRequestId} for Load Boarding Services has been picked up .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'TowRequest Picked Up ',
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        url: url,
      },
    });

    //Send Mail to driver
    const msgDriver = ` TowRequest with ref:${TowRequestId} for Load Boarding Services has been picked up .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'TowRequest Picked Up ',
      toEmail: IsAssignedDriverTowRequest.Driver.Email,
      msg: {
        name: IsAssignedDriverTowRequest.Driver.DriverName,
        msg: msgDriver,
        url: url,
      },
    });

    res.status(200).send({
      message: `TowRequest with Ref ${TowRequestId} has been picked Up by ${user.FullName} for Shipper  `,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.deliveredTowRequest = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const TowRequestId = req.body.TowRequestId;
  const Role = req.body.Role;
  // const InterestDate = req.body.InterestDate;

  try {
    // check if towRequest was assigned to company

    const IsAssignedTowRequest = await AssignTowRequest.findOne({
      where: { TowRequestId: TowRequestId, IsAssigned: true },
    });
    if (!IsAssignedTowRequest) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedTowRequest.CompanyId } });
      res.status(200).send({
        message: `TowRequest with ref ${TowRequestId} has not been officially assigned to ${company.CompanyName}`,
      });
    }

    const updateTowRequest = await TowRequest.update(
      {
        TowRequestStatus: TRIP_STATUS.find((item) => item.value === 'Delivered').value,
        // AssignedCarrier: CompanyId,
      },

      { where: { TowRequestId: TowRequestId } },
    );
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const towRequest = await TowRequest.findOne({ where: { TowRequestId: TowRequestId } });

    const user = await User.findOne({ where: { UserId: towRequest.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const IsAssignedDriverTowRequest = await AssignDriverTowRequest.findOne({
      where: { CompanyId: CompanyId, TowRequestId: TowRequestId, IsAssigned: true },
      include: [
        {
          model: Driver,
        },
      ],
    });

    const trackTowRequestResult = await TrackTowRequest.findOne({
      where: {
        TowRequestId: TowRequestId,
        StartByRole: 'driver',
        StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Delivered').value,
      },
    });

    if (trackTowRequestResult) {
      const trackTowRequestUpdate = await TrackTowRequest.update(
        {
          EndBy: Role === UserId,
          EndByRole: ROLES.find((item) => item.value === 'shipper').value,
          EndAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'ConfirmDelivered').value,
          EndActionDate: new Date(),
          // AssignedCarrier: CompanyId,
        },

        {
          where: {
            TowRequestId: TowRequestId,
            StartByRole: 'driver',
            StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Delivered').value,
          },
        },
      );
      if (trackTowRequestUpdate) {
        return res.status(200).send({
          message: `TowRequest with Ref ${TowRequestId} has been Confirmed Delivered by Shipper  `,
        });
      }
    }

    const trackTowRequest = await TrackTowRequest.create({
      TowRequestId: TowRequestId,
      UserId: UserId,
      CompanyId: CompanyId,
      AssignTowRequestId: IsAssignedTowRequest.AssignTowRequestId,
      StartBy: IsAssignedDriverTowRequest.DriverId,
      StartByRole: ROLES.find((item) => item.value === 'driver').value,
      StartAction: TRACK_SHIPMENT_STATUS.find((item) => item.value === 'Delivered').value,
      StartActionDate: new Date(),
    });
    const url = process.env.ADMIN_URL + `/towRequest/assign-towRequest/?towRequestId=${TowRequestId}&companyId=${CompanyId}`;
    const urltrack = process.env.ADMIN_URL + `/trip/track-info/?towRequestId=${TowRequestId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgTowRequest = `Your TowRequest with Ref No-${TowRequestId} for Load Boarding Services from Company ${company.CompanyName} has been delivered successfully.Kindly check the details by clicking below   `;

    await mailFunc.sendEmail({
      template: 'track',
      subject: 'Request for LoadBoarding Services',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgTowRequest,
        url: url,
        urlTrack: urltrack,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = ` TowRequest with ref:${TowRequestId} for Load Boarding Services has been delivered .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'TowRequest Delivery for LoadBoarding Services',
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        url: url,
      },
    });

    //Send Mail to driver
    const msgDriver = ` TowRequest with ref:${TowRequestId} for Load Boarding Services has been delivered .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: 'TowRequest Delivery for LoadBoarding Services',
      toEmail: IsAssignedDriverTowRequest.Driver.Email,
      msg: {
        name: IsAssignedDriverTowRequest.Driver.DriverName,
        msg: msgDriver,
        url: url,
      },
    });

    res.status(200).send({
      message: `TowRequest with Ref ${TowRequestId} has been delivered `,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.cancelTowRequest = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const TowRequestId = req.body.TowRequestId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if towRequest was assigned to company

    const IsAssignedTowRequest = await AssignTowRequest.findOne({
      where: { TowRequestId: TowRequestId, IsAssigned: true },
    });
    if (!IsAssignedTowRequest) {
      const company = await Company.findOne({ where: { CompanyId: IsAssignedTowRequest.CompanyId } });
      res.status(200).send({
        message: `TowRequest with ref ${TowRequestId} has not been officially assigned to ${company.CompanyName}`,
      });
    }

    const updateTowRequest = await TowRequest.update(
      {
        TowRequestStatus: TRIP_STATUS.find((item) => item.value === 'Cancelled').value,
        // AssignedCarrier: CompanyId,
      },

      { where: { TowRequestId: TowRequestId } },
    );

    const assignedTowRequest = await AssignTowRequest.update(
      {
        IsAssigned: false,
        // AssignedCarrier: CompanyId,
      },

      { where: { TowRequestId: TowRequestId, IsAssigned: true } },
    );
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);

    const towRequest = await TowRequest.findOne({ where: { TowRequestId: TowRequestId } });

    const user = await User.findOne({ where: { UserId: towRequest.UserId } });

    const company = await Company.findOne({ where: { CompanyId: req.body.CompanyId } });

    const companyUser = await User.findOne({ where: { CompanyId: req.body.CompanyId }, order: [['createdAt', 'ASC']] });

    const IsAssignedDriverTowRequest = await AssignDriverTowRequest.findOne({
      where: { CompanyId: CompanyId, TowRequestId: TowRequestId, IsAssigned: true },
      include: [
        {
          model: Driver,
        },
      ],
    });

    const url = process.env.ADMIN_URL + `/towRequest/assign-towRequest/?towRequestId=${TowRequestId}&companyId=${CompanyId}`;

    const urltrack = process.env.ADMIN_URL + `/trip/track-info/?towRequestId=${TowRequestId}&companyId=${CompanyId}`;

    //Send mail to Shipper
    const msgTowRequest = `Your TowRequest with Ref No  ${TowRequestId} for Load Boarding Services from Company ${company.CompanyName} has been cancelled successfully.Kindly check the details by clicking below   `;

    await mailFunc.sendEmail({
      template: 'generic',
      subject: 'Cancelled TowRequest ',
      toEmail: user.Email,
      msg: {
        name: user.FullName,
        msg: msgTowRequest,
        url: url,
      },
    });

    //Send Mail to Carrier
    const msgCarrier = ` TowRequest with ref:${TowRequestId} for Load Boarding Services has been cancelled by shipper .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: `Cancelled TowRequest ref:${TowRequestId}`,
      toEmail: companyUser.Email,
      msg: {
        name: companyUser.FullName,
        msg: msgCarrier,
        url: url,
      },
    });

    //Send Mail to driver
    const msgDriver = ` TowRequest with ref:${TowRequestId} for Load Boarding Services has been cancelled .Kindly check the details by clicking below `;

    await mailFunc.sendEmail({
      template: 'interest',
      subject: `Cancelled TowRequest ref:${TowRequestId}`,
      toEmail: IsAssignedDriverTowRequest.Driver.Email,
      msg: {
        name: IsAssignedDriverTowRequest.Driver.FullName,
        msg: msgDriver,
        url: url,
      },
    });

    res.status(200).send({
      message: `TowRequest with Ref ${TowRequestId} has been cancelled `,
      data: newAssignment,
    });
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.archiveTowRequest = async (req, res) => {
  const TowRequestId = req.body.TowRequestId;

  // const InterestDate = req.body.InterestDate;

  try {
    // check if towRequest was assigned to company

    const towRequestArchived = await TowRequest.findOne({
      where: { TowRequestId: TowRequestId, IsArchived: true },
    });
    if (towRequestArchived) {
      await TowRequest.update(
        {
          IsArchived: false,
          // AssignedCarrier: CompanyId,
        },

        { where: { TowRequestId: TowRequestId } },
      );

      return res.status(200).send({
        message: `TowRequest record with ref ${TowRequestId} is removed from the archived list`,
      });
    }

    const updateTowRequest = await TowRequest.update(
      {
        IsArchived: true,
        // AssignedCarrier: CompanyId,
      },

      { where: { TowRequestId: TowRequestId } },
    );

    if (updateTowRequest) {
      return res.status(200).send({
        message: `TowRequest record with ref ${TowRequestId} is added to the archived list`,
      });
    }
    //  console.log('TRIP_STATUS', TRIP_STATUS.find((item) => item.value === 'Assigned').value);
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.sendRemindEmail = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const TowRequestId = req.body.TowRequestId;

  try {
    const IsAssignedTowRequest = await AssignTowRequest.findOne({
      where: { TowRequestId: TowRequestId, IsAssigned: true, CompanyId: CompanyId, IsContractSigned: false },
    });
    if (IsAssignedTowRequest) {
      const companyCarrier = await Company.findOne({ where: { CompanyId: CompanyId } });

      const towRequest = await TowRequest.findOne({ where: { TowRequestId: TowRequestId } });

      const companyShipper = await Company.findOne({ where: { CompanyId: towRequest.CompanyId } });

      const companyUser = await User.findOne({ where: { CompanyId: CompanyId }, order: [['createdAt', 'ASC']] });

      //Send Mail to Carrier
      const msgCarrier = `Our Company (${companyShipper.CompanyName}) are waiting to get from you the signed copy of the dispatch agreement.Just in case you missed it,find attached the agreement for your perusal and action. `;

      await mailFunc.sendEmail({
        template: 'generic',
        subject: 'TowRequest Assignment for LoadBoarding Services',
        toEmail: companyCarrier.ContactEmail,
        msg: {
          name: companyUser.FullName,
          msg: msgCarrier,
          // url: url,
        },
        filename: 'shipper_carrier_agreement.pdf',
      });

      res.status(200).send({
        message: `Sent Reminder Email  to ${companyCarrier.CompanyName} `,
      });
    }
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.contractSigned = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const TowRequestId = req.body.TowRequestId;
  const Role = req.body.Role;

  try {
    const IsAssignedTowRequest = await AssignTowRequest.findOne({
      where: {
        TowRequestId: TowRequestId,
        IsAssigned: true,
        CompanyId: CompanyId,
      },
    });
    if (!IsAssignedTowRequest) {
      return res.status(200).send({
        message: `No Assignment has been confirmed as done.kindly contact administrator for help`,
      });
    }
    if (IsAssignedTowRequest) {
      if (Role === 'carrier' && IsAssignedTowRequest.IsContractSigned === true) {
        return res.status(200).send({
          message: `Contract has been signed already.`,
        });
      }

      if (Role === 'shipper' && IsAssignedTowRequest.IsContractConfirmed === true) {
        return res.status(200).send({
          message: `Contract has been confirmed already.`,
        });
      }

      const companyCarrier = await Company.findOne({ where: { CompanyId: IsAssignedTowRequest.CompanyId } });

      const towRequest = await TowRequest.findOne({ where: { TowRequestId: TowRequestId } });

      const user = await User.findOne({ where: { UserId: towRequest.UserId } });

      const companyUser = await User.findOne({
        where: { CompanyId: IsAssignedTowRequest.CompanyId },
        order: [['createdAt', 'ASC']],
      });

      const companyShipper = await Company.findOne({ where: { CompanyId: user.CompanyId } });

      //Update AssignTowRequest Table

      const updateVar = Role === 'carrier' ? { IsContractSigned: true } : { IsContractConfirmed: true };
      console.log('updatevar', updateVar);
      const assignTowRequest = await AssignTowRequest.update(
        updateVar,

        { where: { TowRequestId: TowRequestId, IsAssigned: true, CompanyId: CompanyId } },
      );

      if (assignTowRequest.IsContractConfirmed === true) {
        //Send Mail to Carrier
        const msgCarrier = `Company (${companyShipper.CompanyName}) has recieved your copy of the agreement, and thus officially look to complete all documentation processes. `;

        await mailFunc.sendEmail({
          template: 'generic',
          subject: 'TowRequest Assignment for LoadBoarding Services',
          toEmail: companyCarrier.ContactEmail ? companyCarrier.ContactEmail : companyUser.Email,
          msg: {
            name: companyUser.FullName,
            msg: msgCarrier,
            // url: url,
            //filename: 'shipper_carrier_agreement.pdf',
          },
        });
      }
      res.status(200).send({
        message: `Contract signed between ${companyCarrier.CompanyName} and ${companyShipper.CompanyName}`,
      });
    }
  } catch (error) {
    console.log(`err.message`, error);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.contractAccepted = async (req, res) => {
  const CompanyId = req.body.CompanyId;
  const UserId = req.body.UserId;
  const TowRequestId = req.body.TowRequestId;

  try {
    const IsAssignedTowRequest = await AssignTowRequest.findOne({
      where: {
        TowRequestId: TowRequestId,
        IsAssigned: true,
        CompanyId: CompanyId,
        IsContractSigned: true,
        IsContractAccepted: false,
      },
    });
    if (IsAssignedTowRequest) {
      const companyCarrier = await Company.findOne({ where: { CompanyId: IsAssignedTowRequest.CompanyId } });

      const user = await User.findOne({ where: { UserId: UserId } });

      const companyUser = await User.findOne({
        where: { CompanyId: IsAssignedTowRequest.CompanyId },
        order: [['createdAt', 'ASC']],
      });

      const companyShipper = await Company.findOne({ where: { CompanyId: user.CompanyId } });

      const assignTowRequest = await AssignTowRequest.update(
        {
          IsContractAccepted: true,

          // AssignedCarrier: CompanyId,
        },

        { where: { TowRequestId: TowRequestId, IsAssigned: true, CompanyId: CompanyId, IsContractSigned: true } },
      );

      //Send Mail to Carrier
      const msgCarrier = `Company (${companyShipper.CompanyName}) has accepted the agreement, and thus officially given the nod for your service to commence.Good luck and success in your execution. `;

      await mailFunc.sendEmail({
        template: 'generic',
        subject: 'TowRequest Assignment for LoadBoarding Services',
        toEmail: companyCarrier.ContactEmail ? companyCarrier.ContactEmail : companyUser.Email,
        msg: {
          name: companyUser.FullName,
          msg: msgCarrier,
          // url: url,
          //filename: 'shipper_carrier_agreement.pdf',
        },
      });

      res.status(200).send({
        message: `Contract accepted between ${companyCarrier.CompanyName} and ${companyShipper.CompanyName}`,
      });
    }
  } catch (error) {
    console.log(`err.message`, error.message);
    res.status(500).send({
      message: `${error.message} -Bad Operation` || 'Some error occurred while retrieving records.',
    });
  }
};

exports.findAllTowRequestsInterest = (req, res) => {
  // const status = req.params.towRequestStatus;
  // const towRequestId = req.params.towRequestId;
  // var condition = towRequestId
  //   ? { [Op.and]: [{ TowRequestId: towRequestId }, { TowRequestStatus: status }] }
  //   : { TowRequestStatus: status };

  Interested.findAll({
    where: { IsInterested: true },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
      },
      {
        model: TowRequest,
      },
    ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

exports.findAllTowRequestsInterestByTowRequestId = (req, res) => {
  // const status = req.params.towRequestStatus;
  const towRequestId = req.params.towRequestId;
  // var condition = towRequestId
  //   ? { [Op.and]: [{ TowRequestId: towRequestId }, { TowRequestStatus: status }] }
  //   : { TowRequestStatus: status };

  Interested.findAll({
    where: { IsInterested: true, TowRequestId: towRequestId },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
      },
      {
        model: TowRequest,
      },
    ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};
exports.findAllTowRequestsInterestByCompany = (req, res) => {
  // const status = req.params.towRequestStatus;
  const companyId = req.params.companyId;
  // var condition = towRequestId
  //   ? { [Op.and]: [{ TowRequestId: towRequestId }, { TowRequestStatus: status }] }
  //   : { TowRequestStatus: status };

  Interested.findAll({
    where: { IsInterested: true, CompanyId: companyId },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: TowRequest,
      },
    ],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

exports.findAllTowRequestsInterestByDate = (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  Interested.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(Date(startDate)), new Date(Date(endDate))],
      },
    },

    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

exports.findAllAssignTowRequest = (req, res) => {
  AssignTowRequest.findAll({
    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: TowRequest,
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};

exports.findAllAssignDriverTowRequest = (req, res) => {
  AssignDriverTowRequest.findAll({
    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
      },
      {
        model: Driver,
      },
      {
        model: TowRequest,
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};


exports.findAssignDriverTowRequest = (req, res) => {

  const towRequestId = req.params.towRequestId;

  AssignDriverTowRequest.findOne({
    where: { TowRequestId: towRequestId },
    include: [
      {
        model: User,
        attributes: ['FullName'],
      },
      {
        model: Company,
      },
      {
        model: Driver,
      },
      {
        model: TowRequest,
      },
    ],
    order: [['createdAt', 'DESC']],
  })

    .then((data) => {
      res.status(200).send({
        message: 'Success',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving TowRequests.',
      });
    });
};