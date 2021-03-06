export default class GetData {
    /*
    * 'element' - node.
    * 'data' - array of objects with key 'url' for endpoint.
    */
    constructor(element, data) {
        /*
        * Make passed in 'element' available within scope.
        */
        this.element = element;

        /*
        * Make passed in 'data' available within scope.
        */
        this.data = data;

        /*
        * Set references to the dom elements we need to access.
        */
        this.getElements();

        /*
        * Set up our event listeners.
        */
        this.setEvents();

        /*
        * Get our results on initial load.
        */
        this.getResults();

        /*
        * Check to see what the current selected filter is on initialisation
        * and set our inital filter query.
        */
        this.setFilterQuery();

        /*
        * Set select filter form elements to be disabled.
        */
        this.isLoaded(true);
    }

    getElements() {
        /*
        * Filtering form element.
        */
        this.formElement = this.element.querySelector('.js-results-form');

        /*
        * Filtering select element.
        */
        this.filterElement = this.element.querySelector('.js-results-filter');

        /*
        * Filtering form button.
        */
       this.buttonElement = this.element.querySelector('.js-results-button');

        /*
        * Target HTML tag for outputting the results.
        */
        this.resultsElement = this.element.querySelector('.js-results-output');
    }

    setEvents() {
        /*
        * If the form is submitted let's update the results.
        */
        this.formElement.addEventListener('submit', event => {
            event.preventDefault();

            this.setFilterQuery();
            this.setResults();
        }, false);

        /*
        * On change of the select filter let's update our results.
        */
        this.filterElement.addEventListener('change', event => {
            this.setFilterQuery();
            this.setResults();
        }, false);
    }

    setFilterQuery() {
        /*
        * Get the current filtered state.
        */
        this.filterQuery = this.filterElement.options[this.filterElement.selectedIndex].value;
    }
  
    setFilterItems() {
        /*
        * Set up our filters based on the returned api endpoints.
        */
        this.promiseAllData.forEach(filterItem => {
            this.filterElement.options[this.filterElement.options.length] = new Option(filterItem.name, filterItem.id);
        });
    }

    getResults() {
        /*
        * Set up empty array to build up our array of promises from our api endpoints.
        */
        let promises = [];

        /*
        * Request our api endpoint and add returned promises to our array.
        */
        this.data.forEach(data => {
            promises.push(this.request(data));
        });

        /*
        * Set our results in the order we have requested them.
        */
        Promise.all(promises)
            .then(data => {
                /*
                * Make the returned promises available in scope.
                */
                this.promiseAllData = data;
                
                /*
                * Set up our initial filter items and results.
                */
                this.setFilterItems();
                this.setResults();
            });
    }

    request(data) {
        /*
        * Fetch our results from the passed in api endpoints
        * returning JSON data and catching any errors.
        */
        return fetch(data.url)
            .then(response => response.json())
            .then(results => results)
            .catch(console.log.bind(console));
    }
 
    setResults() {
        let hasError = false;

        /*
        * Clean out results output wrapper of any existing HTML.
        * This also clears out the initial 'loading' <li>.
        */
        this.resultsElement.innerHTML = '';

        /*
        * Filter results and output HTML template.
        */
        this.filterBy(this.promiseAllData, this.filterQuery).forEach((setData, index) => {
            if (setData) {
                setData.pokemon.forEach(item => {
                    this.resultsElement.innerHTML += `
                        <li>
                            <dl>
                                <dt class="name">Name:</dt>
                                <dd class="name"><a href="${item.pokemon.url}">${item.pokemon.name}</a></dd>
                                <dt class="ability">Ability:</dt>
                                <dd class="ability">${setData.name}</dd>
                                <dt>Effect:</dt>
                                <dd>${setData.effect_entries[0].effect}</dd>
                                <dt>Generation:</dt>
                                <dd>${setData.generation.name}</dd>
                            </dl>
                        </li>
                    `;
                });
            } else if(!hasError) {
                hasError = true;
            }
        });

        /*
        * If we don't get all our requests back show a message to the user
        * and give steps to help resolve the issue.
        */
        if (hasError) {
            this.resultsElement.innerHTML = `
                <li>
                    <p>There was an error loading some or all of the content.</p>
                    
                    <p>Please <a href="#" onclick="javascript: window.location.reload();">refresh the page</a> and try again or contact support on <a href="tel:+441234567890">01234 567890</a> or <a href="support@acme.com">support@acme.com</a>.</p>
                </li>
            `;
        }

        /*
        * Set results form elements to be enabled now we've updated the HTML.
        */
        this.isLoaded(false);
    }

    filterBy(array) {
        /*
        * We are filtering by id.
        * If we pass in an id of 'all' let's just return everything.
        */
        if (this.filterQuery === 'all') {
            return array;
        }

        /*
        * Filter results based on the current select dropdown value.
        */
        return array.filter(data => {
            return data.id == this.filterQuery;
        });
    }

    isLoaded(boolean) {
        /*
        * Disable/enable the form button.
        */
        this.buttonElement.disabled = boolean;

        /*
        * Disable/enable the form select dropdown.
        */
        this.filterElement.disabled = boolean;
    }
}
