exports.replaceKeys = (preDelimeter, postDelimeter, keyValues, path) => {
  let replacedPath = path;

  if (keyValues){
    const entries = Object.entries(keyValues)
    for (let kindex = 0; kindex < entries.length; kindex++) {
      const keyElement = entries[kindex];
      let templateKey =`${preDelimeter}${keyElement[0]}${postDelimeter}`;
      replacedPath = replaceAll(replacedPath, templateKey, keyElement[1])
    }  
  }
  return replacedPath;
}


const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace);
}


exports.replaceContent = (preDelimeter, postDelimeter, keyValues, content) => {
  let fullContent = content;

  if (keyValues){
    const entries = Object.entries(keyValues)
    for (let kindex = 0; kindex < entries.length; kindex++) {
      const keyElement = entries[kindex];
      let templateKey =`${preDelimeter}${keyElement[0]}${postDelimeter}`;
      fullContent = replaceAll(fullContent, templateKey, keyElement[1])
    }  
  }
  return fullContent;
}