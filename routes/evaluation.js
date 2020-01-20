let express = require('express');
var exec = require('child_process').exec, child;
// https://stackoverflow.com/questions/1880198/how-to-execute-shell-command-in-javascript
let router = express.Router();

/* GET home page. */
/*router.get('/', (req, res, next) => {
    console.log(11);
    exec("python test.py --dataroot datasets/horse2zebra/testA --name horse2zebra_pretrained --model test --no_dropout", (error, stdout, stderr) => {
        if (!error) {
            res.json({ "msg": stdout });
        } else {
            res.json({ "msg": stderr });
        }
    });
});*/

router.get('/cyclegan', (req, res, next) => {
    const { option } = req.query;
    exec("python test.py --dataroot datasets/" + option + "/testA --name " + option + "_pretrained --model test --no_dropout", (error, stdout, stderr) => {
        if (!error) {
            res.json({ "msg": stdout });
        } else {
            res.json({ "msg": stderr });
        }
    });
});

router.get('/pix2pix', (req, res, next) => {
    const { option } = req.query;
    const real_locations = {
        'maps': 'map2sat',
        'facades': 'facades_label2photo',
        'night2day': 'day2night',
    }
    console.log(11);
    exec("python test.py --dataroot ./datasets/" + option + " --direction BtoA --model pix2pix --name " + real_locations[option] + "_pretrained", (error, stdout, stderr) => {
        if (!error) {
            res.json({ "msg": stdout });
        } else {
            res.json({ "msg": stderr });
        }
    });
});
/*
router.get('/:image', (req, res, next) => {
    const { image } = req.params;
    const tag = image.split(".")[0].split("_").slice(1).join("-");
    
    console.log(image, tag);

    const query = `bash run_single.sh "sample_data/images/${image}" "${tag}"`
    exec(query, (error, stdout, stderr) => {
        console.log(stdout);
        if (!error) {
            res.json({ "msg": stdout });
        } else {
            res.json({ "msg": stderr });
        }
    });

});
*/
module.exports = router;