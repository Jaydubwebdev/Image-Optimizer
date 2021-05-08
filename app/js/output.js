// Submit to be placed in separate file
const { ipcRenderer } = require('electron');

        const form = document.getElementById('image-form');
        const slider = document.getElementById('slider');
        const img = document.getElementById('img');

        form.addEventListener('submit', e => {
            e.preventDefault();

            const imgPath = img.files[0].path;
            const quality = slider.value;

            ipcRenderer.send('image:minimize', {
                imgPath: imgPath,
                quality: quality
            });
        });

// Notifcaiton Functionality
ipcRenderer.on('image:done', () => {
    
})