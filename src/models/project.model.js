import mongoose, { model, Mongoose, Schema } from "mongoose";


const projectSchema = new Schema({
    connection: {
        type: mongoose.Types.ObjectId,
        ref: 'connection'
    },
    api_endpoints:[
        {
            endpoint: {
                type: String,
                required: [true, 'endpoint is required in api_endpoints']
            },
            text: {
                type: String,
                required: [true, 'text is required in api_endpoints']
            },
            private:{
                type: Boolean,
                default: false
            }
        },
       
    ]
})

const Project = model('Projects', projectSchema)

export default Project;