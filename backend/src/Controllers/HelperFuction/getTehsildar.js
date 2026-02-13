export const getTehsildar = async (application) => {
  return await User.findOne({
    role: "TEHSILDAR",
    "jurisdiction.tehsil": application.jurisdiction.tehsil,
    "jurisdiction.district": application.jurisdiction.district,
    isActive: true
  }).select("_id");
};

