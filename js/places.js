window.onload = () => {
    let method = 'static';

    if (method === 'static') {
        let places = staticLoadPlaces();
        renderPlaces(places);
    }

    if (method !== 'static') {

        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

                dynamicLoadPlaces(position.coords)
                    .then((places) => {
                        renderPlaces(places);
                    })
            },
            (err) => console.error('Error in retrieving position', err), {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};

function staticLoadPlaces() {
    return [
        {
            name: '학과사무실',
            location: {
                lat: 35.2492471,
                lng: 128.9023104
            }
        },
        {
            name: '화장실2',
            location: {
                lat: 35.2491295,
                lng: 128.9020552
            }
        },
        {
            name: '쉼터',
            location: {
                lat: 35.2495214,
                lng: 128.9019975
            }
        },
        {
            name: 'P&N부스',
            location: {
                lat:128.902047,
                lan:35.2495114
            }
        }
    ];
}

// getting places from REST APIs
function dynamicLoadPlaces(position) {
    let params = {
        radius: 5, // search places not farther than this value (in meters)
        clientId: 'HZIJGI4COHQ4AI45QXKCDFJWFJ1SFHYDFCCWKPIJDWHLVQVZ',
        clientSecret: '',
        version: '20300101',
    };

    let corsProxy = 'https://cors-anywhere.herokuapp.com/';

    let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

function additionalrender(){
    
}

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        const latitude = place.location.lat;
        const longitude = place.location.lng;

        const icon = document.createElement('a-image');
        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        icon.setAttribute('name', place.name);
        icon.setAttribute('src', 'images/map-marker.png');
        icon.setAttribute('scale', '1, 1');
        icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));
        const clickListener = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            const name = ev.target.getAttribute('name');

            const el = ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
                // const label = document.createElement('span');
                // const container = document.createElement('div');
                // container.setAttribute('id', 'place-label');
                // label.innerText = name;
                // container.appendChild(label);
                // document.body.appendChild(container);

                // setTimeout(() => {
                //     container.parentElement.removeChild(container);
                // }, 1500);
                var tmpToast = Toastify({
                    text: name,
                    duration: 1500
                });
                tmpToast.showToast();
            }
        };

        icon.addEventListener('click', clickListener);

        scene.appendChild(icon);
        console.log(icon.getAttribute('name') + " is loaded");



    });
}