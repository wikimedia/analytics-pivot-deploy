export function basicExecutorFactory(parameters) {
    var datasets = parameters.datasets;
    return function (ex, env) {
        if (env === void 0) { env = {}; }
        return ex.compute(datasets, env);
    };
}
