const dom = {

  show(id) {
    if (typeof id === 'string') {
      document.getElementById(id).style.display = "block";
    } else {
      id.style.display = "block";
    };
  },

  hide(id) {
    if (typeof id === 'string') {
      document.getElementById(id).style.display = "none";
    } else {
      id.style.display = "none";
    };
  },

  get(id) {
    return document.getElementById(id);
  },

  makeId(n=12) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');
    var id = '';
    for (var i = 0; i < n; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    };
    return id;
  },

  getUrlParams() {
    // convert URL query params into object. Example:
    // www.app.com/?paramkey=paramval => {paramkey: paramval}
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  },


  setSelectOption(selId, itemName) {
    // from a select dropdown ID, get the select element
    // and select the option with the correct itemName
    const sel = document.getElementById(selId);
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text === itemName) {
          sel.selectedIndex = i;
          break;
      };
    };
  },

  addSelectOptions(sel, options) {
    // add an array of options to a select element
    for (let x of options){
      var opt = document.createElement('option');
      opt.value = x;
      opt.innerHTML = x;
      sel.appendChild(opt);
    };
  },

  addParamToUrl(key, val) {
    // add a query parameter to the current URL
    let url = window.location.href;
    let addition = (url.indexOf('?') > -1) ? `&${key}=${val}` : `?${key}=${val}`;
    url += addition;
  },

  make(tag="div", info={}) {
    /*
    Make a DOM element.
    Inputs:
    type: string representation of element. e.g. "div", "a", "button"
    info: object containing the element info. Example:
    info = {
      'id': 'el_id',
      'class': 'mt-2 bg-dark',
      'style': {'overflow': 'auto'},
      'parent': 'parent_id',
      'datasets': {"dataset1": "hello", "dataset2": [1,2,3]}
    }
    Output: element which was created.
    If created element is a table, output is [table, thead, tbody]
    */
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(info)) {
      if (k === "style") {
        Object.assign(el.style, v);
      } else if (k === "class") {
        for (let c of v.split(" ")){
          el.classList.add(c);
        };
      } else if (k === "events") {
        for (let e of v){
          el.addEventListener(e[0], e[1]);
        };
      } else if (k === "parent") {
        if (typeof v === "string") {
          document.getElementById(v).appendChild(el);
        } else {
          v.appendChild(el);
        };
      } else if (k === "datasets") {
        for (const [dname, dval] of Object.entries(v)){
          el.setAttribute(`data-${dname}`, dval);
        };
      } else if (k === "innerHTML") {
        el.innerHTML = v;
      } else if ([
        'id', 'src', 'alt', 'name', 'type', 'href',
        'target', 'text', 'value', 'placeholder',
        'height', 'width', 'draggable', 'contentEditable',
        'min', 'max', 'step', 'rows', 'required',
        'checked', 'onkeypress', 'pattern',
      ].includes(k)) {
        el.setAttribute(k, v);
      } else if (k == "disabled") {
          if (v) {
            el.setAttribute("disabled", "disabled");
          } else {
            el.removeAttribute("disabled");
          };
      } else if (k === "children") {
        for (let c of v){
          const el_child = dom.make(c[0], c[1]);
          el.appendChild(el_child);
        };
      } else if (!["tableData", "df"].includes(k)) {
        console.log(`No action performed for new component "${tag}" with info key: ${k}`);
      };
    };
    if (tag === "table") {
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      el.appendChild(thead);
      el.appendChild(tbody);

      // populate the table if data is provided as an array of objects
      if (info.hasOwnProperty('tableData')) {
        const headers = Object.keys(info.tableData[0]);
        const headrow = thead.insertRow();
        // populate table headers
        for (let h of headers) {
          const th = document.createElement('th');
          th.innerHTML = h;
          headrow.appendChild(th);
        };
        // populate table body
        for (let record of info.tableData){
          const row = tbody.insertRow();
          for (let h of headers){
            const cell = row.insertCell();
            if (typeof record[h] === 'object') {
              cell.innerHTML = JSON.stringify(record[h]);
            } else {
              cell.innerHTML = record[h];
            };
          };
        };
      };
      // populate the table if data is provided
      // as an object of form {cols: [...], vals: [[...], [...], ...]}
      if (info.hasOwnProperty('df')) {
        const headers = info.df.cols;
        const headrow = thead.insertRow();
        // populate table headers
        for (let h of headers) {
          const th = document.createElement('th');
          th.innerHTML = h;
          headrow.appendChild(th);
        };
        // populate table body
        for (let record of info.df.vals){
          const row = tbody.insertRow();
          for (let r of record){
            const cell = row.insertCell();
            cell.innerHTML = r;
          };
        };
      };

      // return table
      return [el, thead, tbody];
    } else {
      return el;
    };
  },

  getParentOfType(el, type="LI") {
    /*
    Get parent element of a certain type by
    recursively checking parents until 
    the parent type matches keyword *type*.
    */
    if (el.nodeName === type.toUpperCase()) {
      return el
    } else {
      let parent = el.parentNode;
      if (parent.nodeName === type.toUpperCase()) {
          return parent
      } else {
        return dom.getParentOfType(parent, type=type)
      }
    }
  },


  // check if element is inside another (useful for drag 'n drops)
  isInside(one, other) {
    return one.offset().left >= other.offset().left &&
        one.offset().top >= other.offset().top &&
        one.offset().top + one.height() <= other.offset().top + other.height() &&
        one.offset().left + one.width() <= other.offset().left + other.width();
  },


  // send GET request to retrieve data from the server
  getRequest: async function(url) {
  const response = await fetch(url, {method: 'GET'});
  return response.json();
  },



  // switch an element's innerHTML from one to another
  switchInnerHTML(el, i1, i2){
    const innerHTML = el.innerHTML
    if (innerHTML.includes(i1) && ! innerHTML.includes(i2)){
      el.innerHTML = el.innerHTML.replace(i1, i2);
    } else if (innerHTML.includes(i2) && ! innerHTML.includes(i1)){ 
      el.innerHTML = el.innerHTML.replace(i2, i1);
    };
  },


  // switch an element's class from one to another
  switchClass(el, c1, c2){
    const classes = Array.from(el.classList);
    if (classes.includes(c1) && ! classes.includes(c2)){
        el.classList.remove(c1);
        el.classList.add(c2);
    } else if (classes.includes(c2) && ! classes.includes(c1)){ 
      el.classList.remove(c2);
      el.classList.add(c1);
    };
  },


  getDataTableSettings(options) {
    // Create a settings object for DataTables
    const obj = {
      scrollX: true,
      pageLength: 10,
      language: {
          "search": '',//'<span class="material-icons">search</span>',
          "searchPlaceholder": "Search...",
      },
      fixedHeader: true,
      fixedHeader: {
          headerOffset: 72,
      },
    };
    for (let k of Object.keys(options)){
      obj[k] = options[k];
    }
    return obj;
  },

  capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  },

};