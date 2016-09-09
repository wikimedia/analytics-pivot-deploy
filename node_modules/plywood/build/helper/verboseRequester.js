export function verboseRequesterFactory(parameters) {
    var requester = parameters.requester;
    var printLine = parameters.printLine || (function (line) {
        console['log'](line);
    });
    var preQuery = parameters.preQuery || (function (query, queryNumber) {
        printLine("vvvvvvvvvvvvvvvvvvvvvvvvvv");
        printLine("Sending query " + queryNumber + ":");
        printLine(JSON.stringify(query, null, 2));
        printLine("^^^^^^^^^^^^^^^^^^^^^^^^^^");
    });
    var onSuccess = parameters.onSuccess || (function (data, time, query, queryNumber) {
        printLine("vvvvvvvvvvvvvvvvvvvvvvvvvv");
        printLine("Got result from query " + queryNumber + ": (in " + time + "ms)");
        printLine(JSON.stringify(data, null, 2));
        printLine("^^^^^^^^^^^^^^^^^^^^^^^^^^");
    });
    var onError = parameters.onError || (function (error, time, query, queryNumber) {
        printLine("vvvvvvvvvvvvvvvvvvvvvvvvvv");
        printLine("Got error in query " + queryNumber + ": " + error.message + " (in " + time + "ms)");
        printLine("^^^^^^^^^^^^^^^^^^^^^^^^^^");
    });
    var queryNumber = 0;
    return function (request) {
        queryNumber++;
        var myQueryNumber = queryNumber;
        preQuery(request.query, myQueryNumber);
        var startTime = Date.now();
        return requester(request)
            .then(function (data) {
            onSuccess(data, Date.now() - startTime, request.query, myQueryNumber);
            return data;
        }, function (error) {
            onError(error, Date.now() - startTime, request.query, myQueryNumber);
            throw error;
        });
    };
}
