export const timeLogger = (req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
};
