import { model, Schema } from "mongoose";


const connectionSchema = new Schema({
    mongodb_uri: {
        type: String,
        required: [true, 'mongodb_uri is required.']
    },
    user_id: {
        type: String,
        required: [true, "user.id is required."]
    },
    google_mail_id:{
        type: String,
    },
    google_mail_password: {
        type: String,
    },
    google_client_id: {
        type: String,
    },
    google_redirect_uri: {
        type: String,
    },
    cloudinary_api_key: {
        type: String,
    },
    cloudinary_name: {
        type: String,
    },
    cloudinary_secret: {
        type: String,
    },
    stripe_secret_key: {
        type: String,
    }
})

const Connection = model('Connections', connectionSchema)

export default Connection;