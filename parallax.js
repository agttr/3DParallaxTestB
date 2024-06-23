document.addEventListener('DOMContentLoaded', () => {
    const layers = [
        { src: 'layer1.png', depth: 4000, zIndex: 1, tiltFactor: 1, scale: 3.54 },    // Furthest layer
        { src: 'layer2.png', depth: 3000, zIndex: 2, tiltFactor: 0.8, scale: 2.8 },
        { src: 'layer3.png', depth: 2000, zIndex: 3, tiltFactor: 0.6, scale: 2.2 },
        { src: 'layer4.png', depth: 1000, zIndex: 4, tiltFactor: 0.4, scale: 1.6 },
        { src: 'layer5.png', depth: 0, zIndex: 5, tiltFactor: 0.2, scale: 1.8 }    // Closest layer
    ];

    const container = document.getElementById('parallax-container');

    layers.forEach((layer, index) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('layer');
        wrapper.style.transform = `translateZ(${-layer.depth}px) scale(${layer.scale})`;
        wrapper.style.zIndex = layer.zIndex;
        wrapper.dataset.layerIndex = index;

        const img = document.createElement('img');
        img.src = layer.src;

        wrapper.appendChild(img);

        img.onload = () => {
            console.log(`Loaded ${layer.src}`);
            container.appendChild(wrapper);
        };

        img.onerror = () => {
            console.error(`Error loading ${layer.src}`);
        };
    });

    // Add event listeners for mouse movement
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        layers.forEach((layer, index) => {
            const layerElement = document.querySelector(`.layer[data-layer-index="${index}"]`);
            layerElement.style.transform = `translateZ(${-layer.depth}px) scale(${layer.scale}) rotateY(${x * 30 * layer.tiltFactor}deg) rotateX(${-y * 30 * layer.tiltFactor}deg)`;
        });
    });

    // Request permission for device orientation on iOS 13+ devices
    function requestOrientationPermission() {
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                })
                .catch(console.error);
        } else {
            // Handle other browsers or older iOS versions
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }

    // Handle device orientation
    function handleOrientation(e) {
        const x = e.gamma / 30;
        const y = e.beta / 30;

        layers.forEach((layer, index) => {
            const layerElement = document.querySelector(`.layer[data-layer-index="${index}"]`);
            layerElement.style.transform = `translateZ(${-layer.depth}px) scale(${layer.scale}) rotateY(${x * 30 * layer.tiltFactor}deg) rotateX(${-y * 30 * layer.tiltFactor}deg)`;
        });
    }

    // Request permission on load
    requestOrientationPermission();
});
