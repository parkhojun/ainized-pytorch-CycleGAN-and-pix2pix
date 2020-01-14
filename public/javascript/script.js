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
        await uploadFile(fileList);
        fetchEval();
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

            let button = document.createElement('button');
            button.style.marginLeft = "3px";
            button.type = "button"
            button.innerText = 'RUN';
            button.className = "btn btn-success btn-sm"
            button.value = file.name;

            //button.onclick = fetchEvalSingle;

            fileDisplayEl.innerHTML = file.name;
            fileDisplayEl.append(button);
            fileListDisplay.appendChild(fileDisplayEl);
        });
    };

    function uploadFile(files) {
        return new Promise((resolve) => {
            const formData = new FormData();
            files.forEach(file => formData.append("files", file));

            const xhr = new XMLHttpRequest();
            xhr.open("POST", '/upload');
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);

                    if (!data["status"]) {
                        sendFile(file);
                    } else {
                        resolve();
                    }
                }
            };
            xhr.send(formData);
        });
    };

    function fetchEval() {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 1000 * 30000;
        xhr.open("GET", encodeURI(`/eval`), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            stop_timer();
            if (xhr.readyState === 4 && xhr.status === 200) {
                document.getElementById("result").style.display = "block";
                //document.getElementById("log").innerText = "Success!";
                document.getElementById('rimg').src = `results/horse2zebra_pretrained/test_latest/images/input_fake_B.png`;
            }
        };
        xhr.send(null);
    }
/*
    function fetchEvalSingle(event) {
        event.preventDefault();
        start_timer();

        const image = event.target.value;

        const xhr = new XMLHttpRequest();
        xhr.timeout = 1000 * 3000;
        xhr.open("GET", encodeURI(`/eval/${image}`), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            stop_timer();
            clearInterval(timer);
            if (xhr.readyState === 4 && xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                console.log(data);
                
                document.getElementById("log").innerText = xhr.responseText;
                document.getElementById('rimg').src = `sample_output/cropped_images/${image}`;

                // document.getElementById("result").style.display = "block";
                // document.getElementById("log").innerText = xhr.responseText;
            }
        };
        xhr.send(null);
    }
*/
};