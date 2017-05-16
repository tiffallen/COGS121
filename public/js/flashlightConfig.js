
/** Firebase Settings
 ***************************************************/

// Your Firebase instance where we will listen and write search results
exports.FB_URL   = process.env.FB_URL || 'https://explore-ucsd.firebaseio.com/';

// The path in your Firebase where clients will write search requests
exports.FB_REQ   = process.env.FB_REQ || 'search/request';

// The path in your Firebase where this app will write the results
exports.FB_RES   = process.env.FB_RES || 'search/response';

// See https://firebase.google.com/docs/server/setup for instructions
// to auto-generate the service-account.json file
exports.FB_SERVICEACCOUNT = process.env.FB_ACC || '../service-account.json';

/** ElasticSearch Settings
 *********************************************/

if( process.env.BONSAI_URL ) {
  processBonsaiUrl(exports, process.env.BONSAI_URL);
}
else {
  // ElasticSearch server's host URL
  exports.ES_HOST  = process.env.ES_HOST || 'banyan-9655587.us-east-1.bonsaisearch.net';

  // ElasticSearch server's host port
  exports.ES_PORT  = process.env.ES_PORT || '80';

  // ElasticSearch username for http auth
  exports.ES_USER  = process.env.ES_USER || 'slp0clu4';

  // ElasticSearch password for http auth
  exports.ES_PASS  = process.env.ES_PASS || '59ie213qvcom1ny9';
}

/** Paths to Monitor
 *
 * Each path can have these keys:
 * {string}   path:    [required] the Firebase path to be monitored, for example, `users/profiles`
 *                     would monitor https://<instance>.firebaseio.com/users/profiles
 * {string}   index:   [required] the name of the ES index to write data into
 * {string}   type:    [required] name of the ES object type this document will be stored as
 * {Array}    fields:  list of fields to be monitored and indexed (defaults to all fields, ignored if "parser" is specified)
 * {Array}    omit:    list of fields that should not be indexed in ES (ignored if "parser" is specified)
 * {Function} filter:  if provided, only records that return true are indexed
 * {Function} parser:  if provided, the results of this function are passed to ES, rather than the raw data (fields is ignored if this is used)
 * {Function} refBuilder: see README
 *
 * To store your paths dynamically, rather than specifying them all here, you can store them in Firebase.
 * Format each path object with the same keys described above, and store the array of paths at whatever
 * location you specified in the FB_PATHS variable. Be sure to restrict that data in your Security Rules.
 ****************************************************/
exports.paths = [
  {
    path : "users",
    index: "firebase",
    type : "user"
  },
  {
    path  : "messages",
    index : "firebase",
    type  : "message",
    fields: ['msg', 'name'],
    filter: function(data) { return data.name !== 'system'; }
    // see readme
    //, parser: function(data) { data.msg = data.msg.toLowerCase(); return data; }
    // see readme
    //, refBuilder: function(ref, path) { return ref.orderBy(path.sortField).startAt(Date.now()); }
  }
];

// Paths can also be stored in Firebase! See README for details.
//exports.paths = process.env.FB_PATHS || null;

// Additional options for ElasticSearch client
exports.ES_OPTS = {
  //requestTimeout: 60000, maxSockets: 100, log: 'error'
};

/** Config Options
 ***************************************************/

// How often should the script remove unclaimed search results? probably just leave this alone
exports.CLEANUP_INTERVAL =
  process.env.NODE_ENV === 'production' ?
  3600 * 1000 /* once an hour */ :
  60 * 1000 /* once a minute */;

function processBonsaiUrl(exports, url) {
  var matches = url.match(/^https?:\/\/([^:]+):([^@]+)@([^/]+)\/?$/);
  exports.ES_HOST = matches[3];
  exports.ES_PORT = 80;
  exports.ES_USER = matches[1];
  exports.ES_PASS = matches[2];
  console.log('Configured using BONSAI_URL environment variable', url, exports);
}