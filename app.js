yaml = require('js-yaml')
  , fs = require('fs')
  , request = require('request')
  , es = require('event-stream')
  , FeedParser = require('feedparser')
  , http = require('http')

friends = yaml.safeLoad(fs.readFileSync('friends.yml', 'utf-8'))
lastWeek = 1 // Find out how to look for files from last week

http.createServer(function (req, res) {
//  var streams = ['https://gist.githubusercontent.com/nathanbowser/395a49b40425ae9d6f3a/raw/4d2c3e838a6850cde97264e0d67e3f22c02cf5c9/gistfile1.txt',
//                 'https://gist.githubusercontent.com/nathanbowser/7f62d217227cae90ef7a/raw/182d185ae25cbfb4c3ea6d3e63f6f70dcace4909/gistfile1.txt'].map(function (gist) {
//    return request(gist).pipe(JSONStream.parse(['lifts', true]))
//  })

  var streams = friends.map(function(f) {
    return request(f.rss).pipe(new FeedParser({}))
  })


  var result = es.merge.apply(es.merge, streams)
  result.pipe(es.stringify()).pipe(res)
}).listen(3000)

//var streams = friends.map(function(f) {
//  return request(f.rss).pipe(new FeedParser({});
//}


// friends.map(function annotate(curr, index, arr) {
//   curr.posts = [];
//   curr.postCount = 0;
//   return curr;
// });
//
// console.log(friends);

