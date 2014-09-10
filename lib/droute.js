var fs = require('fs');
var path = require('path');

function recursiveRoutes(app, foldName, contextPath) {
  fs.readdirSync(foldName).forEach(function(file) {
    var stat = fs.lstatSync(path.join(foldName, file));
    if (stat.isDirectory()) {
      recursiveRoutes(app, foldName + "/" + file, contextPath + "/" + file);
    } else if (file.length - 3 == file.toLowerCase().indexOf('.js')) {
      try {
        var fileName = file.slice(0, -(path.extname(file).length));
        var parentPath = "";
        if (fileName.toLowerCase() == 'index') {
          parentPath = contextPath + "/";
        } else {
          parentPath = contextPath + "/" + fileName;
        }
        app.use(parentPath, require(foldName + "/" + fileName));
        console.log("require('" + foldName + "/" + file + "')");
      } catch (e) {
        console.error("require('" + foldName + "/" + file + "')," + e);
      }
    }
  });
}

module.exports = function(app, foldName, contextPath) {
  recursiveRoutes(app, path.join(process.cwd(), foldName), contextPath);
}
