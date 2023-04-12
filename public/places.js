let markers = new Array();

const addPlace = async () => {
    console.log("document: " + document);
    const label = document.querySelector("#label").value;
    const address = document.querySelector("#address").value;
    const lat = document.querySelector("#lat").value;
    const lng = document.querySelector("#lng").value;
    await axios.put('/places', { label: label, address: address, lat:lat, lng:lng});
    await loadPlaces();
}

const deletePlace = async (id) => {
    await axios.delete(`/places/${id}`);

    //deleting markers
    // for(var i = o; i < markers.length; i++){
    //     map.removeLayer(markers[i]);
    // }

    await loadPlaces();
}

const generateMap = async() =>{
    const map = L.map('map').setView([41, -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

const loadPlaces = async () => {
    //generating the map
    const map = L.map('map').setView([41, -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    if (response && response.data && response.data.places) {
        for (const place of response.data.places) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${place.label}</td>
                <td>${place.address}</td>
                <td>
                    <button class='btn btn-danger' onclick='deletePlace(${place.id})'>Delete</button>
                </td>
            `;
            tr.dataset.lat = place.lat;
            tr.dataset.lng = place.lng;
            tr.onclick = on_row_click;
            tbody.appendChild(tr);  

            if(place.lat !== 0 && place.lng !== 0){
                let marker = L.marker([place.lat, place.lng]).addTo(map);
                marker.bindPopup(`<b>${place.label}</b><br/>${place.address}`);
                markers.push(marker);
            }
            
        }
    }

    console.log(markers);
}