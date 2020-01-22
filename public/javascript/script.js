let model;
let option = "";

if(option === 'maps'){
    model = "pix2pix";
}
else if(option === 'facades'){
    model = "pix2pix";
}
else if(option === 'night2day'){
    model = "pix2pix";
}
else{
    model = "cyclegan";
}

window.onload = () => {
    let fileCatcher = document.getElementById('file-catcher');
    let fileInput = document.getElementById('file-input');
    let fileListDisplay = document.getElementById('file-list-display');

    let fileList = [];
    let renderFileList, sendFile;

    let time_obj = document.getElementById("time");
    let timer = undefined;
    let start = undefined;

    function start_timer() {
        document.getElementById("preloader").style.display = "block";

        start = 0;
        timer = setInterval(() => {
            start += 1;
            time_obj.innerText = `${start / 10} 's`;
        }, 100);
    }

    function stop_timer() {
        document.getElementById("preloader").style.display = "none";
        clearInterval(timer);
    }

    document.getElementById("select")
        .addEventListener('click', (event) => {
            event.preventDefault();
            fileInput.click();
        });

    fileCatcher.addEventListener('submit', async (event) => {
        event.preventDefault();
        start_timer();
        const filename = await uploadFile(fileList);
        
        if (model === "cyclegan"){
        fetchEval(filename, model, option);
        }else{
            fetchEvalpix2pix(filename, model, option);
        }
    });

    fileInput.addEventListener('change', (event) => {
        fileList = [];
        for (let i = 0; i < fileInput.files.length; i++) {
            fileList.push(fileInput.files[i]);
        }
        renderFileList();
    });

    renderFileList = () => {
        fileListDisplay.innerHTML = '';
        fileList.forEach((file, index) => {
            let fileDisplayEl = document.createElement('li');
            fileDisplayEl.style.padding = "3px";

            fileDisplayEl.innerHTML = file.name;
            fileListDisplay.appendChild(fileDisplayEl);
        });
    };

    function uploadFile(files) {
        return new Promise((resolve) => {
            const formData = new FormData();
            files.forEach(file => formData.append("files", file));

            const xhr = new XMLHttpRequest();
            xhr.open("POST", '/upload?option=' + option);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);

                    if (!data["status"]) {
                        sendFile(file);
                    } else {
                        resolve(data["filename"]);
                    }
                }
            };
            xhr.send(formData);
        });
    };

    function fetchEval(filename, model, option) {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 1000 * 30000;
        xhr.open("GET", encodeURI(`/eval/` + model + '?option=' + option), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            stop_timer();
            if (xhr.readyState === 4 && xhr.status === 200) {
                document.getElementById("result").style.display = "block";
                let filename_without_ext = filename.split('.')[0];
                document.getElementById('rimg').src = 'results/' +  option + '_pretrained/test_latest/images/' + filename_without_ext + '_fake_B.png';
            }
        };
        xhr.send(null);
    }

    function fetchEvalpix2pix(filename, model, option) {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 1000 * 30000;
        xhr.open("GET", encodeURI(`/eval/` + model + '?option=' + option), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            stop_timer();
            if (xhr.readyState === 4 && xhr.status === 200) {
                document.getElementById("result").style.display = "block";
                let filename_without_ext = filename.split('.')[0];
                if(option === 'maps'){
                    document.getElementById('rimg').src = 'results/map2sat_pretrained/test_latest/images/' + filename_without_ext + '_fake_B.png';
                }
                else if(option === 'facades'){
                    document.getElementById('rimg').src = 'results/facades_label2photo_pretrained/test_latest/images/' + filename_without_ext + '_fake_B.png';

                }
                else if(option === 'night2day'){
                    document.getElementById('rimg').src = 'results/day2night_pretrained/test_latest/images/' + filename_without_ext + '_fake_B.png';

                }
                else{
                      }
                //document.getElementById('rimg').src = 'results/' +  option + '_pretrained/test_latest/images/' + filename_without_ext + '_fake_B.png';
            }
        };
        xhr.send(null);
    }
};