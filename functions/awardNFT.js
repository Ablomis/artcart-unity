const axios = require('axios').default;

exports.handler = async (event, context, callback) => {

  const data = JSON.parse(event.body)

  const responseToken = await axios.post("https://login.artcart.cloud/oauth/token", {
    grant_type: 'client_credentials',
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    audience: 'platform.artcart.app/api/transactional/'
  });
  const token = responseToken.data.access_token;

  const responseTemplates = await axios.get("https://platform.artcart.cloud/api/transactional/templates", 
    { headers: { "Authorization": `Bearer ${token}` } });
  const templatesList = responseTemplates.data;
  const templatesNumber = templatesList.length;

  let eligibleTemplates = [];

  for (i = 0; i<templatesNumber; i++){
    if(templatesList[i].limit === 0 || templatesList[i].count < templatesList[i].limit)
    {
        eligibleTemplates.push(templatesList[i]);
    }
    //ADD ANY CUSTOM LOGIC HERE
    /*
    //------------------------
    */
  }

  

  const responseNFT = await axios.post(`https://platform.artcart.cloud/api/transactional/nft`, {
    cid: data.cid,
    email: data.email
  }, { headers: { "Authorization": `Bearer ${token}` } });
  console.log(responseNFT)
  return { statusCode: 200 }
};