function logger(req, res, next) {
  console.log(
    `[${new Date().toLocaleString()}] ${req.ip} ${req.method} @ ${req.url}`
  );
  next();
}

export default logger;
