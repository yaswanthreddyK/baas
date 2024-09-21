import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

export default async function useGemini(prompt){
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(prompt);
        const response = result.response.text()
        return response
    } catch (error) {
        console.log(error)
        return false
    }
}