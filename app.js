// Copyright, 2013-2014, by Tomas Korcak. <korczis@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function () {
    'use strict';

    var define = require('amdefine')(module);

    /**
     * Array of modules this one depends on.
     * @type {Array}
     */
    var deps = [
        'path',
        './lib'
    ];

    define(deps, function (path, Mc) {
        // First step is to create engine
        var engine = new Mc.Engine();

        // Load example processor from files
        var processorsDir = path.join(__dirname, 'examples');
        engine.loadProcessors(processorsDir);

        // Final results
        var results = [];

        // Register on data event handler
        engine.on('data', function (result) {
            results.push(result);
            console.log(JSON.stringify(result, null, 4));
        });

        /*
         // Register yelp listing processor
         engine.registerProcessor('yelp.listing', require('./examples/yelp/listing.js'));

         // Register yelp details processor
         engine.registerProcessor('yelp.details', require('./examples/yelp/details.js'));

         // Register youjizz listing processor
         engine.registerProcessor('youjizz.listing', require('./examples/youjizz/listing.js'));
         //*/


        /**
         * Return an array of urls for each of 14 regions
         * @returns {Array}
         */
        var baseUrl = exports.baseUrl = 'http://www.sreality.cz/search?category_type_cb=1&category_main_cb=1&price_min=&price_max=&region=&distance=0&rg[]={REGION_CODE_HERE}&usable_area-min=&usable_area-max=&floor_number-min=&floor_number-max=&age=0&extension=0&sort=0&hideRegions=0&discount=-1&perPage=30&page=';

        for (var r = 1; r < 15; r++) {
            var regionUrl = baseUrl.replace("{REGION_CODE_HERE}", r);
            engine.queue.enqueueUrl(regionUrl, 'sreality.listing');
        }

        // Run the main function - parse args, set processor, enqueue urls specified
        engine.main().done(function () {
            // This is handler of success
            console.log('Done, ' + results.length + ' results!');

//            // Retrieve
//            var MongoClient = require('mongodb').MongoClient;
//
//            // Connect to the db
//            MongoClient.connect("mongodb://localhost:27017/exampleDb", function (err, db) {
//                if (err) {
//                    return console.dir(err);
//                }
//
//                var collection = db.collection('test');
//                var doc1 = {'hello': 'doc1'};
//                var doc2 = {'hello': 'doc2'};
//                var lotsOfDocs = [
//                    {'hello': 'doc3'},
//                    {'hello': 'doc4'}
//                ];
//
//                collection.insert(doc1);
//
//                collection.insert(doc2, {w: 1}, function (err, result) {
//                });
//
//                collection.insert(lotsOfDocs, {w: 1}, function (err, result) {
//                });
//
//            });

        }, function (err) {
            // This is handler of error
            console.log('ERROR: ' + err);
        });
    });

}());
