export const notFoundHandler = (req, res) => {
  const path = req.url;
  res.status(404).json({
    message: '404 page not found',
    path,
  });
};
