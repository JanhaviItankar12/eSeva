import User from "../models/user.js";

export const validCitizen=async(req,res,next)=>{
    try {
        const id=req.user.id;
        
        // Find citizen first
            const citizen = await User.findById(id);
        
            if (!citizen) {
              return res.status(404).json({
                success: false,
                message: 'Citizen not found'
              });
            }
        
            // Verify citizen role
            if (citizen.role !== 'CITIZEN') {
              return res.status(403).json({
                success: false,
                message: 'Access denied. Only citizens can do changes here...'
              });
            }
            next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}