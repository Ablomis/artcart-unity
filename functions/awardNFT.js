const axios = require('axios').default;

exports.handler = async (event, context, callback) => {

  const data = JSON.parse(event.body)

  //getting auth token
  const responseToken = await axios.post("https://login.artcart.cloud/oauth/token", {
    grant_type: 'client_credentials',
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    audience: 'platform.artcart.app/api/transactional/'
  });
  const token = responseToken.data.access_token;

  //getting list of all NFT templates
  const responseTemplates = await axios.get("https://platform.artcart.cloud/api/transactional/templates", 
    { headers: { "Authorization": `Bearer ${token}` } });
  const templatesList = responseTemplates.data;
  const templatesNumber = templatesList.length;

  let eligibleTemplates = [];

  //checking whether NFTs are eligible for issuing (either count is less than limit, or there is no limit)
  for (i = 0; i<templatesNumber; i++){
    if(templatesList[i].limit === 0 || templatesList[i].count < templatesList[i].limit)
    {
        eligibleTemplates.push(templatesList[i]);
    }
  }
  if(eligibleTemplates.length>0){
    //ADD ANY CUSTOM LOGIC HERE
    /*
    //------------------------
    */

    //getting random NFT index
    const index = Math.floor(Math.random()*eligibleTemplates.length);

    //getting cid (meta ipfs hash that defines NFT template
    const cid = eligibleTemplates[index].meta_ipfshash;

    //issuing NFT
    const responseNFT = await axios.post(`https://platform.artcart.cloud/api/transactional/nft`, {
      cid: cid,
      email: data.email
    }, { headers: { "Authorization": `Bearer ${token}` } });
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Content-Type, Authorization',
      'Access-Control-Allow-Methods': '*',
      'Accept': "application/json"
    };
  
    return { 
      statusCode: 200, 
      headers: headers, 
    }
  }
  return { statusCode: 400,headers: headers }
};