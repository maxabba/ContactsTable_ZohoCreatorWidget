ZOHO.CREATOR.init()
    .then(function (data) {


        var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
        var Aree_ISF = queryParams.Aree_ISF;

        Aree_ISF = Aree_ISF.replace(/"/g, '').replace("[", '').replace("]", '').split(",");

        config = {
            appName: "Omnia",
            reportName: "Contatti_Report",
            criteria: "Area_ISF in thisapp.getAreaUser()",
        }

        //get all records API
        ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
            console.log(response);

            //define dropdown component for select


            function createMultiCheckboxCellRenderer(params, numCheckboxes) {
                var container = document.createElement('div');


                function isInPastQuartersbyMonthName(monthName) {
                    var currentMonth = new Date().getMonth();
                    var monthIndex = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"].indexOf(monthName);
                    return monthIndex < currentMonth;
                }

                function onChange(value) {
                    return function () {
                        // Assicurarsi che params.value sia una stringa
                        var currentValue = String(params.value);
                        var data = currentValue.split(",");
                        var index = data.indexOf(value);
                        if (index > -1) {
                            data.splice(index, 1);
                        } else {
                            data[parseInt(value) - 1] = value;
                        }
                        params.setValue(data.join(","));

                        updateCheckboxStates();
                    };
                }

                function isChecked(value) {
                    // Assicurarsi che params.value sia una stringa
                    var currentValue = String(params.value);
                    return currentValue.includes(value);
                }

                // Aggiorna lo stato disabled delle checkbox in base ai valori attuali
                function updateCheckboxStates() {
                    for (let i = 0; i < numCheckboxes; i++) {
                        var checkbox = container.querySelector(`input[data-index="${i}"]`);

                        if (i === 0) {
                            // Logica specifica per il primo checkbox, se necessaria
                            var nextChecked = isChecked(String(i + 2));  // Controlla se il secondo è spuntato (i+2 perché l'indice parte da 0)
                            checkbox.disabled = !!nextChecked; // Disabilita se il secondo checkbox è spuntato
                        } else {
                            var prevChecked = isChecked(String(i));      // Controlla se il precedente è spuntato
                            var nextChecked = i === numCheckboxes - 1 ? false : isChecked(String(i + 2));  // Controlla se il successivo è spuntato
                            checkbox.disabled = !prevChecked || !!nextChecked;
                        }
                    }
                }


                // Creazione delle checkbox
                for (let i = 0; i < numCheckboxes; i++) {
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = `checkbox-${i + 1}`;
                    checkbox.setAttribute('data-index', i);
                    if (isInPastQuartersbyMonthName(params.column.colDef.field)) {
                        checkbox.disabled = true;
                    } else {
                        checkbox.addEventListener('change', onChange(String(i + 1)));
                    }
                    checkbox.checked = isChecked(String(i + 1));
                    //add br to separate checkbox
                    container.appendChild(checkbox);
                    //container.appendChild(document.createTextNode(i + 1));
                    container.appendChild(document.createElement('br'));

                }

                container.addEventListener('click', function (event) {
                    event.stopPropagation();
                });

                if (!isInPastQuartersbyMonthName(params.column.colDef.field)) {
                    updateCheckboxStates();
                }
                return container;
            }


            function total_views_quoter(params, moth) {
                //make a function that sum the value of the 3 checkbox in the 3 month

                // var currentValue = String(params.data.Gennaio) + "," + String(params.data.Febbraio) + "," + String(params.data.Marzo);

                //foreach moth (array) make the same ov current valure definition
                var currentValue = "";
                for (let i = 0; i < moth.length; i++) {
                    currentValue += String(params.data[moth[i]]) + ",";
                }

                var data = currentValue.split(",");
                var sum = 0;
                for (let i = 0; i < data.length; i++) {
                    if (data[i] === "") {
                        sum += 0;
                    } else {
                        sum += 1;
                    }
                }
                return sum;
            }


            const gridOptions = {
                autoSizeStrategy: {
                    type: 'fitCellContents'
                },

                // Row Data: The data to be displayed.
                rowData: response.data,

                // Column Definitions: Defines the columns to be displayed.
                columnDefs: [
                    {field: "ID", hide: true,},
                    {
                        field: "Nome.display_value",
                        headerName: "Nome e Cognome",
                        sortable: true,
                        filter: true,
                        resizable: true,
                        editable: true
                    },
                    {
                        field: "Email",
                        sortable: true,
                        filter: true,
                        resizable: true,
                        maxWidth: 250,
                        tooltipField: "Email"
                    },
                    {field: "Cellulare", sortable: true, filter: true, resizable: true},
                    {field: "Professione", sortable: true, filter: true, resizable: true},
                    {
                        headerName: "Indirizzo",
                        autoSizeStrategy: {
                            type: 'fitCellContents'
                        },
                        children: [
                            {field: "In_field.display_value", headerName: "Indirizzo", columnGroupShow: 'closed'},
                            {
                                field: "In_field.address_line_1",
                                headerName: "Indirizzo",
                                sortable: true,
                                filter: true,
                                resizable: true,
                                columnGroupShow: 'open'
                            },
                            {
                                field: "In_field.district_city",
                                headerName: "Città",
                                sortable: true,
                                filter: true,
                                resizable: true,
                                columnGroupShow: 'open'
                            },
                            {
                                field: "In_field.postal_code",
                                headerName: "CAP",
                                sortable: true,
                                filter: true,
                                resizable: true,
                                columnGroupShow: 'open'
                            },
                            {
                                field: "In_field.state_province",
                                headerName: "Provincia",
                                sortable: true,
                                filter: true,
                                resizable: true,
                                columnGroupShow: 'open'
                            },
                            {
                                field: "In_field.country",
                                headerName: "Nazione",
                                sortable: true,
                                filter: true,
                                resizable: true,
                                columnGroupShow: 'open'
                            },
                        ]
                    },
                    {
                        field: "Area_ISF", headerName: "Area", sortable: true, filter: true,
                        cellEditor: 'agSelectCellEditor',
                        cellEditorParams: {
                            values: Aree_ISF,
                        }, resizable: true
                    },
                    {
                        headerName: "Q1",
                        headerGroupComponent: colGroupClass,
                        children: [
                            {
                                headerName: "Gen-Mar", columnGroupShow: 'closed', cellRenderer: function (params) {
                                    return total_views_quoter(params, ["Gennaio", "Febbraio", "Marzo"]);
                                },
                            },
                            {
                                field: "Gennaio", headerName: "Gen", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                            {
                                field: "Febbraio", headerName: "Feb", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                            {
                                field: "Marzo", headerName: "Mar", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                        ],
                    },
                    {
                        headerName: "Q2",
                        headerGroupComponent: colGroupClass,
                        children: [
                            {
                                headerName: "Apr-Giu",
                                columnGroupShow: 'closed',
                                cellRenderer: function (params) {
                                    return total_views_quoter(params, ["Aprile", "Maggio", "Giugno"]);
                                }
                            },
                            {
                                field: "Aprile", headerName: "Apr", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                            {
                                field: "Maggio", headerName: "Mag", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                            {
                                field: "Giugno", headerName: "Giu", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                        ],
                    },
                    {
                        headerName: "Q3",
                        headerGroupComponent: colGroupClass,
                        children: [
                            {
                                headerName: "Lug-Set",
                                columnGroupShow: 'closed',
                                cellRenderer: function (params) {
                                    return total_views_quoter(params, ["Luglio", "Agosto", "Settembre"]);
                                }
                            },
                            {
                                field: "Luglio", headerName: "Lug", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                            {
                                field: "Agosto", headerName: "Ago", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                            {
                                field: "Settembre", headerName: "Set", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                        ],
                    },
                    {
                        headerName: "Q4",
                        headerGroupComponent: colGroupClass,
                        children: [
                            {
                                headerName: "Ott-Dic",
                                columnGroupShow: 'closed',
                                cellRenderer: function (params) {
                                    return total_views_quoter(params, ["Ottobre", "Novembre", "Dicembre"]);
                                }
                            },
                            {
                                field: "Ottobre", headerName: "Ott", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                            {
                                field: "Novembre", headerName: "Nov", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            },
                            {
                                field: "Dicembre", headerName: "Dic", editable: true, columnGroupShow: 'open',
                                cellRenderer: function (params) {
                                    return createMultiCheckboxCellRenderer(params, 3);
                                },
                                field_type: "checkbox",
                                maxWidth: 80,

                            }
                        ],
                    }

                ],
                domLayout: 'autoHeight',
                defaultColDef: {
                    suppressMovable: true,
                    flex: 1,
                    resizable: false,
                    autoHeight: true,
                    sortable: false,
                    filter: false,
                },
                pagination: true,
                // Enable Pagination: Allows to paginate the data.
                paginationPageSize: 100,
                //enable editing
                singleClickEdit: true,

                onCellValueChanged: function (event) {
                    var recordId = event.data.ID; // Assuming 'ID' is the field that contains the record ID
                    var field = event.column.colId; // The field that was changed
                    var newValue = event.newValue; // The new value of the field
                    if (event.column.getColDef().field_type === "checkbox") {
                        newValue = newValue.split(",").sort();
                    }
                    var data = {};
                    data[field] = newValue; // Create the data object for the API call

                    var formData = {
                        "data": data
                    }

                    var config = {
                        appName: "Omnia",
                        reportName: "Contatti_Report", // Replace with your form name
                        id: recordId,
                        data: formData
                    };
                    console.log(formData);
                    ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
                        console.log(response);
                    });
                }
            };


            // Your Javascript code to create the grid
            const myGridElement = document.querySelector('#myGrid');
            const api = agGrid.createGrid(myGridElement, gridOptions);

        });
    });