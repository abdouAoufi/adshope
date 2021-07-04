const path = require("path");
// give you always the root regadless where you are !!
module.exports = path.dirname(process.mainModule.filename);
