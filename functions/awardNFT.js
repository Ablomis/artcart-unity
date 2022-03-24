const axios = require('axios').default;

exports.handler = async (event, context, callback) => {

  const data = JSON.parse(event.body)

  const response = await axios.post("https://login.artcart.cloud/oauth/token", {
    grant_type: 'client_credentials',
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    audience: 'platform.artcart.app/api/transactional/'
  });
  const token = response.data.access_token;
  logger.info(response)

  const response2 = await axios.post(`https://platform.artcart.cloud/api/transactional/nft`, {
    cid: data.cid,
    email: data.email
  }, { headers: { "Authorization": `Bearer ${token}` } });
  console.log(response2)
  return(response2)
};