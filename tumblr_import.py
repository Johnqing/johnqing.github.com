#!/usr/bin/env python

from getpass import getpass
import logging
from os import getcwd
from os.path import join
import re
import sys
from time import sleep
from urllib import urlopen, urlencode
from xml.dom.minidom import parse

try:
    from daemon import daemonize
    from django.utils.html import urlize
    from feedparser import parse as fparse
    import twitter
except ImportError:
    print "Daemon, Django, Twitter and FeedParser libraries required."
    exit()


tumblr_email = "stephen.mc@gmail.com"
twitter_user = "stephen_mcd"
rss_url = "http://johnqing.github.io/atom.xml"
re_usernames = re.compile("@([0-9a-zA-Z+_]+)", re.IGNORECASE)
replace_usernames = "<a href=\"http://twitter.com/\\1\">@\\1</a>"

if tumblr_email:
    tumblr_pass = getpass("Tumblr Password: ")

logging.basicConfig(format="%(asctime)-15s %(levelname)-5s %(message)s",
                    filename=join(getcwd(), "tumblr_import.log"), filemode="wb")
daemonize(join(getcwd(), "tumblr_import.pid"))


def publish(title, body, date, tags):
    """
    Publish an entry to Tumblr.
    """
    data = {
        "email": tumblr_email,
        "password": tumblr_pass,
        "type": "regular",
        "body": body.encode("utf-8"),
        "date": date,
        "tags": ",".join([t.encode("utf-8") for t in tags]),
    }
    if title:
        data["title"] = title.encode("utf-8")
    text = urlopen("http://www.tumblr.com/api/write", urlencode(data)).read()
    if "You've exceeded your daily post limit." in text:
        logging.info(text + " (will retry in an hour).")
        sleep(60 * 60)
        publish(title, body, date, tags)


logging.info("Deleting existing posts")
url = fparse(urlopen("http://www.tumblr.com/api/authenticate", urlencode({
    "email": tumblr_email,
    "password": tumblr_pass,
}))).feed.tumblelog["url"]
while True:
    posts = parse(urlopen(url + "api/read")).getElementsByTagName("post")
    if not posts:
        break
    for post in posts:
        post_id = post.getAttribute("id")
        try:
            urlopen("http://www.tumblr.com/api/delete", urlencode({
                "email": tumblr_email,
                "password": tumblr_pass,
                "post-id": post_id,
            }))
        except Exception, e:
            logging.info("\nError deleting Tumblr post (will retry): %s"  % e)
        else:
            logging.info("Post deleted")


if twitter_user:
    logging.info("Importing tweets.")
    last_id = None
    count = 200
    api = twitter.Api()
    while True:
        kwargs = {
            "max_id": last_id - 1 if last_id is not None else last_id,
            "count": count,
        }
        try:
            tweets = api.GetUserTimeline(twitter_user, **kwargs)
        except twitter.TwitterError, e:
            logging.info("Error getting tweets (will retry): %s" % e)
            count -= 1
            if count:
                sleep(10)
                continue
            break
        if not tweets:
            break
        for tweet in tweets:
            reply = tweet.text.startswith("@")
            tumblr = "http://tumblr.com" in tweet.text
            if not reply and not tumblr:
                words = tweet.text.split()
                text = " ".join([w for w in words if not w.startswith("#")])
                tags = [w.lstrip("#") for w in words if w.startswith("#")]
                text = re_usernames.sub(replace_usernames, urlize(text))
                try:
                    publish("", text, tweet.created_at, tags)
                except Exception, e:
                    logging.info("Error posting (will retry): %s"  % e)
                    break
                else:
                    logging.info("Tweet posted: %s" % text)
            last_id = tweet.id

if rss_url:
    logging.info("Importing RSS feed.")
    posts = fparse(rss_url)["entries"]
    for post in posts:
        tags = [tag["term"] for tag in post.tags]
        publish(post.title, post.content[0]["value"], post.updated, [])
        logging.info("Entry posted: %s" % post.title)
