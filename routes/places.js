const express = require('express');
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });


router.get('/', async (req, res) => {
    const places = await req.db.findPlaces();

    //[TEST]
    console.log("--------GET ('/')-------------");
    console.log(places);

    res.json({ places: places });
});

router.put('/', async (req, res) => {
    //Find the long and lat of the address 
    const result =  await geocoder.geocode(req.body.address);
    let lat = 0;
    let lng = 0;
    let addr = "";
    if(result.length > 0){
        console.log("--------------PUT----------------------------------");
        console.log(result);

        lat = result[0].latitude;
        lng = result[0].longitude;
        addr = result[0].formattedAddress 
        console.log(`The location of Ramapo is ${lat} and ${lng}`);
        console.log(result[0].formattedAddress);

        console.log("------------------------------------------------");
    }

    /**
     * [NOTE!!!]
     * may return more than one result, and it may return zero results. Make sure you 
     * handle these cases well! A latitude and longitude of 0 for anything not found is 
     * appropriate. Also note that the "proper" address is also returned, which **should 
     * be used as the address stored in the database.
     */
    
    const id = await req.db.createPlace(req.body.label, addr, lat, lng);
    res.json({ id: id });
});

router.delete('/:id', async (req, res) => {
    await req.db.deletePlace(req.params.id);
    res.status(200).send();
})

module.exports = router;