import { Apiresponse, asyncWrapper, generateQueries, generateUserToken } from "../utils.js";
import Project from '../models/project.model.js'
import makeDBCalls from "../db/connectToDatabase.js";
import Connection from "../models/connection.model.js";
import { authorizedUser } from "./auth.controller.js";

export const createNewProject = asyncWrapper(async (req, res, next) => {
    const {connection_id} = req.body
    const project = await Project.create({
        connection: connection_id,
        api_endpoints: []
    })

    if(project){
        return res.status(201).json(new Apiresponse('Project created', false,project))
    }else{
        return res.status(500).json(new Apiresponse('project creation failed'))
    }
})


export const createNewEndpoint = asyncWrapper(async (req, res, next) => {
    const {project_id, newEndpoint,text, private_route} = req.body
    const updatedProject = await Project.findOneAndUpdate(
        {
            _id: project_id
        },
        {
            $push: {api_endpoints: {endpoint: newEndpoint, text, private: private_route}}
        },
        {
            new: true,
        }
    )

    if(updatedProject){
        return res.status(201).json(new Apiresponse('new endpoint created', false, updatedProject))
    }else{
        return res.status(500).json(new Apiresponse('endpoint creation failed'))
    }
})

export const updateEndpoint = asyncWrapper(async (req, res, next) => {
    const {project_id, endpoint, newCommand} = req.body

    const updatedProject = await Project.findOneAndUpdate(
        {
            _id: project_id,"api_endpoints.endpoint": endpoint
        },
        {
            $set: {"api_endpoints.$.text": newCommand}
        },
        {
            new: true
        }
    )

    if(updatedProject){
        return res.status(201).json(new Apiresponse('endpoint updated', false, updatedProject))
    }else{
        return res.status(500).json(new Apiresponse('endpoint updation failed'))
    }
})

export const hitEndpoint = asyncWrapper(async (req, res, next) => {
    const {endpoint, project_id} = req.body;
    const project = await Project.findById(project_id);
    if(!project){
        return res.status(400).json(new Apiresponse('No such project exists'))
    }
    const connection = await Connection.findOne({user_id: req.user._id})
    const api_endpoint = project.api_endpoints.filter(obj => obj.endpoint === endpoint)[0];
    if(api_endpoint.private){
        const authorized = authorizedUser(req,res,next)
        if(!authorized){
            return res.status(400).send('not authorized');
        }
    }
    const text = api_endpoint.text;
    const queries = await generateQueries(text)
    if(!queries) return res.status(400).json('Not possible.')
    const result = await makeDBCalls(connection.mongodb_uri, queries);
     if(!result) return res.status(500).json(new Apiresponse('error interacting with the database'))
    return res.status(200).json(new Apiresponse('All good', false, result))
})


export const directQuery = asyncWrapper(async (req, res, next) => {
    const {text} = req.body;
    const connection = await Connection.findOne({user_id: req.user._id})
    const queries = await generateQueries(text)
    if(!queries) return res.status(400).json('Not possible.')
    const result = await makeDBCalls(connection.mongodb_uri, queries);
     if(!result) return res.status(500).json(new Apiresponse('error interacting with the database'))
    return res.status(200).json(new Apiresponse('All good', false, result))
})

export const loginInProjectUser = asyncWrapper(async(req, res, next) => {
    const {email, password} = req.body
    const queries = await generateQueries(`find  user whose email is ${email} and password is ${password}. use findOne method. name of the collection is user`)
    if(!queries) return res.status(500).json(new Apiresponse('Server error.'));
    const connection = await Connection.findOne({user_id: req.user._id})
    const result = await makeDBCalls(connection.mongodb_uri, queries)
    if(!result) return res.status(401).json(new Apiresponse('user is not logged in'))
    const token =  generateUserToken(result.data)
    return res
        .status(200)
        .cookie('authorized_token', token,{maxAge : 24 * 60 * 60 * 1000 * 80})
        .json(new Apiresponse('Project User logged in', false, {email}))
})

export const signupProjectUser = asyncWrapper(async(req, res, next) => {
    const {email, password} = req.body;
    const queries = await generateQueries(`insert a user into the database in the user collection. properties are email=${email}, password=${password}. collection name is user`);
    if(!queries) return res.status(500).json(new Apiresponse('server error.'))
    const connection = await Connection.findOne({user_id: req.user._id});
    const result = await makeDBCalls(connection.mongodb_uri, queries)
    if(!result) return res.status(500).json('server error')
    return res.status(201).json(new Apiresponse('User account created', false, {email}))
})

export const logoutProjectUser = asyncWrapper(async (req, res, next) => {
   return res.status(200).clearCookie('authorized_token').json(new Apiresponse('logged out', false));
})