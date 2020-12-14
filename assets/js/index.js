function LoadImage(url, name) {
    const stage = new Konva.Stage({
        container: 'container',
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const layer = new Konva.Layer();

    var text = new Konva.Text({
        x: 10,
        y: 15,
        text: '',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'white',
    });
    layer.add(text);

    var text2 = new Konva.Text({
        x: 10,
        y: 45,
        text: '',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'white',
    });
    layer.add(text2);

    stage.add(layer);

    function updateText(e) {
        text.text('x = ' + e.target.x() + '   y = ' + e.target.y());
        layer.batchDraw();
        document.getElementById("moveCommand").innerText = "!move " + name + " " + e.target.x() + " " + e.target.y();
        document.getElementById("moveCommand").innerText = "!rotation " + name + " " + e.target.rotation();
        document.getElementById("imgCommand").innerText = "!image " + url + " " + name + " ";
    }

    function showScale(naturalWidth, naturalHeight, sizedWidth, sizedHeight) {
        var scale = parseInt(sizedWidth) / parseInt(naturalWidth);
        text2.text('s = ' + scale);
        layer.batchDraw();

        document.getElementById("scaleCommand").innerText = "!scale " + name + " " + scale;
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

    var uploadedImg = Konva.Image.fromURL(
        //'750a5371-bbbb-4351-82f1-1e345da9b7c8.png',
        url,
        (img) => {
            img.setAttrs({
                x: 0,
                y: 0,
                name: 'image',
                draggable: true,
            });
            img.on('dragmove', updateText);
            layer.add(img);
            // apply default left-top crop
            console.log(img);

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

            img.on('transform', () => {
                // reset scale on transform
                img.setAttrs({
                    scaleX: 1,
                    scaleY: 1,
                    width: img.width() * img.scaleX(),
                    height: img.height() * img.scaleY(),
                });

                showScale(img.attrs.image.naturalWidth, img.attrs.image.naturalHeight, (img.width() * img.scaleX()), (img.height() * img.scaleY()));

                applyCrop(img.getAttr('lastCropUsed'));
            });
        }
    );

    //uploadedImg.on('dragmove', updateText);
}

function submissionMade() {
    LoadImage(document.getElementById("url").value, document.getElementById("name").value);
}
