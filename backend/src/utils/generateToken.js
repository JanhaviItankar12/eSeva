import jwt from 'jsonwebtoken';

const generateToken=(user)=>{
   

    return jwt.sign(
        {
            id:user._id,
            role:user.role,
            officeLevel:user.officeLevel,
            officeId:user.officeId
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}

    );
};

export default generateToken;
