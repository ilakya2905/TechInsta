if(process.env.NODE_ENV === 'production'){
    //if running env is production - move to prod.js file
    module.exports = require('./prod')
}
else{
    //else move to dev.js file
    module.exports = require('./dev')
}