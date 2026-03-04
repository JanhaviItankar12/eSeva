import SystemSetting from "../../models/systemSetting.js";

export const  createSystemDefaultSetting=async(req,res)=>{
     try {
        let settings=await SystemSetting.findOne();

      if (!settings) {
      // Create default settings automatically
      settings = await SystemSettings.create({
        systemName: "My System",
        minPasswordLength: 8,
        maxFileSize: 5,
        allowedFileTypes: ["PDF", "JPG", "PNG"],
        defaultSLADays: 7,
        urgentFeeMultiplier: 2,
        paginationLimit: 10,
        maintenanceMode: false
      });
    }

    return res.status(200).json(settings);

     } catch (error) {
         console.log(error.message);
         res.status(500).json({ message: "Failed to fetch settings" });
     }
}

export const updateTemplateSetting=async(req,res)=>{
    try {
        const settings = await SystemSettings.findOneAndUpdate(
      {},
      req.body,
      { new: true }
    );

    return res.status(200).json(settings); 
    } catch (error) {
      return res.status(500).json({ message: "Update failed" });  
    }
}