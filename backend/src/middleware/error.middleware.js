export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({ message: 'Generated code collision, please retry' });
  }

  return res.status(500).json({ message: 'Server error' });
};
