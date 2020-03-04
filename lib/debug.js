import logger from './logger'

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

                logger.debug(
                    {
                        debug: `fetched ${completeCount} of ${length} — ${crawler._openRequests.length} open requests, ${crawler._openListeners} open listeners`
                    }
                )

                // console.log("fetched %d of %d — %d open requests, %d open listeners",
                //     completeCount,
                //     length,
                //     crawler._openRequests.length,
                //     crawler._openListeners);
            });
        });

        logger.debug({
            debug: `${evtName} - ${queueItem ? queueItem.url ? queueItem.url : queueItem : null}`
        })

        // console.log(evtName, queueItem ? queueItem.url ? queueItem.url : queueItem : null);
        originalEmit.apply(crawler, arguments);
    };
}