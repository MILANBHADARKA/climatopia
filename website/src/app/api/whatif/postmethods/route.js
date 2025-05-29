export async function POST(req) {
  
  try {
    const {scenario, api, start_time, text} = await req.json();

    let obj;
    // console.log(scenario,  start_time, text)
    if(scenario){
      obj = {scenario}
    }else if(start_time){
      obj = {start_time}
    }else if(text){
      obj = {text}
    }
    // console.log(obj)
    // console.log("Call for " + api)
    const apicall = await fetch(`${api}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
    const data = await apicall.json();
    return Response.json({data});
  } catch (error) {
    console.log(error)
    return Response.json({error});
  }


}