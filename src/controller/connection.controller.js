import Connection from "../models/connection.model.js";
import { Apiresponse, asyncWrapper } from "../utils.js";


export const create_update_connections = asyncWrapper(async (req, res,next) => {
    const connection = await Connection.findOneAndUpdate(
        {
            user_id: req.user._id
        },
        {
            ...req.body
        },
        {
            upsert: true
        }
)
    if(connection){
        return res.status(201).json(new Apiresponse('Connections saved',false, connection))
    }else{
        return res.status(500).json(new Apiresponse('Failed to make changes'))
    }
})
