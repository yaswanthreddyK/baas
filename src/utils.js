import jwt from 'jsonwebtoken'
import useGemini from './ai/gemini.ai.js'

export class Apiresponse {
  constructor(message = "", error = true, data = ""){
    this.message = message,
    this.error = error,
    this.data = data
  }
}

export const asyncWrapper =  function (func){
    return function (req, res, next) {
      Promise.resolve(func(req, res, next)).catch(err => next(err))
    }
}

export const verifyJWT = function(token){
  let payload;
  try {
    payload = jwt.verify(token, process.env.HASH_SECRET);
  } catch (error) {
    payload = false
  }
  return payload
}

export const generateQueries = async function(text){
  const prompt = `I will give you a text and you should convert it into a mongodb queries. Just give the mongodb query nothing else this is the text: ${text}.only include the queries nothing else, this is important.If creating such queries is not possible just send INCORRECT_COMMAND. also specify simple reason why it is not possible. only specify this if there are no such queries or else just give query nothing else not even comments. mongodb is the database environment is nodejs. use the nodejs driver syntax for the mongodb queries.If you are using the find() method then add toArray() at the end of the query to convert the result into an array. or else dont do it`;
  const unStructuredQueries = await useGemini(prompt);
  if(unStructuredQueries.includes('INCORRECT_COMMAND')) return false;
  const newPrompt = `Take these queries.${unStructuredQueries}. just add all the queries into an array and return it. it is important to just return only the array. add await to each query at the beginning. make the qurey into a string`
  const queryString = await useGemini(newPrompt);
  const arrayOfQueries = queryString.split('```javascript')[1].split('```')[0]
  return arrayOfQueries;
}


export  const generateUserToken =  function(user){
  return   jwt.sign({...user}, process.env.HASH_SECRET, {expiresIn: process.env.TOKEN_EXPIRY})
}

