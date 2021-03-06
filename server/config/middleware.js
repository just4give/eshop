/**
 * Created by Mithun.Das on 2/24/2016.
 */
module.exports = {
    create: {
        fetch: function(req, res, context) {

            return context.continue;
        },
        auth: function(req, res, context) {

            return context.continue;
        }
    },
    list: {
        write: {
            before: function(req, res, context) {
                // modify data before writing list data
                return context.continue;
            },
            action: function(req, res, context) {
                // change behavior of actually writing the data
                return context.continue;
            },
            after: function(req, res, context) {
                // set some sort of flag after writing list data
                return context.continue;
            }
        }
    }
};
