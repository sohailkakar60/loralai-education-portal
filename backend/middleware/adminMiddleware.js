const requireAdmin = (
  req,
  res,
  next
) => {

  if (!req.user) {

    return res.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });

  }


  const allowedRoles = [
    "super_admin",
    "admin",
  ];


  if (
    !allowedRoles.includes(
      req.user.role
    )
  ) {

    return res.status(403).json({
      success: false,
      message:
        "Administrator access required.",
    });

  }


  next();
};


module.exports = {
  requireAdmin,
};