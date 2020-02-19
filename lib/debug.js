export default function debug(crawler) {
    var originalEmit = crawler.emit;
    crawler.emit = function (evtName, queueItem) {
        crawler.queue.countItems({ fetched: true }, function (err, completeCount) {
            if (err) {
                throw err;
            }

            crawler.queue.getLength(function (err, length) {
                if (err) {
                    throw err;
                }

                console.log("fetched %d of %d — %d open requests, %d open listeners",
                    completeCount,
                    length,
                    crawler._openRequests.length,
                    crawler._openListeners);
            });
        });

        console.log(evtName, queueItem ? queueItem.url ? queueItem.url : queueItem : null);
        originalEmit.apply(crawler, arguments);
    };
}