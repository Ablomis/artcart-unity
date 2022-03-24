exports.handler = async (event, context, callback) => {

  const data = JSON.parse(event.body)

  const response = await axios.post("https://login.artcart.cloud/oauth/token", {
    grant_type: 'client_credentials',
    client_id: 'OhxzhRbOH51ORXmYnQUakpSv7EElgbhf',
    client_secret: 'JgW4lndE5mYmNt6T961rVa4iic5UzBFbyjxyjvqWhejRLcFk5b1hdxXUr1STEgsu',
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