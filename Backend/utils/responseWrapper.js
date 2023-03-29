const success = (statusCode, result) => {
  return {
    status: "Ok",
    statusCode: statusCode,
    result,
  };
};

const error = (statusCode, message) => {
  return {
    status: "error",
    statusCode: statusCode,
    message,
  };
};

module.exports = {
  success,
  error,
};
