let markers = new Array();
let map = null;

const addPlace = async () => {
    const label = document.querySelector("#label").value;
    const address = document.querySelector("#address").value;
    const lat = 0;
    const lng = 0;
    await axios.put('/places', { label: label, address: address, lat:lat, lng:lng});

    let labelInput = document.getElementById("label");
    let addressInput = document.getElementById("address");
    // Clear the input fields
    labelInput.value = "";
    addressInput.value = "";

    await loadPlaces();
}

const deletePlace = async (id) => {
    await axios.delete(`/places/${id}`);
    await loadPlaces();
}

const generateMap = async() =>{
    map = L.map('map').setView([41, -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

//function call to when a row is clicked
const on_row_click = (e) => {
     // the element clicked
    console.log(e.target)
    // prints the element type (ie. TD)
    console.log(e.target.tagName) 

    let row = e.target;
    if (e.target.tagName.toUpperCase() === 'TD') {
        row = e.target.parentNode;
    }
    
    //extracting the lat and long for the map to fly to
    const lat = row.dataset.lat;
    const lng = row.dataset.lng;
    map.flyTo(new L.LatLng(lat, lng));
}

const loadPlaces = async () => {
    const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
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

            //adding markers to the map 
            if(place.lat != 0 && place.lng != 0){
                let marker = L.marker([place.lat, place.lng]).addTo(map);
                marker.bindPopup(`<b>${place.label}</b><br/>${place.address}`);
                markers.push(marker);
            }
            
        }
    }

    console.log(markers);
}