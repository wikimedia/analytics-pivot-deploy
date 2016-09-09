import * as Q from 'q';
export function retryRequesterFactory(parameters) {
    var requester = parameters.requester;
    var delay = parameters.delay || 500;
    var retry = parameters.retry || 3;
    var retryOnTimeout = Boolean(parameters.retryOnTimeout);
    if (typeof delay !== "number")
        throw new TypeError("delay should be a number");
    if (typeof retry !== "number")
        throw new TypeError("retry should be a number");
    return function (request) {
        var tries = 1;
        function handleError(err) {
            if (tries > retry)
                throw err;
            tries++;
            if (err.message === "timeout" && !retryOnTimeout)
                throw err;
            return Q.delay(delay).then(function () { return requester(request); }).catch(handleError);
        }
        return requester(request).catch(handleError);
    };
}
