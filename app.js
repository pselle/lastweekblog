yaml = require('js-yaml')
  , fs = require('fs')
  , request = require('request')
  , es = require('event-stream')
  , FeedParser = require('feedparser')
  , http = require('http')
  , _ = require('highland')

friends = yaml.safeLoad(fs.readFileSync('friends.yml', 'utf-8'))

http.createServer(function (req, res) {
  var streams = friends.map(function(f) {
    return request(f.rss).pipe(new FeedParser({}))
  })


  var result = es.merge.apply(es.merge, streams)
  var latest = _(result).filter(sinceLastWeek).map(function(post) {
    return "<a href='" + post.link + "'>" + post.title + "</a>, on "
      + post.pubdate + " from " + post.meta.title + "<br>"
  })
  latest.pipe(res)
}).listen(3000)

function sinceLastWeek(post) {
  var pubDateObj = new Date(post.pubdate)
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return pubDateObj > oneWeekAgo;
}

