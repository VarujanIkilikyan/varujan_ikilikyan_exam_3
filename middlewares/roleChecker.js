import HttpErrors from 'http-errors';

export  default  async (req,res,next)=>{
    try {
        const role = req.user?.role;

        if (!role || role !== 'admin') {
            next(HttpErrors(401));
        }

        next();

    }catch (e){
        next(HttpErrors(401));
    }

}