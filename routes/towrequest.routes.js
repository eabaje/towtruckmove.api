const { authJwt } = require('../middleware');
const controller = require('../controller/towrequest.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/towrequest/findOne/:towrequestId', controller.findOne);

  app.get('/api/towrequest/findAll/:userId', controller.findAll);

  app.get('/api/towrequest/findAll', controller.findAll);

  app.get('/api/towrequest/findAllAssignTowRequest', controller.findAllAssignTowRequest);

  app.get('/api/towrequest/findAllAssignDriverTowRequest', controller.findAllAssignDriverTowRequest);

  app.get('/api/towrequest/findAllTowRequestsByStatus/:towrequestStatus/:towrequestid', controller.findAllTowRequestsByStatus);

  app.get(
    '/api/towrequest/findAllTowRequestsByDate/:startDate/:endDate',
    controller.findAllTowRequestsByDate,
  );
  // [authJwt.verifyToken],
  app.get('/api/towrequest/findAllTowRequestsByPickUpDate/:startDate/:endDate', controller.findAllTowRequestsByPickUpDate);
  app.get('/api/towrequest/findAllTowRequestsAssigned/:towrequestId/:assignedtowrequest', controller.findAllTowRequestsAssigned);

  app.get('/api/towrequest/findAllTowRequestsInterest', controller.findAllTowRequestsInterest);

  app.get(
    '/api/towrequest/findAllTowRequestsInterestByTowRequestId/:towrequestId',
    controller.findAllTowRequestsInterestByTowRequestId,
  );

  app.get('/api/towrequest/findAllTowRequestsInterestByCompany/:companyId', controller.findAllTowRequestsInterestByCompany);

  app.get('/api/towrequest/findAssignDriverTowRequest/:towrequestId', controller.findAssignDriverTowRequest);

  app.post('/api/towrequest/assignCompanyTowRequest', controller.assignCompanyTowRequest);

  app.post('/api/towrequest/assignDriverTowRequest', controller.assignDriverTowRequest);

  app.post('/api/towrequest/showInterest', controller.showInterest);

  app.post('/api/towrequest/dispatchTowRequest', controller.dispatchTowRequest);

  app.post('/api/towrequest/pickedUpTowRequest', controller.pickedUpTowRequest);

  app.post('/api/towrequest/deliveredTowRequest', controller.deliveredTowRequest);

  app.post('/api/towrequest/cancelTowRequest', controller.cancelTowRequest);

  app.post('/api/towrequest/archiveTowRequest', controller.archiveTowRequest);

  app.post('/api/towrequest/sendRemindEmail', controller.sendRemindEmail);

  app.post('/api/towrequest/contractSigned', controller.contractSigned);

  app.post('/api/towrequest/contractAccepted', controller.contractAccepted);

  app.post('/api/towrequest/create', controller.create);

  app.put('/api/towrequest/update/:towrequestId', controller.update);

  app.delete('/api/towrequest/delete/:towrequestId', controller.delete);

  app.delete('/api/towrequest/deleteAll', controller.deleteAll);
};
