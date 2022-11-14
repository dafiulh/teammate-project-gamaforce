class  GeoJSONNonPersistantStorage{
    constructor(){
        //jsObject: JS Array
        this._jsObject =[]
    }
    addGeoJSON(geoJSONstr){
        this._jsObject.push(geoJSONstr)
    }
    getGeoJSONs(){
        return this._jsObject
    }
    deleteGeoJSONs(index){
        this._jsObject.splice(index,1)
    }
}

const geoDB= new GeoJSONNonPersistantStorage()
module.exports= geoDB