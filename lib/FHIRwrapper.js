
export class FHIRwrapper {
    #resource = "Patient";
    #filters = {};
    #id = "";
    #processFunction;
    #FHIR;
    #server;

    constructor(FHIR, server = "https://r4.smarthealthit.org") {
       this.#server = server;
       this.#FHIR = FHIR;
       this.client = new this.#FHIR.client(server);
    }

    addFilter(key, value) {
       this.#filters[key] = value;
    }

    showFilters() {
       return JSON.stringify(this.#filters);
    }

    //accessors for resource. right now they don't do anything, but they may need handling in the future
    set resource(resource) {
       this.#resource = resource;
    }
    get resource() {
       return this.#resource;
    }

    set id(id) {
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    set processFunction(func) {
        this.#processFunction = func;
    }

    execute() {
       this.client.request(this.buildRequest(), { pageLimit: 0, flat: true }).then(this.#processFunction);
    }

    buildRequest() {
       let ret = this.resource;
       if (this.#id != "") { // we have set a particular id, meaning we aren't searching. just return the resource/id uri
        ret += `/${this.#id}/`
        return ret
       }
       let querystring = "";
       if (Object.keys(this.#filters).length > 0) {
          let keys = Object.keys(this.#filters);
          keys.forEach(element => {
             if(querystring != "") {
                querystring += "&";
             }
             querystring += element + "=" + this.#filters[element];
          });
          ret += "?" + querystring;
       }
       return ret; 
    }
 }

    

  
