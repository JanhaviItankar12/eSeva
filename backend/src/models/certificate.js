import mongoose from "mongoose";

const certificateSchema=new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    issue_date: { type: Date, default: Date.now ,
        required:true
    },
    issued_by:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    certificate_url:{
        type:String,
        required:true
    }
});

export default mongoose.model("Certificate", certificateSchema);



