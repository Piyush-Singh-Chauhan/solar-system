(() => {
    const container = document.getElementById('canvas-container');
    const speedControls = document.getElementById('speed-controls');
    const pauseResumeButton = document.getElementById('pause-resume');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 1.5);
    scene.add(sunLight);

    const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc33 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    const planetsData = [
        { name: 'Mercury', size: 0.4, distance: 5, color: 0xaaaaaa, orbitSpeed: 0.02, rotationSpeed: 0.1 },
        { name: 'Venus', size: 0.95, distance: 7, color: 0xeecda3, orbitSpeed: 0.015, rotationSpeed: 0.07 },
        { name: 'Earth', size: 1, distance: 9, color: 0x4169e1, orbitSpeed: 0.01, rotationSpeed: 0.05 },
        { name: 'Mars', size: 0.53, distance: 11, color: 0xb44a17, orbitSpeed: 0.008, rotationSpeed: 0.04 },
        { name: 'Jupiter', size: 2.2, distance: 14, color: 0xd2b48c, orbitSpeed: 0.005, rotationSpeed: 0.03 },
        { name: 'Saturn', size: 1.85, distance: 17, color: 0xf1e2a6, orbitSpeed: 0.004, rotationSpeed: 0.02 },
        { name: 'Uranus', size: 1.3, distance: 20, color: 0x7fffd4, orbitSpeed: 0.003, rotationSpeed: 0.02 },
        { name: 'Neptune', size: 1.25, distance: 23, color: 0x4169e1, orbitSpeed: 0.002, rotationSpeed: 0.02 },
    ];

    const planets = [];
    let isPaused = false;

    planetsData.forEach(data => {
        const geometry = new THREE.SphereGeometry(data.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: data.color });
        const planet = new THREE.Mesh(geometry, material);
        planet.userData = { orbitSpeed: data.orbitSpeed, rotationSpeed: data.rotationSpeed };
        planets.push(planet);
        scene.add(planet);

        const speedControl = document.createElement('div');
        speedControl.innerHTML = `${data.name}: <input type="range" min="0" max="0.1" step="0.001" value="${data.orbitSpeed}" data-planet="${data.name}">`;
        speedControls.appendChild(speedControl);
    });

    camera.position.z = 30;

    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    function animate() {
        if (!isPaused) {
            planets.forEach((planet, index) => {
                const speed = planet.userData.orbitSpeed;
                planet.rotation.y += planet.userData.rotationSpeed;
                planet.position.x = Math.cos(Date.now() * 0.001 * speed) * planetsData[index].distance;
                planet.position.z = Math.sin(Date.now() * 0.001 * speed) * planetsData[index].distance;
            });
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', (event) => {
            const planetName = event.target.dataset.planet;
            const planet = planets.find(p => p.userData.orbitSpeed === parseFloat(event.target.value));
            if (planet) {
                planet.userData.orbitSpeed = parseFloat(event.target.value);
            }
        });
    });

    pauseResumeButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseResumeButton.textContent = isPaused ? 'Resume' : 'Pause';
    });

    animate();
})();
