import axios from "axios";

export async function POST(req) {
  
  try {
    const { api} = await req.json();
    console.log(api)
    const apicall = await axios.get(`${api}`)
    const data =  apicall.data
    // console.log(data)
    return Response.json({data});
  } catch (error) {
    console.log(error)
    return Response.json({error});
  }


}