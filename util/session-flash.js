function flashDataForSession(req, data, action) {
  req.session.flashData = data;
  req.session.save(action);
}

function getSessionData(req) {
  const sessionData = req.session.flashData;
  req.session.flashData = null;
  return sessionData;
}

module.exports = {
  flashDataForSession: flashDataForSession,
  getSessionData: getSessionData,
};
