let express = require('express');
var exec = require('child_process').exec, child;
// https://stackoverflow.com/questions/1880198/how-to-execute-shell-command-in-javascript
const multer = require('multer');
const uuid = require('uuid');


let router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploaded')
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + file.originalname)
    }
})
const upload = multer({ storage: storage });


function move_file_to_right_location(filename, option) {
    
    var final_location = "datasets/" + option + "/testA/";

    if(option === 'maps'){
        final_location = "datasets/"+ option +"/test/";
    }
    else if(option === 'facades'){
        final_location = "datasets/"+ option +"/test/";
    }
    else if(option === 'night2day'){
        final_location = "datasets/"+ option +"/test/";
    }
    else{
        final_location = "datasets/"+ option +"/testA/";
    }
    
    console.log(final_location);
    const final_command = "mv ./uploaded/" + filename + " " + final_location;
    console.log(final_command);
    return new Promise((resolve, reject) => {
        exec(final_command, (error, stdout, stderr) => {
            console.log({stdout, stderr});
            if (!error) {
                resolve({stdout, stderr});
            } else {
                reject({error, stderr});
            }
        });
    });
};


// WEB_UI EDITION = RUNNING ONLY (UPLOAD AND REDIRECTION REQUIRED!)
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

// SWAGGER EDITION = UPLOAD + RUNNING
router.post('/cyclegan', upload.array('files', 1), (req, res, next) => {
    const { files } = req;
    const { option } = req.query;
    if (!files) {
        // FIXME: FILE UPLOAD ERROR!!!!!!!!!!!!
        res.status(400);
        res.json({"status": "file upload error"});
    } else {
        const filename = files[0].filename;
        console.log({filename, option});
        move_file_to_right_location(filename, option)
        .then(() => {
            exec("python test.py --dataroot datasets/" + option + "/testA --name " + option + "_pretrained --model test --no_dropout", (error, stdout, stderr) => {
                if (!error) {
                    // FIXME: SHOW SUCCESS FILE TO res!
                    const filename_without_ext = filename.split('.')[0];
                    const real_file_location = `results/${option}_pretrained/test_latest/images/${filename_without_ext}_fake_B.png`;
                    res.download(real_file_location);
                } else {
                    res.status(500);
                    res.json({"status": "ml test error"});
                    // FIXME: TEST ERROR!!!!!!
                }
            });
        })
        .catch(() => {
            res.status(500);
            res.json({"status": "file move error"});
        })
    }

});

// WEB_UI EDITION = RUNNING ONLY (UPLOAD AND REDIRECTION REQUIRED!)
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

// SWAGGER EDITION = UPLOAD + RUNNING
router.post('/pix2pix', upload.array('files', 1), (req, res, next) => {
    const { files } = req;
    const { option } = req.query;
    const real_locations = {
        'maps': 'map2sat',
        'facades': 'facades_label2photo',
        'night2day': 'day2night',
    }
    console.log(11);
    if (!files) {
        // FIXME: FILE UPLOAD ERROR!!!!!!!!!!!!
        res.status(400);
        res.json({"status": "file upload error"});
    } else {
        const filename = files[0].filename;
        console.log({filename, option});
        move_file_to_right_location(filename, option)
        .then(() => {
            exec("python test.py --dataroot ./datasets/" + option + " --direction BtoA --model pix2pix --name " + real_locations[option] + "_pretrained", (error, stdout, stderr)  => {
                if (!error) {
                    // FIXME: SHOW SUCCESS FILE TO res!
                    const filename_without_ext = filename.split('.')[0];
                    const real_file_location = `results/${real_locations[option]}_pretrained/test_latest/images/${filename_without_ext}_fake_B.png`;
                    res.download(real_file_location);
                } else {
                    res.status(500);
                    res.json({"status": "ml test error"});
                    // FIXME: TEST ERROR!!!!!!
                    //console.log(error)
                }
            });
        })
        .catch(() => {
            res.status(500);
            res.json({"status": "file move error"});
        })
    }

});

module.exports = router;