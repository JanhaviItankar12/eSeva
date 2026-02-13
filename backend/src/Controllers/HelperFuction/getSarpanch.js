export const getSarpanch = async (application) => {
  return await User.findOne({
    role: "SARPANCH",
    "jurisdiction.village": application.jurisdiction.village,
    "jurisdiction.tehsil": application.jurisdiction.tehsil,
    "jurisdiction.district": application.jurisdiction.district,
    isActive: true
  }).select("_id");
};
