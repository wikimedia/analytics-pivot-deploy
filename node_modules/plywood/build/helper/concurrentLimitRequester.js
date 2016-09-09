import * as Q from 'q';
export function concurrentLimitRequesterFactory(parameters) {
    var requester = parameters.requester;
    var concurrentLimit = parameters.concurrentLimit || 5;
    if (typeof concurrentLimit !== "number")
        throw new TypeError("concurrentLimit should be a number");
    var requestQueue = [];
    var outstandingRequests = 0;
    function requestFinished() {
        outstandingRequests--;
        if (!(requestQueue.length && outstandingRequests < concurrentLimit))
            return;
        var queueItem = requestQueue.shift();
        var deferred = queueItem.deferred;
        outstandingRequests++;
        requester(queueItem.request)
            .then(deferred.resolve, deferred.reject)
            .fin(requestFinished);
    }
    return function (request) {
        if (outstandingRequests < concurrentLimit) {
            outstandingRequests++;
            return requester(request).fin(requestFinished);
        }
        else {
            var deferred = Q.defer();
            requestQueue.push({
                request: request,
                deferred: deferred
            });
            return deferred.promise;
        }
    };
}
