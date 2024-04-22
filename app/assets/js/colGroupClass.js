class colGroupClass {

    init(params) {
        this.params = params;
        this.eGui = document.createElement('div');
        this.eGui.className = 'ag-header-group-cell-label';
        this.eGui.innerHTML = '' +
            '<div class="customExpandButton"><div class="customHeaderLabel">' + this.params.displayName + ' -></div>' +
            '</div>';

        this.onExpandButtonClickedListener = this.expandOrCollapse.bind(this);
        this.eExpandButton = this.eGui.querySelector(".customExpandButton");
        this.eExpandButton.addEventListener('click', this.onExpandButtonClickedListener);

        this.onExpandChangedListener = this.syncExpandButtons.bind(this);
        this.params.columnGroup.getProvidedColumnGroup().addEventListener('expandedChanged', this.onExpandChangedListener);



        this.syncExpandButtons();
        this.setQuarterOnReady();

    }

    setQuarterOnReady() {

        // Only execute if the quarter has not been set yet
        if (!this.params.columnGroup.getProvidedColumnGroup().isExpanded()) {            // Get the current month
            var currentMonth = new Date().getMonth();

            // Map the current month to the corresponding quarter (1-4)
            var currentQuarter;
            if (currentMonth < 3) {
                currentQuarter = "Q1";
            } else if (currentMonth < 6) {
                currentQuarter = "Q2";
            } else if (currentMonth < 9) {
                currentQuarter = "Q3";
            } else {
                currentQuarter = "Q4";
            }
            // If the current quarter matches the display name of the column group, expand it
            if (this.params.displayName === currentQuarter) {
                this.expandOrCollapse();
            }
            // Set the flag to true to prevent further execution
        }
    }
    getGui() {
        return this.eGui;
    }


    expandOrCollapse() {
        var currentState = this.params.columnGroup.getProvidedColumnGroup().isExpanded();
        this.params.setExpanded(!currentState);
    }

    syncExpandButtons() {
        function collapsed(toDeactivate) {
            toDeactivate.className = toDeactivate.className.split(' ')[0] + ' collapsed';
        }

        function expanded(toActivate) {
            toActivate.className = toActivate.className.split(' ')[0] + ' expanded';
        }

        if (this.params.columnGroup.getProvidedColumnGroup().isExpanded()) {
            expanded(this.eExpandButton);
        } else {
            collapsed(this.eExpandButton);
        }
    }

    destroy() {
        this.eExpandButton.removeEventListener('click', this.onExpandButtonClickedListener);
    }
}