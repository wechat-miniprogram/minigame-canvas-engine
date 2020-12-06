'use strict';

const nodeToJson = require('./node2json');
const xmlToNodeobj = require('./xmlstr2xmlnode');
const x2xmlnode = require('./xmlstr2xmlnode');
const buildOptions = require('./util').buildOptions;
// const validator = require('./validator');

exports.parse = function(xmlData, options, validationOption) {
   if( validationOption){
     if(validationOption === true) validationOption = {}

    //  const result = validator.validate(xmlData, validationOption);
    //  if (result !== true) {
    //    throw Error( result.err.msg)
    //  }
   }
  options = buildOptions(options, x2xmlnode.defaultOptions, x2xmlnode.props);
  return nodeToJson.convertToJson(xmlToNodeobj.getTraversalObj(xmlData, options), options);
};

