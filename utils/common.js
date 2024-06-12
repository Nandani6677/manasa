const BASEURL = async (req) => {
  const url = "https://" + req.headers.host;
  return url;
};

const CURRENTTIMEZONE = async () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone;
};

module.exports = {
  BASEURL,
  CURRENTTIMEZONE,
};
