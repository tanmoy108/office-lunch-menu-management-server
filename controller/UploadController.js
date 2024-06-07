const ImageKit = require('imagekit');
const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/cmxx5hnyv',
    publicKey: 'public_W/xQwpQ+TpXlVgEAIT/crG3OLgA=',
    privateKey: 'private_+QVralKpeX9HzWEPucpVKdQ+PN4='
  });

exports.uploadFiles = async(req,res)=>{
    var result = imagekit.getAuthenticationParameters();
  res.send(result);
}