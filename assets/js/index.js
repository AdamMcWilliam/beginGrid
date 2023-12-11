    stage = new Konva.Stage({
        container: 'container',
        width: 1600,
        height: 1000,
    });

    layer = new Konva.Layer();
    stage.add(layer);

    new Twitch.Embed("twitch-embed", {
        width: 1280,
        height: 720,
        channel: "beginbot",
        layout: "video",
        muted: "true",
    });

    function LoadImage(url, files, fileName) {

        function updateText(e) {
            if (url.includes(".gif")) {
                var imgCommand = "!gif";
            } else {
                var imgCommand = "!image";
            }

            //dont show upload command for beginworld images
            if (files) {
                document.getElementById("imgCommand").innerText = imgCommand + " " + url + " " + e.target.id();
            } else {
                document.getElementById("imgCommand").innerText = "!image [URL] [NAME]";
            }

            document.getElementById("moveCommand").innerText = "!move " + e.target.id() + " " + (Math.round(e.target.x())) + " " + (Math.round(e.target.y()));
            document.getElementById("rotateCommand").innerText = "!rotate " + e.target.id() + " " + e.target.rotation();

            //set pipes
            document.getElementById("pipeFind").innerText = "!find " + e.target.id() + " | ";
            document.getElementById("pipeMove").innerText = "!move " + e.target.id() + " " + (Math.round(e.target.x())) + " " + (Math.round(e.target.y())) + " | ";
            document.getElementById("pipeRotate").innerText = "!rotate " + e.target.id() + " " + e.target.rotation();

            //set default scale for piping
            if (document.getElementById('pipeScale').innerHTML == "!scale [NAME] [SIZE]") {
                document.getElementById("pipeScale").innerText = "!scale " + e.target.id() + " " + "1" + " | ";
            }
        }

        function showScale(naturalWidth, naturalHeight, sizedWidth, sizedHeight, img) {
            var scale = parseInt(sizedWidth) / parseInt(naturalWidth);
            //get 2 decimals places
            scale = Math.round((scale + Number.EPSILON) * 100) / 100;
            document.getElementById("scaleCommand").innerText = "!scale " + img.id() + " " + scale;
            document.getElementById("pipeScale").innerText = "!scale " + img.id() + " " + scale + " | ";
        }

        // function to calculate crop values from source image, its visible size and a crop strategy
        function getCrop(image, size, clipPosition = 'center-middle') {
            const width = size.width;
            const height = size.height;
            const aspectRatio = width / height;

            let newWidth;
            let newHeight;

            const imageRatio = image.width / image.height;

            if (aspectRatio >= imageRatio) {
                newWidth = image.width;
                newHeight = image.width / aspectRatio;
            } else {
                newWidth = image.height * aspectRatio;
                newHeight = image.height;
            }

            let x = 0;
            let y = 0;
            if (clipPosition === 'left-top') {
                x = 0;
                y = 0;
            } else if (clipPosition === 'left-middle') {
                x = 0;
                y = (image.height - newHeight) / 2;
            } else if (clipPosition === 'left-bottom') {
                x = 0;
                y = image.height - newHeight;
            } else if (clipPosition === 'center-top') {
                x = (image.width - newWidth) / 2;
                y = 0;
            } else if (clipPosition === 'center-middle') {
                x = (image.width - newWidth) / 2;
                y = (image.height - newHeight) / 2;
            } else if (clipPosition === 'center-bottom') {
                x = (image.width - newWidth) / 2;
                y = image.height - newHeight;
            } else if (clipPosition === 'right-top') {
                x = image.width - newWidth;
                y = 0;
            } else if (clipPosition === 'right-middle') {
                x = image.width - newWidth;
                y = (image.height - newHeight) / 2;
            } else if (clipPosition === 'right-bottom') {
                x = image.width - newWidth;
                y = image.height - newHeight;
            } else if (clipPosition === 'scale') {
                x = 0;
                y = 0;
                newWidth = width;
                newHeight = height;
            } else {
                console.error(
                    new Error('Unknown clip position property - ' + clipPosition)
                );
            }

            return {
                cropX: x,
                cropY: y,
                cropWidth: newWidth,
                cropHeight: newHeight,
            };
        }

        // function to apply crop
        function applyCrop(pos) {
            const img = layer.findOne('.image');
            img.setAttr('lastCropUsed', pos);
            const crop = getCrop(
                img.image(), {
                    width: img.width(),
                    height: img.height()
                },
                pos
            );
            img.setAttrs(crop);
            layer.draw();
        }

        const uploadImg = new Image();
        uploadImg.onload = () => {

        };
        uploadImg.crossOrigin = 'Anoymous';

        //Already on beginworld
        if (!files) {
            uploadImg.src = url;
        }
        //local uploaded new image
        else {
            uploadImg.src = URL.createObjectURL(files);
        }

        var uploadedImg = Konva.Image.fromURL(
            uploadImg.src,
            (img) => {
                img.setAttrs({
                    x: 0,
                    y: 0,
                    name: 'image',
                    id: fileName,
                    draggable: true,

                });
                img.on('dragmove', updateText);

                layer.add(img);

                const tr = new Konva.Transformer({
                    nodes: [img],
                    keepRatio: true,
                    boundBoxFunc: (oldBox, newBox) => {
                        if (newBox.width < 10 || newBox.height < 10) {
                            return oldBox;
                        }
                        return newBox;
                    },
                });

                layer.add(tr);
                layer.draw();

                //hide load wheel
                document.getElementById("loadOverlay").style.display = "none";

                img.on('transform', () => {
                    // reset scale on transform
                    img.setAttrs({
                        scaleX: 1,
                        scaleY: 1,
                        width: img.width() * img.scaleX(),
                        height: img.height() * img.scaleY(),
                    });

                    showScale(img.attrs.image.naturalWidth, img.attrs.image.naturalHeight, (img.width() * img.scaleX()), (img.height() * img.scaleY()), img);

                    applyCrop(img.getAttr('lastCropUsed'));
                });
            }
        );

    }

    window.addEventListener('load', function() {

        //parseModes('../assets/includes/php/scrapeMode.php');

        document.querySelector('#ImgSelector button').addEventListener('click', function() {
            // Show load wheel
            document.getElementById("imgSelectorLoadOverlay").style.display = "block";
        
            // Get Images that have already been uploaded to the system
            parseJS("../assets/includes/js/scrapeMemes.js");
        });
        
        function parseJS(filePath) {
            // Assuming parseHTML is a function that takes a file path and parses its content
            // Make sure parseHTML function is defined before calling this
        
            // Fetch the JavaScript file
            fetch(filePath)
                .then(response => response.text())
                .then(data => {
                    // Assuming parseHTML is a function that takes HTML content and parses it
                    parseHTML(data);
                })
                .catch(error => {
                    console.error('Error fetching or parsing JavaScript file:', error);
                });
        }

        document.querySelector('input[type="file"]').addEventListener('change', function() {
            if (this.files && this.files[0]) {

                //upload to imgur
                const onComplete = (imgUrl) => {
                    var fileName = document.getElementById('file').value;
                    //split to just name
                    fileNameStriped = fileName.split("\\");
                    fileNameStriped = fileNameStriped[2].split(".");
                    fileName = fileNameStriped[0];

                    LoadImage(imgUrl, this.files[0], fileName);
                }

                uploadImg(this.files[0], onComplete);
            }
        });
    });

    function copyDivToClipboard(elem) {
        var range = document.createRange();
        range.selectNode(document.getElementById(elem));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
    }

    document.getElementById("imageBtn").addEventListener("click", function() {
        copyDivToClipboard('imgCommand');
    });

    document.getElementById("moveBtn").addEventListener("click", function() {
        copyDivToClipboard('moveCommand');
    });

    document.getElementById("scaleBtn").addEventListener("click", function() {
        copyDivToClipboard('scaleCommand');
    });

    document.getElementById("rotateBtn").addEventListener("click", function() {
        copyDivToClipboard('rotateCommand');
    });

    document.getElementById("pipeBtn").addEventListener("click", function() {
        copyDivToClipboard('pipedCommands');
    });

    function openNav() {
        document.getElementById("mySidenav").style.width = "300px";
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }