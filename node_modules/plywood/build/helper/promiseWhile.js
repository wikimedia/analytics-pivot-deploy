import * as Q from 'q';
export function promiseWhile(condition, action) {
    var loop = function () {
        if (!condition())
            return Q(null);
        return Q(action()).then(loop);
    };
    return Q(null).then(loop);
}
