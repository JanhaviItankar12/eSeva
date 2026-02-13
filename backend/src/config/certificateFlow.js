export const certificateFlow = {
  BIRTH: {
    startOffice: "GRAM",
    flow: ["GRAM_SEVAK"],
    endOffice: "GRAM"
  },

  RESIDENCE: {
    startOffice: "GRAM",
    flow: ["GRAM_SEVAK","SARPANCH"],
    endOffice: "GRAM"
  },

  INCOME: {
    startOffice: "GRAM",
    flow: ["GRAM_SEVAK", "TEHSIL_CLERK","TEHSILDAR"],
    endOffice: "TEHSIL"
  },

  CASTE: {
    startOffice: "TEHSIL",
    flow: ["TEHSIL_CLERK", "TEHSILDAR"],
    endOffice: "TEHSIL"
  },

  DOMICILE: {
    startOffice: "TEHSIL",
    flow: ["TEHSIL_CLERK", "TEHSILDAR","DISTRICT_CLERK","COLLECTOR"],
    endOffice: "DISTRICT"
  }
};




